package com.jumpstart.ims.controller;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jumpstart.ims.service.TokenProvider;

@RestController
public class GlobalController {

    @Autowired
    private TokenProvider tokenProvider;

    @PostMapping("/is-token-valid")
    private ValidationRes isTokenValid(@RequestHeader("Authorization") String token) {
        String processedToken = token.split("Bearer ")[1];
        return new ValidationRes(tokenProvider.validateToken(processedToken),
                new String(Base64.getDecoder().decode(tokenProvider.getUserFromToken(processedToken))));
    }

    @PostMapping("/contact-us")
    private Map<String, Object> sendMessage(@RequestBody ContactUsData messageData) throws JsonProcessingException {
        Map<String, Object> result = new HashMap<String, Object>();

        String webhook = new String(Base64.getDecoder().decode(
                "aHR0cHM6Ly9ob29rcy5zbGFjay5jb20vc2VydmljZXMvVDA0MEdEOTZSVU4vQjA0Q0hKU1Q0Rjcvd2M5QmZGRlJTUWZCVmdEMWlXT3E1NnN0"));

        RestTemplate template = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonMessage = new HashMap<>();

        String text = messageData.getSender() + " has sent a message: \n\n" + messageData.getMessage();
        jsonMessage.put("text", text);
        String message = objectMapper.writeValueAsString(jsonMessage);

        HttpEntity<String> entity = new HttpEntity<>(message, headers);

        template.exchange(webhook, HttpMethod.POST, entity, String.class);

        result.put("message_sent", true);

        return result;
    }

}

class ContactUsData {
    private String sender;
    private String message;

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
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
