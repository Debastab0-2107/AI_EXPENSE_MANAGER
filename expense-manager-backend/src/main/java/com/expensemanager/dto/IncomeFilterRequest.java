package com.expensemanager.dto;

import java.time.LocalDate;

import com.expensemanager.enums.IncomeCategory;

public class IncomeFilterRequest {

    private String keyword;

    private IncomeCategory category;

    private LocalDate from;

    private LocalDate to;

    private int page = 0;

    private int size = 10;

    private String sortBy = "incomeDate";

    private String direction = "desc";

    public IncomeFilterRequest() {
    }

	public IncomeFilterRequest(String keyword, IncomeCategory category, LocalDate from, LocalDate to, int page,
			int size, String sortBy, String direction) {
		super();
		this.keyword = keyword;
		this.category = category;
		this.from = from;
		this.to = to;
		this.page = page;
		this.size = size;
		this.sortBy = sortBy;
		this.direction = direction;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public IncomeCategory getCategory() {
		return category;
	}

	public void setCategory(IncomeCategory category) {
		this.category = category;
	}

	public LocalDate getFrom() {
		return from;
	}

	public void setFrom(LocalDate from) {
		this.from = from;
	}

	public LocalDate getTo() {
		return to;
	}

	public void setTo(LocalDate to) {
		this.to = to;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public String getSortBy() {
		return sortBy;
	}

	public void setSortBy(String sortBy) {
		this.sortBy = sortBy;
	}

	public String getDirection() {
		return direction;
	}

	public void setDirection(String direction) {
		this.direction = direction;
	}

    
}