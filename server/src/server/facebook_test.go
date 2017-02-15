package server

import "testing"

func TestValidFacebook(t *testing.T) {
	var config = &Config{
		Social: struct {
			FB_APP_ID     string
			FB_SECRET_KEY string
			VK_APP_ID     string
			VK_SECRET_KEY string
		}{
			FB_APP_ID:     "1162876090441588",
			FB_SECRET_KEY: "ec7bbec8fa7e5ae4cafef3100dcfc4cc",
		},
	}

	//https://developers.facebook.com/tools/accesstoken/?app_id=1162876090441588
	var aToken = "EAAQhoTBJ33QBANi3MWnl13VG8pfIpRnB9kfMZAZBv21rCMJYUdyLXcE8chUdrobUFE5xyq0osfQ8Dl8BwApragZBWzkz4s2xUndpTrAZABjAWNHSAr3N9nSAFZAofCTpIJDzzm8I9DUPpF4ZCjbP8dsYLdgur0eJZCVzpkRL8hhCIK90hzb2ZCr9Gv8CmQ2TSvoZD"
	var userId = "1145031952184554"

	err := ValidFacebook(aToken, userId, config)
	if err != nil {
		t.Error("For valid accessToken got error: ", err)
	}
}
