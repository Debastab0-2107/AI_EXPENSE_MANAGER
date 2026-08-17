package com.expensemanager.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.expensemanager.enums.IncomeCategory;

public class IncomeResponse {

    private Long id;
    private String title;
    private BigDecimal amount;
    private IncomeCategory category;
    private LocalDate incomeDate;
    private String description;

    public IncomeResponse() {
    }

    public IncomeResponse(Long id,
                          String title,
                          BigDecimal amount,
                          IncomeCategory category,
                          LocalDate incomeDate,
                          String description) {

        this.id = id;
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.incomeDate = incomeDate;
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

	public IncomeCategory getCategory() {
		return category;
	}

	public void setCategory(IncomeCategory category) {
		this.category = category;
	}

	public LocalDate getIncomeDate() {
		return incomeDate;
	}

	public void setIncomeDate(LocalDate incomeDate) {
		this.incomeDate = incomeDate;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}