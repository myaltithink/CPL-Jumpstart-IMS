package com.jumpstart.ims.controller;

import java.util.Base64;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jumpstart.ims.models.Account;
import com.jumpstart.ims.models.payload.LoginPayload;
import com.jumpstart.ims.models.payload.NewStore;
import com.jumpstart.ims.repository.AccountRepository;
import com.jumpstart.ims.service.TokenProvider;
import com.jumpstart.ims.service.UserService;

@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private UserService userService;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private AccountRepository userRepository;

    @PostMapping("/perform-login")
    public LoginPayload authenticateUser(@RequestBody LoginPayload loginInfo) {
        return userService.authenticateUser(loginInfo);
    }

    @PostMapping("/is-admin")
    public boolean isTokenAdmin(@RequestHeader("Authorization") String token) {
        String processedToken = token.split("Bearer ")[1];
        Account user = userRepository
                .findByUsername(new String(Base64.getDecoder().decode(tokenProvider.getUserFromToken(processedToken))))
                .get();

        return user.getRole().getRole().equals("ROLE_ADMIN") || user.getRole().getRole().equals("ROLE_ROOT_ADMIN");
    }

    @PostMapping("/add-store")
    public Map<String, Object> addStore(@RequestBody NewStore storeInfo) {
        return userService.registerUser(storeInfo);
    }

}
