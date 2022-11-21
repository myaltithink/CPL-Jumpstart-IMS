package com.jumpstart.ims.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jumpstart.ims.models.Account;

public interface AccountRepository extends JpaRepository<Account, Integer> {

    public Optional<Account> findByUsername(String username);

}
