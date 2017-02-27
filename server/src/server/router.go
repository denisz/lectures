package server

import (
	"net/http"
	"fmt"
	"encoding/json"
	"errors"
	"time"
	"strconv"
	"strings"
)

type Router struct {
	Config *Config
	Serve *http.ServeMux
	Storage *Storage
}

var (

	ErrPassSessionId   = errors.New("Passing request sessionId")
	ErrEnoughArguments = errors.New("Not enough arguments")
	ErrForbidden       = errors.New("Forbidden")
	ErrUnsupported	   = errors.New("Unsupported Format")
	HeaderSessionKey   = "Application-Session-ID"
	CookieSessionKey   = "SessionID"
	PacketFilePath     = "data.zip"
)

func NewRouter (config *Config, storage *Storage) *Router{
	router := Router{}

	serve := http.NewServeMux()
	serve.Handle("/who",  		http.HandlerFunc(router.WhoIs))
	serve.Handle("/user",  		http.HandlerFunc(router.User))
	serve.Handle("/social",  	http.HandlerFunc(router.Social))
	serve.Handle("/login",   	http.HandlerFunc(router.Login))
	serve.Handle("/logout",  	http.HandlerFunc(router.Logout))
	serve.Handle("/result",  	http.HandlerFunc(router.SaveResult))
	serve.Handle("/results", 	http.HandlerFunc(router.GetResults))
	serve.Handle("/access",  	http.HandlerFunc(router.TakeAdminAccess))
	serve.Handle("/note",    	http.HandlerFunc(router.SaveNote))
	serve.Handle("/notes",   	http.HandlerFunc(router.GetNotes))
	serve.Handle("/updater", 	http.HandlerFunc(router.Updater))
	serve.Handle("/data", 	 	http.HandlerFunc(router.GetData))

	serve.Handle("/table", 	 	http.HandlerFunc(router.Table))
	serve.Handle("/export", 	 	http.HandlerFunc(router.Export))

	serve.Handle("/users",  		http.HandlerFunc(router.GetUsers))

	router.Serve 	= serve
	router.Config 	= config
	router.Storage 	= storage

	return &router
}

func BadRequest(w http.ResponseWriter, err error) {
	http.Error(w, err.Error(), http.StatusInternalServerError)
}

func SuccessJSON(w http.ResponseWriter, obj interface{}) {
	w.WriteHeader(200)
	w.Header().Add("Content-Type", "application/json")

	bytes, err := json.Marshal(obj)

	if err != nil {
		BadRequest(w, err)
		return
	}

	w.Write(bytes)
}

func SuccessMessage (w http.ResponseWriter, message string) {
	w.WriteHeader(200)
	w.Write([]byte(message))
}

func SuccessBytes (w http.ResponseWriter, message []byte) {
	w.WriteHeader(200)
	w.Write(message)
}

func RecordSession(w http.ResponseWriter, session *Session) {
	if session == nil {
		cookie := http.Cookie{Name: CookieSessionKey, Value: "", Secure: false, MaxAge: -1}
		http.SetCookie(w, &cookie)
	} else {
		expiration := time.Now().Add(365 * 24 * time.Hour)
		cookie := http.Cookie{Name: CookieSessionKey, Value: session.ID, Secure: false , Expires: expiration}
		http.SetCookie(w, &cookie)
	}
}

func GiveSessionId(r *http.Request) string {

	for _, cookie := range r.Cookies() {
		if cookie.Name == CookieSessionKey {
			return cookie.Value
		}
	}

	return r.Header.Get(HeaderSessionKey)
}

func (p *Router) WhoIs(w http.ResponseWriter, r *http.Request) {
	user := NewUser()

	if err := p.TakeUser(user, r); err != nil {
		BadRequest(w, err)
		return
	}

	SuccessJSON(w, user)
}

