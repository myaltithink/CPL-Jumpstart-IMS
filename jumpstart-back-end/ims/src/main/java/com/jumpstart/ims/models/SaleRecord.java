package com.jumpstart.ims.models;

import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class SaleRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int recordId;

    @Column(nullable = false)
    private String recordDate;

    @Column(nullable = false)
    private int totalSale;

    @OneToMany(mappedBy = "saleRecord")
    private Set<Sale> sales;

    @OneToOne
    private Store store;

    public SaleRecord() {
    }

    public SaleRecord(int recordId, String recordDate, int totalSale, Set<Sale> sales, Store store) {
        this.recordId = recordId;
        this.recordDate = recordDate;
        this.totalSale = totalSale;
        this.sales = sales;
        this.store = store;
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

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

}
