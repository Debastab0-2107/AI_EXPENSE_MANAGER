package com.expensemanager.dto;

import java.math.BigDecimal;

public class MonthlyComparisonResponse {

    private int month;
    private int year;

    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal savings;

    public MonthlyComparisonResponse() {
    }

    public MonthlyComparisonResponse(
            int month,
            int year,
            BigDecimal income,
            BigDecimal expense,
            BigDecimal savings) {

        this.month = month;
        this.year = year;
        this.income = income;
        this.expense = expense;
        this.savings = savings;
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

    public BigDecimal getIncome() {
        return income;
    }

    public void setIncome(BigDecimal income) {
        this.income = income;
    }

    public BigDecimal getExpense() {
        return expense;
    }

    public void setExpense(BigDecimal expense) {
        this.expense = expense;
    }

    public BigDecimal getSavings() {
        return savings;
    }

    public void setSavings(BigDecimal savings) {
        this.savings = savings;
    }
}