func (p *Router) User(w http.ResponseWriter, r *http.Request) {
	user := NewUser()

	if err := p.TakeUser(user, r); err != nil {
		BadRequest(w, err)
		return
	}

	if err := RequiredAdmin(user); err != nil {
		BadRequest(w, err)
		return
	}

	id := r.FormValue("id")
	if len(id) == 0 {
		SuccessJSON(w, []User{})
		return
	}

	ids := strings.Split(id, ",")
	target  := NewUser()
	results := []User{}

	for _, id := range ids {
		if targetID, err := strconv.ParseUint(id, 10, 0); err == nil {
			target.ID = targetID
			if err := p.Storage.FindUser(target); err == nil {
				results = append(results, *target)
			}
		}
	}


	SuccessJSON(w, results)
}

func (p *Router) TakeAdminAccess(w http.ResponseWriter, r *http.Request) {
	user := NewUser()
	if err := p.TakeUser(user, r); err != nil {
		BadRequest(w, err)
		return
	}

	var (
		admin = r.FormValue("user")
		pass  = r.FormValue("pass")
	)

	if admin != p.Config.User || pass != p.Config.Pass {
		BadRequest(w, ErrForbidden)
		return
	}

	user.Admin = true
	if err := p.Storage.SaveUser(user); err != nil {
		BadRequest(w, err)
		return
	}

	SuccessJSON(w, user)
}

func (p *Router) TakeSession(session *Session, r *http.Request) error {
	var sessionId = GiveSessionId(r)
	if len(sessionId) == 0 {
		return ErrPassSessionId
	}

	session.ID = sessionId
	return p.Storage.FindSession(session)
}

func (p *Router) TakeUser(user *User, r *http.Request) error {
	session := NewSession()
	if err := p.TakeSession(session, r); err != nil {
		return err
	}

	user.ID = session.UserId
	if err := p.Storage.FindUser(user); err != nil {
		return err
	}

	return nil
}

func RequiredAdmin (user *User) error {
	if !user.Admin {
		return ErrForbidden
	}

	return nil
}

func (p *Router) SaveResult(w http.ResponseWriter, r *http.Request) {
	user := NewUser()
	if err := p.TakeUser(user, r); err != nil {
		BadRequest(w, err)
		return
	}

	result, err := NewResultFromJSON(r.Body)
	if  err != nil {
		BadRequest(w, err)
		return
	}

	result.UserId = user.ID
	if err := p.Storage.SaveResult(result); err != nil {
		BadRequest(w, err)
		return
	}

	SuccessJSON(w, result)
}

func (p *Router) GetResults(w http.ResponseWriter, r *http.Request) {
	user := NewUser()

	if err := p.TakeUser(user, r); err != nil {
		BadRequest(w, err)
		return
	}

	results, err := p.Storage.LoadResults(user)

	if err != nil {
		BadRequest(w, err)
		return
	}

	SuccessJSON(w, results)
}

func (p *Router) SaveNote(w http.ResponseWriter, r *http.Request) {
	user := NewUser()
	if err := p.TakeUser(user, r); err != nil {
		BadRequest(w, err)
		return
	}

	data := r.FormValue("data")

	if len(data) == 0 {
		BadRequest(w, ErrEnoughArguments)
		return
	}

	note := NewNote()
	note.Data = []byte(data)
	note.UserId = user.ID

	if err := p.Storage.SaveNote(note); err != nil {
		BadRequest(w, err)
		return
	}

	SuccessJSON(w, note)
}

func (p *Router) GetNotes(w http.ResponseWriter, r *http.Request) {
	user := NewUser()

	if err := p.TakeUser(user, r); err != nil {
		BadRequest(w, err)
		return
	}

	results, err := p.Storage.LoadNotes(user)

	if err != nil {
		BadRequest(w, err)
		return
	}

	SuccessJSON(w, results)
}


