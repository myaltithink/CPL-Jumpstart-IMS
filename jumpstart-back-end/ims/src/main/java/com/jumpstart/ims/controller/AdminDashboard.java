package com.jumpstart.ims.controller;

import java.util.ArrayList;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("admin")
public class AdminDashboard {

    @GetMapping("/get-users")
    public ArrayList<UserDTO> getUsers() {
        ArrayList<UserDTO> users = new ArrayList<UserDTO>();

        return users;
    }

}

class UserDTO {
    private String storeName;
    private String storeAddress;
    private String storeContact;
    private String username;

    public UserDTO(String storeName, String storeAddress, String storeContact, String username) {
        this.storeName = storeName;
        this.storeAddress = storeAddress;
        this.storeContact = storeContact;
        this.username = username;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getStoreAddress() {
        return storeAddress;
    }

    public void setStoreAddress(String storeAddress) {
        this.storeAddress = storeAddress;
    }

    public String getStoreContact() {
        return storeContact;
    }

    public void setStoreContact(String storeContact) {
        this.storeContact = storeContact;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}
