package com.jumpstart.ims.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jumpstart.ims.models.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

}
