package com.jumpstart.ims.security;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.jumpstart.ims.models.User;
import com.jumpstart.ims.repository.UserRepository;

@Component
public class AuthProvider implements AuthenticationProvider {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();

        Optional<User> user = userRepository.findByUsername(username);

        if (user.isPresent()) {
            User userData = user.get();
            if (userData.getUsername().equals(username) && passwordEncoder.matches(password, userData.getPassword())) {
                ArrayList<GrantedAuthority> roles = new ArrayList<GrantedAuthority>();
                roles.add(new SimpleGrantedAuthority(userData.getRole().getRole()));
                return new UsernamePasswordAuthenticationToken(userData.getUsername(), userData.getPassword(), roles);

            }
        }

        return null;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }

}
