package com.expensemanager.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.expensemanager.enums.ExpenseCategory;

public class ExpenseResponse {

    private Long id;
    private String title;
    private BigDecimal amount;
    private ExpenseCategory category;
    private LocalDate expenseDate;
    private String description;

    public ExpenseResponse() {
    }

    public ExpenseResponse(
            Long id,
            String title,
            BigDecimal amount,
            ExpenseCategory category,
            LocalDate expenseDate,
            String description) {

        this.id = id;
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.expenseDate = expenseDate;
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

    public ExpenseCategory getCategory() {
        return category;
    }

    public void setCategory(ExpenseCategory category) {
        this.category = category;
    }

    public LocalDate getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}