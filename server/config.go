package server

import (
	"io/ioutil"

	"gopkg.in/yaml.v2"
)

type Config struct {
	Social struct {
		FB_APP_ID     string
		FB_SECRET_KEY string
		VK_APP_ID     string
		VK_SECRET_KEY string
	}
	DB struct {
		path string
	}
}

func LoadConfig(filename string) (*Config, error) {
	config := Config{}

	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return &config, err
	}

	err = yaml.Unmarshal([]byte(data), &config)
	if err != nil {
		return &config, err
	}

	return &config, nil
}
