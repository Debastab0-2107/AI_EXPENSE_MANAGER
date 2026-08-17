package com.expensemanager.service;

import org.springframework.data.domain.Page;

import com.expensemanager.dto.AddExpenseRequest;
import com.expensemanager.dto.ApiResponse;
import com.expensemanager.dto.ExpenseFilterRequest;
import com.expensemanager.dto.ExpenseResponse;
import com.expensemanager.dto.ExpenseSummaryResponse;
import com.expensemanager.dto.UpdateExpenseRequest;


public interface ExpenseService {

    ApiResponse<ExpenseResponse> addExpense(
            AddExpenseRequest request);

    ApiResponse<Page<ExpenseResponse>> getAllExpenses(
            int page,
            int size,
            String sortBy,
            String direction);

    ApiResponse<ExpenseResponse> getExpenseById(
            Long id);

    ApiResponse<ExpenseResponse> updateExpense(
            Long id,
            UpdateExpenseRequest request);

    ApiResponse<Void> deleteExpense(
            Long id);

    ApiResponse<Page<ExpenseResponse>> searchAndFilter(
            ExpenseFilterRequest request);

    ApiResponse<ExpenseSummaryResponse> getMonthlySummary(
            int year,
            int month);

    ApiResponse<ExpenseSummaryResponse> getYearlySummary(
            int year);
}