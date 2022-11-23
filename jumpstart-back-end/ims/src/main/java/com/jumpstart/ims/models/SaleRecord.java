package com.jumpstart.ims.models;

import java.util.Date;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class SaleRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int recordId;

    @Column(nullable = false)
    private String recordDate;

    @Column(nullable = false)
    private int totalSale;

    @Column(nullable = false)
    private Date createdAt;

    @OneToMany(mappedBy = "saleRecord")
    private Set<Sale> sales;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store storeSaleRecord;

    public SaleRecord() {
    }

    public SaleRecord(String recordDate, int totalSale, Date createdAt) {
        this.recordDate = recordDate;
        this.totalSale = totalSale;
        this.createdAt = createdAt;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public int getRecordId() {
        return recordId;
    }

    public void setRecordId(int recordId) {
        this.recordId = recordId;
    }

    public String getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(String recordDate) {
        this.recordDate = recordDate;
    }

    public int getTotalSale() {
        return totalSale;
    }

    public void setTotalSale(int totalSale) {
        this.totalSale = totalSale;
    }

    public Set<Sale> getSales() {
        return sales;
    }

    public void setSales(Set<Sale> sales) {
        this.sales = sales;
    }

    public Store getStoreSaleRecord() {
        return storeSaleRecord;
    }

    public void setStoreSaleRecord(Store storeSaleRecord) {
        this.storeSaleRecord = storeSaleRecord;
    }

}
