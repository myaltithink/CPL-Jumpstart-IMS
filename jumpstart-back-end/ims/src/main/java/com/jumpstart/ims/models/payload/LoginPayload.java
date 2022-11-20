package com.jumpstart.ims.models.payload;

import java.util.Date;

public class LoginPayload {

    public String username;
    public String password;
    public boolean success;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public static LoginPayload loginSuccess(String accessToken, Date expiry) {
        return new LoginSuccessPayload(accessToken, expiry);
    }

    public static LoginPayload loginError(String errorIn, String errorMessage) {
        return new LoginErrorPayload(errorIn, errorMessage);
    }

}

class LoginSuccessPayload extends LoginPayload {
    public boolean authenticationSuccess = true;
    public String accessToken;
    public Date expiry;

    public LoginSuccessPayload(String accessToken, Date expiry) {
        this.accessToken = accessToken;
        this.success = true;
        this.expiry = expiry;
    }
}

class LoginErrorPayload extends LoginPayload {
    public String errorMessage;
    public String errorIn;

    public LoginErrorPayload(String errorIn, String errorMessage) {
        this.errorIn = errorIn;
        this.errorMessage = errorMessage;
    }

}
