package com.expensemanager.dto;

import java.math.BigDecimal;

public class ExpenseSummaryResponse {

    private BigDecimal totalExpense;

    private long transactionCount;

    public ExpenseSummaryResponse() {
    }

    public ExpenseSummaryResponse(
            BigDecimal totalExpense,
            long transactionCount) {

        this.totalExpense = totalExpense;
        this.transactionCount = transactionCount;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
    }
}