package server

import "testing"

func TestValidVkontakte(t *testing.T) {
	var config = &Config{
		Social: struct {
			FB_APP_ID     string
			FB_SECRET_KEY string
			VK_APP_ID     string
			VK_SECRET_KEY string
		}{
			VK_APP_ID:     "5498445",
			VK_SECRET_KEY: "hgzLVKdje8JRig2QfuCl",
		},
	}
	//https://oauth.vk.com/authorize?client_id=5498445&scope=offline&response_type=token
	var aToken = "1b142d0aa66f104b7ec26f4cc85ec25420ef01bc6ab6eeffeeaa8781fefc330e3d2010f95d19f38eb6182"
	var userId = "9290994"

	err := ValidVkontakte(aToken, userId, config)
	if err != nil {
		t.Error("For valid accessToken got error: ", err)
	}
}
