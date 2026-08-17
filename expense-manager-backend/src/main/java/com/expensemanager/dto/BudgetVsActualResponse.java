package com.expensemanager.dto;

import java.math.BigDecimal;

public class BudgetVsActualResponse {

    private BigDecimal totalBudget;
    private BigDecimal totalSpent;
    private BigDecimal remainingAmount;
    private BigDecimal usagePercentage;
    private boolean exceeded;

    public BudgetVsActualResponse() {
    }

    public BudgetVsActualResponse(
            BigDecimal totalBudget,
            BigDecimal totalSpent,
            BigDecimal remainingAmount,
            BigDecimal usagePercentage,
            boolean exceeded) {

        this.totalBudget = totalBudget;
        this.totalSpent = totalSpent;
        this.remainingAmount = remainingAmount;
        this.usagePercentage = usagePercentage;
        this.exceeded = exceeded;
    }

    public BigDecimal getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(BigDecimal totalBudget) {
        this.totalBudget = totalBudget;
    }

    public BigDecimal getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(BigDecimal totalSpent) {
        this.totalSpent = totalSpent;
    }

    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public BigDecimal getUsagePercentage() {
        return usagePercentage;
    }

    public void setUsagePercentage(BigDecimal usagePercentage) {
        this.usagePercentage = usagePercentage;
    }

    public boolean isExceeded() {
        return exceeded;
    }

    public void setExceeded(boolean exceeded) {
        this.exceeded = exceeded;
    }
}