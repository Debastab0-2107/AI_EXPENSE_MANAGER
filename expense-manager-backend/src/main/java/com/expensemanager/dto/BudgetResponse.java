package com.expensemanager.dto;

import java.math.BigDecimal;

import com.expensemanager.enums.BudgetCategory;

public class BudgetResponse {

    private Long id;

    private BigDecimal amount;

    private BudgetCategory category;

    private int month;

    private int year;

    public BudgetResponse() {
    }

    public BudgetResponse(
            Long id,
            BigDecimal amount,
            BudgetCategory category,
            int month,
            int year) {

        this.id = id;
        this.amount = amount;
        this.category = category;
        this.month = month;
        this.year = year;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BudgetCategory getCategory() {
        return category;
    }

    public void setCategory(BudgetCategory category) {
        this.category = category;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }
}