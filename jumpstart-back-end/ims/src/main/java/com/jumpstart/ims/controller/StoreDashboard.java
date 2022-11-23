package com.jumpstart.ims.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jumpstart.ims.models.Account;
import com.jumpstart.ims.models.Inventory;
import com.jumpstart.ims.models.Product;
import com.jumpstart.ims.models.SaleRecord;
import com.jumpstart.ims.repository.AccountRepository;
import com.jumpstart.ims.repository.InventoryRepository;
import com.jumpstart.ims.repository.ProductRepository;
import com.jumpstart.ims.service.TokenProvider;
import com.jumpstart.ims.service.UserService;

@RestController
@RequestMapping("store")
public class StoreDashboard {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping(value = { "/get-inventory-capacity", "get-inventory-capacity/{username}" })
    public Map<String, Object> getInventoryCapacity(@RequestHeader("Authorization") String token,
            @PathVariable("username") Optional<String> username) {
        Map<String, Object> result = new HashMap<String, Object>();
        String processedToken = token.split("Bearer ")[1];

        Inventory userInventory = null;

        if (username.isPresent()) {
            Optional<Account> userAccount = accountRepository.findByUsername(username.get());
            userInventory = userAccount.get().getStore().getInventory();
        } else {
            userInventory = userService.getInventory(processedToken);
        }

        result.put("totalItems", userInventory.getTotalItems());
        result.put("capacity", userInventory.getCapacity());

        return result;
    }

    @PostMapping("/update-inventory-capacity")
    public Map<String, Object> updateInvCapacity(@RequestHeader("Authorization") String token,
            @RequestBody NewCapacity capacity) {
        Map<String, Object> result = new HashMap<String, Object>();
        String processedToken = token.split("Bearer ")[1];
        Inventory inventory = userService.getInventory(processedToken);

        inventory.setCapacity(capacity.getNewCapacity());
        inventoryRepository.save(inventory);
        result.put("capacityUpdated", true);

        return result;
    }

    @PostMapping(value = { "/get-products", "/get-products/{username}" })
    public ArrayList<ProductDTO> getProducts(@RequestHeader("Authorization") String token,
            @PathVariable("username") Optional<String> username) {
        String processedToken = token.split("Bearer ")[1];
        Inventory inventory = null;

        if (username.isPresent()) {
            Optional<Account> userAccount = accountRepository.findByUsername(username.get());
            inventory = userAccount.get().getStore().getInventory();
        } else {
            inventory = userService.getInventory(processedToken);
        }

        ArrayList<ProductDTO> productList = new ArrayList<ProductDTO>();
        SimpleDateFormat dateformat = new SimpleDateFormat("MMM-dd-yyyy HH:mm:ss");

        Iterator<Product> productIterator = inventory.getProducts().iterator();
        while (productIterator.hasNext()) {
            Product product = productIterator.next();
            productList.add(new ProductDTO(product.getProductName(), product.getBarcode(), product.getQuantity(),
                    product.getPrice(), dateformat.format(product.getUpdatedAt())));
        }

        productList.sort(new Comparator<ProductDTO>() {
            @Override
            public int compare(ProductDTO p1, ProductDTO p2) {
                return p1.getProductName().compareTo(p2.getProductName());
            }
        });

        return productList;
    }

    @PostMapping("/add-product")
    public Map<String, ProductDTO> addProduct(@RequestHeader("Authorization") String token,
            @RequestBody ProductDTO product) {
        String processedToken = token.split("Bearer ")[1];
        Map<String, ProductDTO> result = new HashMap<String, ProductDTO>();
        SimpleDateFormat dateformat = new SimpleDateFormat("MMM-dd-yyyy HH:mm:ss");

        Inventory inventory = userService.getInventory(processedToken);
        Set<Product> products = inventory.getProducts();
        Product newProduct = productRepository.save(new Product(product.getProductName(), "N/A", product.getBarcode(),
                product.getQuantity(), product.getPrice(), new Date(), inventory));

        products.add(newProduct);
        inventory.setTotalItems(products.size());
        inventoryRepository.save(inventory);
        result.put("newProduct",
                new ProductDTO(newProduct.getProductName(), newProduct.getBarcode(), newProduct.getQuantity(),
                        newProduct.getPrice(), dateformat.format(newProduct.getUpdatedAt())));

        return result;

    }

