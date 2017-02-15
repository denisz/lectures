package main

import (
	s "server"
	"log"
	"flag"
	"fmt"
	"net"
	"errors"
)

func main () {
	configName := "config.yml"
	flag.StringVar(&configName, 	"w", "config.yaml", "Config file")
	flag.Parse()

	config, err := s.LoadConfig(configName)

	flag.IntVar(&config.Port, 	"port", 8083, "Server port")
	flag.StringVar(&config.Db, 	"db","my.db", "Storage file")
	flag.StringVar(&config.User, 	"u", "admin", "Login admin user")
	flag.StringVar(&config.Pass,	"p", "admin", "Password admin user")
	flag.Parse()

	storageConfig := s.NewStorageConfig()
	storageConfig.Path = config.Db
	storage := s.NewStorage(storageConfig)
	defer storage.Close()

	if err != nil {
		log.Fatal(err)
	}

	router := s.NewRouter(config, storage)

	address, err := externalIP()
	if err != nil {
		fmt.Errorf("%s", err.Error())
		address = "localhost"
	}

	fmt.Printf("The server is running at http://%s:%d \n", address, config.Port)
	log.Fatal(router.ListenAndServe(config.Port))
}

func externalIP() (string, error) {
	ifaces, err := net.Interfaces()
	if err != nil {
		return "", err
	}
	for _, iface := range ifaces {
		if iface.Flags&net.FlagUp == 0 {
			continue // interface down
		}
		if iface.Flags&net.FlagLoopback != 0 {
			continue // loopback interface
		}
		addrs, err := iface.Addrs()
		if err != nil {
			return "", err
		}
		for _, addr := range addrs {
			var ip net.IP
			switch v := addr.(type) {
			case *net.IPNet:
				ip = v.IP
			case *net.IPAddr:
				ip = v.IP
			}
			if ip == nil || ip.IsLoopback() {
				continue
			}
			ip = ip.To4()
			if ip == nil {
				continue // not an ipv4 address
			}
			return ip.String(), nil
		}
	}
	return "", errors.New("are you connected to the network?")
}