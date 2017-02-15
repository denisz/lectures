package server

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
)

var (
	ErrInvalidTokenVk = errors.New("Invalid OAuth access token")
)

type ResponseVK struct {
	Response struct {
		Id int `json:"user_id"`
	}
	AccessToken string `json:"access_token"`
	Error       struct {
		error_msg string
	}
}

func ValidVkontakte(accessToken string, socialId string, config *Config) error {
	var (
		parse  = ResponseVK{}
		client = http.Client{}
		url    = "https://oauth.vk.com/access_token?client_id=" + config.Social.VK_APP_ID + "&client_secret=" + config.Social.VK_SECRET_KEY + "&v=5.59&grant_type=client_credentials"
	)

	fmt.Println("Vkontakte request: ", url)

	if resp, ok := client.Get(url); ok == nil && resp.StatusCode == 200 {
		json.NewDecoder(resp.Body).Decode(&parse)
		resp.Body.Close()
		fmt.Println("Vkontakte request accessToken: ", parse.AccessToken)

		url = "https://api.vk.com/method/secure.checkToken?token=" + accessToken + "&client_secret=" + config.Social.VK_SECRET_KEY + "&access_token=" + parse.AccessToken
		fmt.Println("Vkontakte request: ", url)

		if resp, ok = client.Get(url); ok == nil && resp.StatusCode == 200 {
			json.NewDecoder(resp.Body).Decode(&parse)
			resp.Body.Close()
			fmt.Println("Vkontakte answer id: ", strconv.Itoa(parse.Response.Id), "expected: ", socialId, strconv.Itoa(parse.Response.Id) == socialId)

			if strconv.Itoa(parse.Response.Id) == socialId {
				return nil
			}
		}
	}

	return ErrInvalidTokenVk
}
