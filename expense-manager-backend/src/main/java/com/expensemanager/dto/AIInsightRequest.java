package com.expensemanager.dto;

public class AIInsightRequest {

    private int month;

    private int year;

    public AIInsightRequest() {
    }

    public AIInsightRequest(
            int month,
            int year) {

        this.month = month;
        this.year = year;
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