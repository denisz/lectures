package server

import (
	"github.com/boltdb/bolt"
	"log"
	"fmt"
	"encoding/json"
	"encoding/binary"
	"errors"
)

var (
	ErrSessionNotFound 	= errors.New("Session not represented")
	ErrAccountNotFound 	= errors.New("Account not represented")
	ErrAccountDuplicate 	= errors.New("Duplicate account error")
	BktAccounts 		= []byte("accounts")
	BktUsers  		= []byte("users")
	BktNotes  		= []byte("notes")
	BktResults  		= []byte("results")
	BktSessions  		= []byte("sessions")
)

type Storage struct {
	DB *bolt.DB
}

type StorageConfig struct {
	Path  string
}

func ItoB(v uint64) []byte {
	b := make([]byte, 8)
	binary.BigEndian.PutUint64(b, v)
	return b
}

func NewStorageConfig () *StorageConfig {
	config := StorageConfig{}
	config.Path = "my.db"
	return &config
}

func NewStorage (config *StorageConfig) *Storage {
	storage := Storage{}
	db, err := bolt.Open(config.Path, 0600, nil)
	if err != nil {
		log.Fatal(err)
	}

	db.Update(func(tx *bolt.Tx) error {
		tx.CreateBucketIfNotExists(BktUsers)
		tx.CreateBucketIfNotExists(BktAccounts)
		tx.CreateBucketIfNotExists(BktResults)
		tx.CreateBucketIfNotExists(BktSessions)
		tx.CreateBucketIfNotExists(BktNotes)
		return nil
	})

	storage.DB = db
	return &storage
}

func (p *Storage) Close() {
	p.DB.Close()
}

func (p *Storage) FindUserBySocialId(user *User, account *Account) error {
	return p.DB.View(func(tx *bolt.Tx) error {

		root := tx.Bucket(BktAccounts)
		hash := account.Hash()
		bytes := root.Get(hash)

		fmt.Printf("Try find user with hash %s \n", hash)
		if bytes == nil {
			return ErrAccountNotFound
		}

		if err := json.Unmarshal(bytes, account); err != nil {
			return err
		}

		user.ID = account.UserId
		return p.FindUser(user)
	})
}

func (p *Storage) SaveUser(user *User) error {
	return  p.DB.Update(func(tx *bolt.Tx) error {
		root := tx.Bucket(BktUsers)

		if user.ID == 0 {
			ID, _ := root.NextSequence()
			user.ID = ID
			fmt.Printf("Write user with id %d \n", ID)
		}

		if buf, err := json.Marshal(user); err != nil {
			return err
		} else if err := root.Put(ItoB(user.ID), buf); err != nil {
			return err
		}

		return nil
	})
}

func (p *Storage) SaveAccount(user *User, account *Account) error {
	account.UserId = user.ID

	return  p.DB.Update(func(tx *bolt.Tx) error {
		root := tx.Bucket(BktAccounts)
		hash  := account.Hash()
		bytes := root.Get(hash)

		if bytes == nil {
			ID, _ := root.NextSequence()
			account.ID = ID

			fmt.Printf("Write account with hash %s \n", hash)

			if buf, err := json.Marshal(account); err != nil {
				return err
			} else if err := root.Put(hash, buf); err != nil {
				return err
			}

			return nil
		}

		return ErrAccountDuplicate
	})
}

func (p *Storage) FindOrCreateNewUser(user *User, account *Account) error {
	var err error

	if err = p.FindUserBySocialId(user, account); err == nil {
		return nil
	}

	fmt.Printf("%s \n", err.Error())

	if err = p.SaveUser(user); err != nil {
		return err
	}

	return p.SaveAccount(user, account)
}

func (p *Storage) FindUser (user *User) error {
	return p.DB.View(func(tx *bolt.Tx) error {
		root := tx.Bucket(BktUsers)
		bytes := root.Get(ItoB(user.ID))

		if bytes == nil {
			return ErrAccountNotFound
		}

		if err := json.Unmarshal(bytes, user); err != nil {
			return err
		}

		return nil

	})
}

func (p *Storage) FindSession (session *Session) error {
	return p.DB.View(func(tx *bolt.Tx) error {
		root := tx.Bucket(BktSessions)
		bytes := root.Get([]byte(session.ID))

		if bytes == nil {
			return ErrSessionNotFound
		}

		if err := json.Unmarshal(bytes, session); err != nil {
			return err
		}

		return nil

	})
}

func (p *Storage) FindUserBySession(user *User, session *Session) error {
	if err := p.FindSession(session); err != nil {
		return err
	}

	user.ID = session.UserId
	if err := p.FindUser(user); err != nil {
		return err
	}

	return nil
}

func (p *Storage) SaveSession(session *Session) error {
	return  p.DB.Update(func(tx *bolt.Tx) error {
		root := tx.Bucket(BktSessions)
		if buf, err := json.Marshal(session); err != nil {
			return err
		} else if err := root.Put([]byte(session.ID), buf); err != nil {
			return err
		}

		return nil
	})
}

func (p *Storage) RevokeSession(session *Session) error {
	return p.DB.Update(func(tx *bolt.Tx) error {
		root := tx.Bucket(BktSessions)
		return root.Delete([]byte(session.ID))
	})
}

func (p *Storage) SaveResult(result *Result) error {
	return  p.DB.Update(func(tx *bolt.Tx) error {
		root := tx.Bucket(BktResults)
		ID, _ := root.NextSequence()
		result.ID = ID

		if buf, err := json.Marshal(result); err != nil {
			return err
		} else if err := root.Put(ItoB(result.ID), buf); err != nil {
			return err
		}

		return nil
	})
}

func (p *Storage) LoadResults(user *User) ([]Result, error) {
	results := []Result{}
	err := p.DB.View(func(tx *bolt.Tx) error {
		root := tx.Bucket(BktResults)
		c := root.Cursor()
		result := NewResult()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			if err := json.Unmarshal(v, result); err == nil {
				if result.UserId == user.ID {
					results = append(results, *result)
				}
			}
		}

		return nil
	})

	return results, err
}

func (p *Storage) LoadAllResults() ([]Result, error) {
	results := []Result{}
	err := p.DB.View(func(tx *bolt.Tx) error {
		root := tx.Bucket(BktResults)
		c := root.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			result := NewResult()
			if err := json.Unmarshal(v, result); err == nil {
				results = append(results, *result)
			}
		}

		return nil
	})

	return results, err
}

func (p *Storage) LoadAllUsers() ([]User, error) {
	users := []User{}

	err := p.DB.View(func(tx *bolt.Tx) error {
		root := tx.Bucket(BktUsers)
		c := root.Cursor()

		user := NewUser()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			if err := json.Unmarshal(v, user); err == nil {
				users = append(users, *user)
			}
		}

		return nil
	})

	return users, err
}

func (p *Storage) SaveNote(note *Note) error {
	return  p.DB.Update(func(tx *bolt.Tx) error {
		root := tx.Bucket(BktNotes)
		ID, err := root.NextSequence()
		if err != nil {
			return err
		}

		note.ID = ID

		if buf, err := json.Marshal(note); err != nil {
			return err
		} else if err := root.Put(ItoB(note.ID), buf); err != nil {
			return err
		}

		return nil
	})
}

func (p *Storage) LoadNotes(user *User) ([]*Note, error) {
	results := []*Note{}
	err := p.DB.View(func(tx *bolt.Tx) error {
		root := tx.Bucket(BktNotes)
		c := root.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			fmt.Printf("key=%s, value=%s\n", k, v)
		}

		return nil
	})

	return results, err
}







