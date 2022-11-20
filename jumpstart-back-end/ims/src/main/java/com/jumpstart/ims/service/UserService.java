package com.jumpstart.ims.service;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jumpstart.ims.models.User;
import com.jumpstart.ims.models.payload.LoginPayload;
import com.jumpstart.ims.repository.RoleRepository;
import com.jumpstart.ims.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AuthenticationProvider authenticationProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenProvider tokenProvider;

    public boolean registerUser(String username, String password) {
        userRepository.save(new User(username, password, roleRepository.findByRole("ROLE_USER"), new Date()));
        Optional<User> user = userRepository.findByUsername(username);
        return user.isPresent();
    }

    public LoginPayload authenticateUser(LoginPayload loginInfo) {
        Authentication auth = authenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(loginInfo.getUsername(), loginInfo.getPassword()));

        if (auth == null) {
            Optional<User> user = userRepository.findByUsername(loginInfo.getUsername());
            if (!user.isPresent())
                return LoginPayload.loginError("username", "The given username is not registered");

            else if (!passwordEncoder.matches(loginInfo.getPassword(), user.get().getPassword()))
                return LoginPayload.loginError("password", "Incorrect password");

            else
                return LoginPayload.loginError("Unknown", "Something went wrong while trying to authenticate");
        }

        SecurityContextHolder.getContext().setAuthentication(auth);

        Token token = tokenProvider.createToken(auth.getPrincipal().toString());

        return LoginPayload.loginSuccess(token.getToken(), token.getExpiry());
    }

}
