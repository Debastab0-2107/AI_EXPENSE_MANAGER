package com.expensemanager.dto;

import java.math.BigDecimal;
import java.util.List;

public class AIFinancialReportData {

    private String userName;

    private int month;

    private int year;

    private BigDecimal income;

    private BigDecimal expense;

    private BigDecimal savings;

    private BigDecimal budget;

    private BigDecimal savingsRate;

    private BigDecimal expenseRate;

    private BigDecimal unusedBudget;

    private String budgetStatus;

    private String financialOverview;

    private String spendingAnalysis;

    private String savingsPerformance;

    private String budgetPosition;

    private String spendingBehaviour;

    private String financialDirection;

    private String savingsDescription;

    private String recommendation;

    private List<String> insights;

    private List<String> recommendations;

    public AIFinancialReportData() {
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
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

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public BigDecimal getSavingsRate() {
        return savingsRate;
    }

    public void setSavingsRate(BigDecimal savingsRate) {
        this.savingsRate = savingsRate;
    }

    public BigDecimal getExpenseRate() {
        return expenseRate;
    }

    public void setExpenseRate(BigDecimal expenseRate) {
        this.expenseRate = expenseRate;
    }

    public BigDecimal getUnusedBudget() {
        return unusedBudget;
    }

    public void setUnusedBudget(BigDecimal unusedBudget) {
        this.unusedBudget = unusedBudget;
    }

    public String getBudgetStatus() {
        return budgetStatus;
    }

    public void setBudgetStatus(String budgetStatus) {
        this.budgetStatus = budgetStatus;
    }

    public String getFinancialOverview() {
        return financialOverview;
    }

    public void setFinancialOverview(String financialOverview) {
        this.financialOverview = financialOverview;
    }

    public String getSpendingAnalysis() {
        return spendingAnalysis;
    }

    public void setSpendingAnalysis(String spendingAnalysis) {
        this.spendingAnalysis = spendingAnalysis;
    }

    public String getSavingsPerformance() {
        return savingsPerformance;
    }

    public void setSavingsPerformance(String savingsPerformance) {
        this.savingsPerformance = savingsPerformance;
    }

    public String getBudgetPosition() {
        return budgetPosition;
    }

    public void setBudgetPosition(String budgetPosition) {
        this.budgetPosition = budgetPosition;
    }

    public String getSpendingBehaviour() {
        return spendingBehaviour;
    }

    public void setSpendingBehaviour(String spendingBehaviour) {
        this.spendingBehaviour = spendingBehaviour;
    }

    public String getFinancialDirection() {
        return financialDirection;
    }

    public void setFinancialDirection(String financialDirection) {
        this.financialDirection = financialDirection;
    }

    public String getSavingsDescription() {
        return savingsDescription;
    }

    public void setSavingsDescription(String savingsDescription) {
        this.savingsDescription = savingsDescription;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public List<String> getInsights() {
        return insights;
    }

    public void setInsights(List<String> insights) {
        this.insights = insights;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }
}