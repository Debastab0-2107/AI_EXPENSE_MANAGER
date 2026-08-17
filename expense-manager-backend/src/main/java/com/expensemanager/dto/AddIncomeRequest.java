package com.expensemanager.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.expensemanager.enums.IncomeCategory;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AddIncomeRequest {

    @NotBlank
    private String title;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;

    @NotNull
    private IncomeCategory category;

    @NotNull
    private LocalDate incomeDate;

    private String description;

    public AddIncomeRequest() {
    }

	public AddIncomeRequest(@NotBlank String title, @NotNull @DecimalMin("0.01") BigDecimal amount,
			@NotNull IncomeCategory category, @NotNull LocalDate incomeDate, String description) {
		super();
		this.title = title;
		this.amount = amount;
		this.category = category;
		this.incomeDate = incomeDate;
		this.description = description;
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