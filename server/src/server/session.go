package server

import (
	"time"
	"github.com/satori/go.uuid"
)

type Session struct {
	ID string
	UserId uint64
	AccountId uint64
	Created time.Time
	Expired time.Time
}

func NewSession () *Session {
	session := Session{}
	session.ID = uuid.NewV4().String()
	session.Created = time.Now()
	return &session
}

func NewSessionWithUser (user *User, account *Account) *Session {
	session := NewSession()
	session.UserId = user.ID
	session.AccountId = account.ID
	return session
}
