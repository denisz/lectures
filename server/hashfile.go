package server

import (
	"crypto/sha256"
	"io/ioutil"
)

func Hash(filename string) ([]byte, error) {
	bytes, err := ioutil.ReadFile(filename)

	if err != nil {
		return nil, err
	}

	sha_256 := sha256.New()
	sha_256.Write(bytes)
	return  sha_256.Sum(nil), nil
}