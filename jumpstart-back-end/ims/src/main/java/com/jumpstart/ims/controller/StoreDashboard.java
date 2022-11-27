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
import com.jumpstart.ims.models.Sale;
import com.jumpstart.ims.models.SaleRecord;
import com.jumpstart.ims.models.Store;
import com.jumpstart.ims.repository.AccountRepository;
import com.jumpstart.ims.repository.InventoryRepository;
import com.jumpstart.ims.repository.ProductRepository;
import com.jumpstart.ims.repository.SaleRecordRepository;
import com.jumpstart.ims.repository.SaleRepository;
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

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private SaleRecordRepository saleRecordRepository;

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
        inventory.setTotalItems(inventory.getTotalItems() + newProduct.getQuantity());
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
        float total = 0;
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

    @PostMapping("/add-transaction")
    public Map<String, Object> addTransaction(@RequestHeader("Authorization") String token,
            @RequestBody NewTransaction newTransaction) {
        Map<String, Object> result = new HashMap<String, Object>();

        String processedToken = token.split("Bearer ")[1];
        Store store = userService.getInventory(processedToken).getStore();
        Set<SaleRecord> records = store.getSaleRecord();
        Iterator<SaleRecord> recordIterator = records.iterator();
        System.out.println(records.size());

        SaleRecord record = null;

        while (recordIterator.hasNext()) {
            SaleRecord recordData = recordIterator.next();
            if (newTransaction.getRecordName().equals(recordData.getRecordDate())) {
                record = recordData;
                break;
            }
        }

        if (record == null) {
            result.put("transactionSuccess", false);
            result.put("message", "Failed to find Sale Record with a record date of " + newTransaction.getRecordName());
            return result;
        }

        Set<Sale> sales = record.getSales();
        Sale newSale = saleRepository.save(new Sale(newTransaction.getProductName(), newTransaction.getQuantity(),
                newTransaction.getPrice(), new Date(), record));

        sales.add(newSale);

        record.setTotalSale(record.getTotalSale() + newSale.getTotal());
        record.setSales(sales);
        saleRecordRepository.save(record);
        records.remove(record);
        records.add(record);
        store.setSaleRecord(records);

        result.put("transactionSuccess", true);
        return result;
    }

    @PostMapping("/get-transactions/{record}")
    public ArrayList<SaleDTO> getTransactions(@RequestHeader("Authorization") String token,
            @PathVariable("record") String record) {
        ArrayList<SaleDTO> sales = new ArrayList<>();
        String processedToken = token.split("Bearer ")[1];
        Set<SaleRecord> records = userService.getInventory(processedToken).getStore().getSaleRecord();
        Iterator<SaleRecord> recordIterator = records.iterator();

        SaleRecord recordInfo = null;
        while (recordIterator.hasNext()) {
            SaleRecord recordData = recordIterator.next();
            if (record.equals(recordData.getRecordDate())) {
                recordInfo = recordData;
                break;
            }
        }

        if (recordInfo == null) {
            return sales;
        }

        Set<Sale> salesRecord = recordInfo.getSales();
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMM-dd-yyyy HH:mm:ss");

        ArrayList<Sale> arrayedSale = new ArrayList<>(salesRecord);
        arrayedSale.sort(new Comparator<Sale>() {
            @Override
            public int compare(Sale sale1, Sale sale2) {
                return sale1.getSoldAt().compareTo(sale2.getSoldAt());
            }
        });

        arrayedSale.forEach((saleRecord) -> {
            sales.add(new SaleDTO(saleRecord.getProductName(), saleRecord.getQuantity(), saleRecord.getTotal(),
                    saleRecord.getPrice(), dateFormat.format(saleRecord.getSoldAt())));
        });

        return sales;
    }

    @PostMapping("/edit-product")
    private Map<String, Object> editProduct(@RequestHeader("Authorization") String token,
            @RequestBody ProductDTO productData) {
        Map<String, Object> result = new HashMap<String, Object>();
        String processedToken = token.split("Bearer ")[1];
        Iterator<Product> products = userService.getInventory(processedToken).getProducts().iterator();
        boolean quantityError = false;

        while (products.hasNext()) {
            Product product = products.next();
            if (product.getBarcode().equals(productData.getBarcode())) {
                Inventory inventory = product.getInventory();
                int newTotal = (inventory.getTotalItems() - product.getQuantity()) + productData.getQuantity();
                if (newTotal > inventory.getCapacity()) {
                    quantityError = true;
                    break;
                }
                if (product.getQuantity() != productData.getQuantity()) {
                    inventory.setTotalItems(inventory.getTotalItems() - product.getQuantity());
                    inventory.setTotalItems(inventory.getTotalItems() + productData.getQuantity());
                    inventoryRepository.save(inventory);
                }
                product.setProductName(productData.getProductName());
                product.setBarcode(productData.getBarcode());
                product.setQuantity(productData.getQuantity());
                product.setPrice(productData.getPrice());
                productRepository.save(product);
                result.put("updated", true);
                break;
            }
        }

        if (quantityError) {
            result.put("updated", false);
            result.put("update_error", "The total quantity of all products has exceeded the inventory capacity");
        }

        if (result.size() == 0) {
            result.put("updated", false);
            result.put("update_error", "Barcode is not editable");
        }
        return result;
    }

    @PostMapping("/delete-product")
    private Map<String, Object> deleteProduct(@RequestHeader("Authorization") String token,
            @RequestBody ProductDTO productData) {
        Map<String, Object> result = new HashMap<String, Object>();
        String processedToken = token.split("Bearer ")[1];
        Iterator<Product> products = userService.getInventory(processedToken).getProducts().iterator();

        while (products.hasNext()) {
            Product product = products.next();
            if (product.getBarcode().equals(productData.getBarcode())) {
                Inventory inventory = product.getInventory();
                inventory.setTotalItems(inventory.getTotalItems() - product.getQuantity());
                inventoryRepository.save(inventory);
                productRepository.delete(product);
                result.put("deleted", true);
                break;
            }
        }
        return result;
    }
}

class SaleDTO {

    private String productName;
    private int quantity;
    private float price;
    private float total;
    private String soldAt;

    public SaleDTO(String productName, int quantity, float total, float price, String soldAt) {
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
        this.soldAt = soldAt;
        this.total = total;
    }

    public float getTotal() {
        return total;
    }

    public void setTotal(float total) {
        this.total = total;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public String getSoldAt() {
        return soldAt;
    }

    public void setSoldAt(String soldAt) {
        this.soldAt = soldAt;
    }

}

class NewTransaction {
    private String recordName;
    private String productName;
    private int quantity;
    private float price;

    public String getRecordName() {
        return recordName;
    }

    public void setRecordName(String recordName) {
        this.recordName = recordName;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

}

class SaleRecordDTO {
    private String saleRecord;
    private float total;
    private int transactions;
    private Date createdAt;
    private String action;

    public SaleRecordDTO(String saleRecord, float total, int transactions, Date createdAt, String action) {
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

    public float getTotal() {
        return total;
    }

    public void setTotal(float total) {
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
    private float price;
    private String updatedAt;
    private String action = "delete/edit";

    public ProductDTO() {
    }

    public ProductDTO(String productName, String barcode, int quantity, float price, String updatedAt) {
        this.productName = productName;
        this.barcode = barcode;
        this.quantity = quantity;
        this.price = price;
        this.updatedAt = updatedAt;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
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

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
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
