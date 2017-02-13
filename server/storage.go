package server

import (
	"github.com/boltdb/bolt"
	"log"
)

type Storage struct {
	DB *bolt.DB
}

type StorageConfig struct {
	path  string
}

type AuthProvider struct {
	Provider string
	SocialID string
}


func NewStorageConfig () *StorageConfig {
	config := StorageConfig{}
	config.path = "my.db"
	return &config
}

func NewStorage (config *StorageConfig) *Storage {
	storage := Storage{}
	db, err := bolt.Open(config.path, 0600, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	storage.DB = db
	return &storage
}


func (p *Storage) FindUserBySocialId(provider *AuthProvider) (*User, error) {

}

func (p *Storage) CreateUser(provider *AuthProvider) (*User, error) {

}

func (p *Storage) FindUserBySession(session *Session) (*User, error) {

}

func (p *Storage) NewSession(provider *AuthProvider) *Session {

}

func (p *Storage) RevokeSession(provider *AuthProvider) {

}

func (p *Storage) NewResult(session *Session, results []byte) {

}

func (p *Storage) LoadResults(session *Session) []Result {

}







