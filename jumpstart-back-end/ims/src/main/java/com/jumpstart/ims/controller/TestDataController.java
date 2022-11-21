package com.jumpstart.ims.controller;

import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jumpstart.ims.models.Account;
import com.jumpstart.ims.repository.RoleRepository;
import com.jumpstart.ims.repository.AccountRepository;

@RestController
@RequestMapping("test")
public class TestDataController {

    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private AccountRepository userRepository;

    @GetMapping("/test-user")
    public String testUser(Map<String, String> test, @RequestParam("data1") String data1) {
        System.out.println("dwa");
        System.out.println("request param: " + data1);
        System.out.println(test.get("data1"));
        // userRepository.save(new Account("test", "tets pass",
        // roleRepository.findByRole("ROLE_USER"), new Date()));

        return "saved user";
    }

}
