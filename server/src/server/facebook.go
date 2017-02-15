package server

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

type ResponseFB struct {
	Id    string
	Error struct {
		Message string
	}
}

var (
	ErrInvalidTokenFb = errors.New("Invalid OAuth access token")
)

func ValidFacebook(accessToken string, socialId string, config *Config) error {
	var (
		parse  = ResponseFB{}
		client = &http.Client{}
		url    = "https://graph.facebook.com/v2.5/" + "me?fields=id&access_token=" + accessToken
	)

	fmt.Println("Facebook request: ", url)

	if resp, ok := client.Get(url); ok == nil && resp.StatusCode == 200 {
		json.NewDecoder(resp.Body).Decode(&parse)
		resp.Body.Close()
		fmt.Println("Facebook answer id: ", parse.Id, "expected: ", socialId)
		if parse.Id == socialId {
			return nil
		}
	}

	return ErrInvalidTokenFb
}
