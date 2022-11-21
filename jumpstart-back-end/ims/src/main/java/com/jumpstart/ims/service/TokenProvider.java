package com.jumpstart.ims.service;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jumpstart.ims.config.AppProperties;
import com.jumpstart.ims.repository.AccountRepository;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

@Service
public class TokenProvider {

    @Autowired
    private AppProperties properties;

    @Autowired
    private AccountRepository userRepository;

    public Token createToken(String username) {
        Date expiry = new Date(new Date().getTime() + properties.getJwt().getExpiresIn());
        String token = Jwts.builder()
                .setSubject(Base64.getEncoder().encodeToString(username.getBytes()))
                .setIssuedAt(new Date())
                .setExpiration(expiry)
                .signWith(generateTokenKey())
                .compact();

        return new Token(token, expiry);
    }

    private Key generateTokenKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(properties.getJwt().getKey()));
    }

    public String getUserFromToken(String token) {
        String username = "";
        try {
            username = Jwts.parserBuilder()
                    .setSigningKey(generateTokenKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();

        } catch (ExpiredJwtException e) {
            System.out.println("Token Exception: " + e.getLocalizedMessage());
            return "wasd";
        } catch (UnsupportedJwtException e) {
            System.out.println("Token Exception: " + e.getLocalizedMessage());
            return "wasd";
        } catch (MalformedJwtException e) {
            System.out.println("Token Exception: " + e.getLocalizedMessage());
            return "wasd";
        } catch (SignatureException e) {
            System.out.println("Token Exception: " + e.getLocalizedMessage());
            return "wasd";
        } catch (IllegalArgumentException e) {
            System.out.println("Token Exception: " + e.getLocalizedMessage());
            return "wasd";
        }
        return username;
    }

    public boolean validateToken(String token) {
        return userRepository.findByUsername(new String(Base64.getDecoder().decode(getUserFromToken(token))))
                .isPresent();

    }
}

class Token {
    private String token;
    private Date expiry;

    public Token(String token, Date expiry) {
        this.token = token;
        this.expiry = expiry;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getExpiry() {
        return expiry;
    }

    public void setExpiry(Date expiry) {
        this.expiry = expiry;
    }

}
