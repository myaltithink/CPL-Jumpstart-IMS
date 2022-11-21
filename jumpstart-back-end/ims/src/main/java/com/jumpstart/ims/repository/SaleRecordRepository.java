package com.jumpstart.ims.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jumpstart.ims.models.SaleRecord;

public interface SaleRecordRepository extends JpaRepository<SaleRecord, Integer> {

}
