package com.expensemanager.dto;

import java.math.BigDecimal;

public class MonthlyReportResponse {

    private int month;
    private int year;

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;

    public MonthlyReportResponse() {
    }

    public MonthlyReportResponse(
            int month,
            int year,
            BigDecimal totalIncome,
            BigDecimal totalExpense,
            BigDecimal balance) {

        this.month = month;
        this.year = year;
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = balance;
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

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}