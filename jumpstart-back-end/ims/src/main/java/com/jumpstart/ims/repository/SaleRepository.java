package com.jumpstart.ims.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jumpstart.ims.models.Sale;

public interface SaleRepository extends JpaRepository<Sale, Integer> {

}
