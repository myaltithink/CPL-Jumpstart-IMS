package com.jumpstart.ims.controller;

import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.jumpstart.ims.service.TokenProvider;

@RestController
public class ValidateRequestToken {

    @Autowired
    private TokenProvider tokenProvider;

    @PostMapping("/is-token-valid")
    private ValidationRes isTokenValid(@RequestHeader("Authorization") String token) {
        String processedToken = token.split("Bearer ")[1];
        return new ValidationRes(tokenProvider.validateToken(processedToken),
                new String(Base64.getDecoder().decode(tokenProvider.getUserFromToken(processedToken))));
    }

}

class ValidationRes {
    private boolean isTokenValid;
    private String username;

    public ValidationRes(boolean isTokenValid, String username) {
        this.isTokenValid = isTokenValid;
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isTokenValid() {
        return isTokenValid;
    }

    public void setTokenValid(boolean isTokenValid) {
        this.isTokenValid = isTokenValid;
    }
}
