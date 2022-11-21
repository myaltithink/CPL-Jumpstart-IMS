package com.jumpstart.ims.service;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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

        Inventory inventory = inventoryRepository.save(new Inventory(0, new Date()));

        Date date = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("MMMM - YYYY");

        SaleRecord saleRecord = saleRecordRepository.save(new SaleRecord(simpleDateFormat.format(date), 0));

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

        saleRecord.setStore(store);
        saleRecordRepository.save(saleRecord);
        result.put("sale_record_created", true);

        store.setAccount(account);
        store.setInventory(inventory);
        store.setSaleRecord(saleRecord);
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

        return LoginPayload.loginSuccess(token.getToken(), token.getExpiry());
    }

}
