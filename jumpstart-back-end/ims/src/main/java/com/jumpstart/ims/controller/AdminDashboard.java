package com.jumpstart.ims.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jumpstart.ims.models.Account;
import com.jumpstart.ims.models.Inventory;
import com.jumpstart.ims.models.Store;
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
                users.add(new UserDTO(store.getStoreName(), store.getStoreAddress(),
                        store.getStoreContact(),
                        account.getUsername(), dateFormat.format(account.getRegisteredAt())));
            });
        }

        users.sort(new Comparator<UserDTO>() {

            @Override
            public int compare(UserDTO u1, UserDTO u2) {
                return u1.getStoreName().compareTo(u2.getStoreName());
            }

        });

        return users;
    }

    @GetMapping("/get-user-count")
    public Map<String, Object> userCounts() {
        Map<String, Object> result = new HashMap<>();

        List<Store> stores = storeRepository.findAll();

        result.put("userCount", stores.size());

        return result;
    }

    @PostMapping("/get-user-inventories")
    private ArrayList<InventoryDTO> getUserInventories() {
        ArrayList<InventoryDTO> inventories = new ArrayList<InventoryDTO>();

        List<Store> stores = storeRepository.findAll();
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMM-dd-yyyy HH:mm:ss");

        stores.forEach((store) -> {
            Account storeAccount = store.getAccount();
            Inventory storeInventory = store.getInventory();

            inventories.add(
                    new InventoryDTO(storeAccount.getUsername(), store.getStoreName(), storeInventory.getTotalItems(),
                            storeInventory.getCapacity(), dateFormat.format(storeInventory.getCreatedAt()),
                            "view-inventory-" + storeAccount.getUsername()));
        });

        inventories.sort(new Comparator<InventoryDTO>() {
            @Override
            public int compare(InventoryDTO inv1, InventoryDTO inv2) {
                return inv1.getStoreName().compareTo(inv2.getStoreName());
            }
        });

        return inventories;
    }

}

class InventoryDTO {
    private String storeName;
    private String username;
    private int totalItems;
    private int capacity;
    private String createdAt;
    private String action = "view-user-inventory";

    public InventoryDTO(String username, String storeName, int totalItems, int capacity, String createdAt,
            String action) {
        this.username = username;
        this.storeName = storeName;
        this.totalItems = totalItems;
        this.capacity = capacity;
        this.createdAt = createdAt;
        this.action = action;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
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
