package com.jumpstart.ims.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jumpstart.ims.models.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    public Optional<User> findByUsername(String username);

}
