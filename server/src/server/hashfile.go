package server

import (
	"crypto/sha256"
	"io/ioutil"
	"encoding/hex"
)

func Hash(filename string) (string, error) {
	bytes, err := ioutil.ReadFile(filename)

	if err != nil {
		return "", err
	}

	sha_256 := sha256.New()
	sha_256.Write(bytes)

	return hex.EncodeToString(sha_256.Sum(nil)), nil
}