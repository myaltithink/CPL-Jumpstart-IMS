package com.jumpstart.ims.config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jumpstart.ims.models.User;
import com.jumpstart.ims.repository.UserRepository;
import com.jumpstart.ims.service.TokenProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class RequestFilter extends OncePerRequestFilter {

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String token = getRequestToken(request);
            if (StringUtils.hasText(token)) {
                if (tokenProvider.validateToken(token)) {
                    Optional<User> user = userRepository.findByUsername(
                            new String(Base64.getDecoder().decode(tokenProvider.getUserFromToken(token))));

                    ArrayList<GrantedAuthority> roles = new ArrayList<GrantedAuthority>();
                    roles.add(new SimpleGrantedAuthority(user.get().getRole().getRole()));

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            user.get().getUsername(), null, roles);

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            System.out.println("An Error occured while trying to authenticate the request");
            System.out.println("Exception: " + e.getMessage());
        }

        filterChain.doFilter(request, response);

    }

    private String getRequestToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7, bearer.length());
        }
        return "";
    }

}
