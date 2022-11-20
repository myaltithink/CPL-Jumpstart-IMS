package com.jumpstart.ims.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jumpstart.ims.models.payload.LoginPayload;
import com.jumpstart.ims.service.UserService;

@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private UserService userService;

    @PostMapping("/perform-login")
    public LoginPayload authenticateUser(@RequestBody LoginPayload loginInfo) {
        return userService.authenticateUser(loginInfo);
    }

    @PostMapping("/is-token-valid")
    public boolean isTokenValid(String token) {
        return true;
    }

    @GetMapping("/test")
    public String testMap() {
        return "mapping works";
    }

    @GetMapping("/test2")
    public String testMap2() {
        System.out.println("test authe req");
        return "auth mapping works";
    }
}
