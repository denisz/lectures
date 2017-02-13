package server

import "time"

type User struct {
	Provider string
	SocialId string
	ID int
	Created time.Time
	UserName string
	Password string
}


func NewUser() *User {
	user := User{}
	return &user
}