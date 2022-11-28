package com.jumpstart.ims.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jumpstart.ims.models.Account;
import com.jumpstart.ims.models.Inventory;
import com.jumpstart.ims.models.SaleRecord;
import com.jumpstart.ims.models.Store;
import com.jumpstart.ims.models.payload.LoginPayload;
import com.jumpstart.ims.models.payload.NewStore;
import com.jumpstart.ims.repository.RoleRepository;
import com.jumpstart.ims.repository.SaleRecordRepository;
import com.jumpstart.ims.repository.StoreRepository;
import com.jumpstart.ims.repository.AccountRepository;
import com.jumpstart.ims.repository.InventoryRepository;

@Service
public class UserService {

    @Autowired
    private AccountRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AuthenticationProvider authenticationProvider;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private SaleRecordRepository saleRecordRepository;

    public Map<String, Object> registerUser(NewStore storeInfo) {
        Map<String, Object> result = new HashMap<String, Object>();

        if (userRepository.findByUsername(storeInfo.getUsername()).isPresent()) {
            result.put("registration_success", false);
            result.put("message", "Store username is already registered.");
            return result;
        }

        Account account = userRepository
                .save(new Account(storeInfo.getUsername(), passwordEncoder.encode(storeInfo.getPassword()),
                        roleRepository.findByRole("ROLE_USER"),
                        new Date()));

        Inventory inventory = inventoryRepository.save(new Inventory(0, new Date(), 10000));

        Store store = storeRepository.save(new Store(
                storeInfo.getStoreName(),
                storeInfo.getStoreAddress(),
                storeInfo.getStoreContact()));

        account.setStore(store);
        userRepository.save(account);
        result.put("account_created", true);

        inventory.setStore(store);
        inventoryRepository.save(inventory);
        result.put("inventory_created", true);

        store.setAccount(account);
        store.setInventory(inventory);
        storeRepository.save(store);

        result.put("store_created", true);
        result.put("registration_success", true);

        return result;
    }

    public LoginPayload authenticateUser(LoginPayload loginInfo) {
        Authentication auth = authenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(loginInfo.getUsername(), loginInfo.getPassword()));

        if (auth == null) {
            Optional<Account> user = userRepository.findByUsername(loginInfo.getUsername());
            if (!user.isPresent())
                return LoginPayload.loginError("username", "The given username is not registered");

            else if (!passwordEncoder.matches(loginInfo.getPassword(), user.get().getPassword()))
                return LoginPayload.loginError("password", "Incorrect password");

            else
                return LoginPayload.loginError("Unknown", "Something went wrong while trying to authenticate");
        }

        SecurityContextHolder.getContext().setAuthentication(auth);

        Token token = tokenProvider.createToken(auth.getPrincipal().toString());

        Account userAcc = userRepository.findByUsername(auth.getPrincipal().toString()).get();

        if (userAcc.getRole().getRole().equals("ROLE_USER")) {
            Set<SaleRecord> userRecords = userAcc.getStore().getSaleRecord();
            ArrayList<SaleRecord> arrayedList = new ArrayList<>(userRecords);

            arrayedList.sort(new Comparator<SaleRecord>() {
                @Override
                public int compare(SaleRecord rec1, SaleRecord rec2) {
                    return rec1.getCreatedAt().compareTo(rec2.getCreatedAt());
                }
            });

            if (userRecords == null) {
                userRecords = new HashSet<SaleRecord>();
            }
            SimpleDateFormat dateFormat = new SimpleDateFormat("MMMM - YYYY");

            boolean outdated = false;

            if (arrayedList.size() != 0) {
                SaleRecord record = arrayedList.get(0);
                outdated = !record.getRecordDate().equals(dateFormat.format(new Date()));
            }

            if (userRecords.isEmpty() || outdated) {
                SaleRecord newRecord = new SaleRecord(dateFormat.format(new Date()), 0, new Date());
                Store store = userAcc.getStore();
                newRecord.setStoreSaleRecord(store);
                newRecord = saleRecordRepository.save(newRecord);
                userRecords.add(newRecord);
                store.setSaleRecord(userRecords);
            }
        }
        return LoginPayload.loginSuccess(token.getToken(), token.getExpiry());
    }

    public Inventory getInventory(String token) {
        Account user = userRepository
                .findByUsername(new String(Base64.getDecoder().decode(tokenProvider.getUserFromToken(token))))
                .get();

        Store userStore = user.getStore();

        return userStore.getInventory();
    }
}