    @PostMapping("/total-sale")
    public Map<String, Object> getTotalSale(@RequestHeader("Authorization") String token) {
        Map<String, Object> result = new HashMap<String, Object>();
        String processedToken = token.split("Bearer ")[1];
        Account userAccount = accountRepository.findByUsername(
                new String(Base64.getDecoder().decode(tokenProvider.getUserFromToken(processedToken)))).get();

        String month = "";
        int total = 0;
        Set<SaleRecord> saleRecords = userAccount.getStore().getSaleRecord();
        Iterator<SaleRecord> iterator = saleRecords.iterator();
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMMM - YYYY");
        String currentMonth = dateFormat.format(new Date());

        while (iterator.hasNext()) {
            SaleRecord saleRecord = iterator.next();
            if (saleRecord.getRecordDate().equals(currentMonth)) {
                month = saleRecord.getRecordDate();
                total = saleRecord.getTotalSale();
                break;
            }
        }

        result.put("month", month);
        result.put("total", total);

        return result;
    }

    @PostMapping("/get-store-sale-records")
    public ArrayList<SaleRecordDTO> getSaleRecords(@RequestHeader("Authorization") String token) {
        String processedToken = token.split("Bearer ")[1];
        ArrayList<SaleRecordDTO> result = new ArrayList<>();
        Account userAccount = accountRepository.findByUsername(
                new String(Base64.getDecoder().decode(tokenProvider.getUserFromToken(processedToken)))).get();

        Set<SaleRecord> saleRecords = userAccount.getStore().getSaleRecord();
        Iterator<SaleRecord> saleRecordsIterator = saleRecords.iterator();

        while (saleRecordsIterator.hasNext()) {
            SaleRecord record = saleRecordsIterator.next();
            result.add(new SaleRecordDTO(record.getRecordDate(), record.getTotalSale(), record.getSales().size(),
                    record.getCreatedAt(), "view-record-" + record.getRecordDate()));
        }

        result.sort(new Comparator<SaleRecordDTO>() {
            @Override
            public int compare(SaleRecordDTO rec1, SaleRecordDTO rec2) {
                return rec1.getSaleRecord().compareTo(rec2.getSaleRecord());
            }
        });

        return result;
    }
}

class SaleRecordDTO {
    private String saleRecord;
    private int total;
    private int transactions;
    private Date createdAt;
    private String action;

    public SaleRecordDTO(String saleRecord, int total, int transactions, Date createdAt, String action) {
        this.saleRecord = saleRecord;
        this.total = total;
        this.transactions = transactions;
        this.createdAt = createdAt;
        this.action = action;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getSaleRecord() {
        return saleRecord;
    }

    public void setSaleRecord(String saleRecord) {
        this.saleRecord = saleRecord;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getTransactions() {
        return transactions;
    }

    public void setTransactions(int transactions) {
        this.transactions = transactions;
    }

}

class ProductDTO {
    private String productName;
    private String barcode;
    private int quantity;
    private int price;
    private String updatedAt;

    public ProductDTO() {
    }

    public ProductDTO(String productName, String barcode, int quantity, int price, String updatedAt) {
        this.productName = productName;
        this.barcode = barcode;
        this.quantity = quantity;
        this.price = price;
        this.updatedAt = updatedAt;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

}

class NewCapacity {
    private int newCapacity;

    public int getNewCapacity() {
        return newCapacity;
    }

    public void setNewCapacity(int newCapacity) {
        this.newCapacity = newCapacity;
    }
}
