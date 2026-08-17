package com.expensemanager.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.expensemanager.enums.TransactionType;

public class TransactionResponse {

    private Long id;
    private String title;
    private BigDecimal amount;
    private TransactionType type;
    private LocalDate transactionDate;
    private String description;

    public TransactionResponse() {
    }

    public TransactionResponse(
            Long id,
            String title,
            BigDecimal amount,
            TransactionType type,
            LocalDate transactionDate,
            String description) {

        this.id = id;
        this.title = title;
        this.amount = amount;
        this.type = type;
        this.transactionDate = transactionDate;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}