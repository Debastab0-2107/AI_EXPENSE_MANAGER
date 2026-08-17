package com.expensemanager.dto;

import java.math.BigDecimal;

public class IncomeSummaryResponse {

    private BigDecimal totalIncome;
    private long transactionCount;

    public IncomeSummaryResponse() {
    }

    public IncomeSummaryResponse(
            BigDecimal totalIncome,
            long transactionCount) {

        this.totalIncome = totalIncome;
        this.transactionCount = transactionCount;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
    }
}