func (p *Router) Export (w http.ResponseWriter, r *http.Request) {
	//user := NewUser()
	//
	//if err := p.TakeUser(user, r); err != nil {
	//	BadRequest(w, err)
	//	return
	//}
	//
	//if err := RequiredAdmin(user); err != nil {
	//	BadRequest(w, err)
	//	return
	//}

	format := r.FormValue("format")

	if len(format) == 0 {
		BadRequest(w, ErrEnoughArguments)
		return
	}

	results, err := p.Storage.LoadAllResults()

	if err != nil {
		BadRequest(w, err)
		return
	}

	switch format {
	case "xlsx":
		path, err := ExportByXLSX(results)
		if err != nil {
			BadRequest(w, err)
			return
		}

		fmt.Printf("Export: %s \n", path)

		http.ServeFile(w, r, path)
		break
	default:
		BadRequest(w, ErrUnsupported)
	}
}

func (p *Router) Table(w http.ResponseWriter, r *http.Request) {
	user := NewUser()

	if err := p.TakeUser(user, r); err != nil {
		BadRequest(w, err)
		return
	}

	if err := RequiredAdmin(user); err != nil {
		BadRequest(w, err)
		return
	}

	results, err := p.Storage.LoadAllResults()

	if err != nil {
		BadRequest(w, err)
		return
	}

	SuccessJSON(w, results)
}

func (p *Router) GetUsers(w http.ResponseWriter, r *http.Request) {
	user := NewUser()

	if err := p.TakeUser(user, r); err != nil {
		BadRequest(w, err)
		return
	}

	if err := RequiredAdmin(user); err != nil {
		BadRequest(w, err)
		return
	}

	users, err := p.Storage.LoadAllUsers()

	if err != nil {
		BadRequest(w, err)
		return
	}

	SuccessJSON(w, users)
}

func (p *Router) GetData (w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, PacketFilePath)
}

func (p *Router) Login(w http.ResponseWriter, r *http.Request) {
	var (
		login = r.FormValue("login")
		pass  = r.FormValue("pass")
	)

	fmt.Printf("%s %s", login, pass)
}

//региструем нового пользователя
//или создаем нового
func (p *Router) Social(w http.ResponseWriter, r *http.Request) {
	var (
		accessToken 	= r.FormValue("accessToken")
		provider    	= r.FormValue("provider")
		socialId    	= r.FormValue("socialId")
		displayName     = r.FormValue("displayName")
		picture     	= r.FormValue("picture")
	)

	if err := AccessTokenValidate(provider, accessToken, socialId, p.Config); err != nil {
		BadRequest(w, err)
		return
	}

	account := NewAccount()
	user 	:= NewUser()

	user.DisplayName = displayName
	user.Picture  	 = picture

	account.Provider = provider
	account.SocialId = socialId

	if err := p.Storage.FindOrCreateNewUser(user, account); err != nil {
		BadRequest(w, err)
		return
	}

	session := NewSessionWithUser(user, account)

	if err := p.Storage.SaveSession(session); err != nil {
		BadRequest(w, err)
		return
	}

	RecordSession(w, session)
	SuccessJSON(w, struct {
		User *User
		Session *Session
	}{
		User: user,
		Session: session,
	})
}

func (p *Router) Logout(w http.ResponseWriter, r *http.Request) {
	session := NewSession()

	if err := p.TakeSession(session, r); err != nil {
		BadRequest(w, err)
		return
	}


	if err := p.Storage.RevokeSession(session); err != nil {
		BadRequest(w, err)
		return
	}

	RecordSession(w, nil)
	SuccessMessage(w, "OK")
}

func (p *Router) Updater(w http.ResponseWriter, r *http.Request) {
	hash, err := Hash(PacketFilePath)

	if err != nil {
		BadRequest(w, err)
		return
	}

	SuccessMessage(w, hash)
}

func (p *Router) ListenAndServe(port int) error {
	return http.ListenAndServe(fmt.Sprintf(":%d", port), p.Serve)
}