package com.jumpstart.ims.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jumpstart.ims.models.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {

}
