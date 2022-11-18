package com.jumpstart.ims.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jumpstart.ims.models.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    public Role findByRole(String role);

}
