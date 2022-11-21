package com.jumpstart.ims.controller;

import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    // for uploading file and using multipart file DO NOT USE @RequestBody
    @PostMapping("/test-file")
    public void testFile(TestFile testFile) {
        System.out.println("file name " + testFile.getFile().getOriginalFilename());
        System.out.println("text " + testFile.getText());
    }

}

class TestFile {
    private String text;
    private MultipartFile file;

    public MultipartFile getFile() {
        return file;
    }

    public String getText() {
        return text;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }

    public void setText(String text) {
        this.text = text;
    }

    public TestFile() {
    }
}
