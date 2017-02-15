package server

import (
	"errors"
)

const (
	FB = "fb"
	VK = "vk"
)

var (
	ErrInvalidProvider    = errors.New("Provider is not supported")
	ErrNotFound           = errors.New("Not Found")
	ErrEnoughtParams      = errors.New("Not enough arguments")
	ErrEmptyAccessToken   = errors.New("AccesssToken is empty")
	ErrInValidAccessToken = errors.New("AccesssToken is invalid")
	ErrEmptySocialId      = errors.New("SocialId is empty")
)

var (
	AvailableProviders     = map[string]bool{FB: true, VK: true}
	ValidatorsAccessTokens = map[string]func(string, string, *Config) error{
		FB: ValidFacebook,
		VK: ValidVkontakte,
	}
)

func AccessTokenValidate(provider string, accessToken string, socialId string, config *Config) error {
	validator, ok := ValidatorsAccessTokens[provider]

	if len(accessToken) == 0 || len(socialId) == 0 || ok == false {
		return ErrEnoughtParams
	}

	if err := validator(accessToken, socialId, config); err != nil {
		return ErrInValidAccessToken
	}

	return nil
}

func ProviderValidate(provider string) error {
	if _, ok := AvailableProviders[provider]; ok {
		return ErrInvalidProvider
	}
	return nil
}

func IDValidate(hash string, strong bool) error {
	if strong && len(hash) == 0 {
		return ErrEmptySocialId
	}
	return nil
}
