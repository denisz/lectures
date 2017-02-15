package server

import (
	"time"
	"fmt"
)

type Account struct {
	ID uint64
	UserId uint64
	Provider string
	SocialId string
	Created time.Time
}

func (p *Account) Hash() []byte {
	hash := fmt.Sprintf("%s:%s", p.Provider, p.SocialId)
	return []byte(hash)
}

func NewAccount() *Account {
	account := Account{}
	account.Created = time.Now()
	return &account
}