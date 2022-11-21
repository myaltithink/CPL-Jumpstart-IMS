package com.jumpstart.ims.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jumpstart.ims.models.Account;
import com.jumpstart.ims.models.Store;
import com.jumpstart.ims.repository.AccountRepository;
import com.jumpstart.ims.repository.StoreRepository;

@RestController
@RequestMapping("admin")
public class AdminDashboard {

    @Autowired
    private StoreRepository storeRepository;

    @GetMapping("/get-users")
    public ArrayList<UserDTO> getUsers() {
        ArrayList<UserDTO> users = new ArrayList<UserDTO>();
        List<Store> stores = storeRepository.findAll();
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMM-dd-yyyy HH:mm:ss");

        if (stores.size() != 0) {
            stores.forEach((store) -> {
                Account account = store.getAccount();
                users.add(new UserDTO(store.getStoreName(), store.getStoreAddress(), store.getStoreContact(),
                        account.getUsername(), dateFormat.format(account.getRegisteredAt())));
            });
        }

        return users;
    }

    @GetMapping("/get-user-count")
    public Map<String, Object> userCounts() {
        Map<String, Object> result = new HashMap<>();

        List<Store> stores = storeRepository.findAll();

        result.put("userCount", stores.size());

        return result;
    }

}

class UserDTO {
    private String storeName;
    private String storeAddress;
    private String storeContact;
    private String username;
    private String registeredAt;

    public UserDTO(String storeName, String storeAddress, String storeContact, String username, String registeredAt) {
        this.storeName = storeName;
        this.storeAddress = storeAddress;
        this.storeContact = storeContact;
        this.username = username;
        this.registeredAt = registeredAt;
    }

    public String getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(String registeredAt) {
        this.registeredAt = registeredAt;
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
