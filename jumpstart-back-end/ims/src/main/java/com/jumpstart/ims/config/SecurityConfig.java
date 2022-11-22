package com.jumpstart.ims.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private RequestFilter requestFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        return http
                .cors()
                .and()
                .csrf().disable()
                .formLogin().disable()
                .httpBasic().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeHttpRequests(authorize -> {
                    authorize
                            .requestMatchers("/auth/test", "/auth/perform-login",
                                    "/is-token-valid", "/test/**")
                            .permitAll()
                            .requestMatchers("/auth/**", "/store/**").authenticated()
                            .requestMatchers("/auth/add-account", "/admin/**").hasAnyRole("ADMIN", "ROOT_ADMIN");
                })
                .addFilterBefore(requestFilter, UsernamePasswordAuthenticationFilter.class)
                .build();

    }

}
