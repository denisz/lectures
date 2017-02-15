package server

import "time"

type User struct {
	ID uint64
	Created time.Time
	DisplayName string
	Picture string
	Admin bool
}


func NewUser() *User {
	user := User{}
	user.Admin = false
	user.Created = time.Now()
	return &user
}

func NewAdmin () *User {
	user := NewUser()
	user.Admin = true
	return user
}