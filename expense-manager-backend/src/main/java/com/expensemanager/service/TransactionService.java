package com.expensemanager.service;

import org.springframework.data.domain.Page;

//import com.expensemanager.dto.AddTransactionRequest;
import com.expensemanager.dto.ApiResponse;
import com.expensemanager.dto.TransactionResponse;
import com.expensemanager.dto.TransactionSummaryResponse;
import com.expensemanager.dto.UpdateTransactionRequest;


public interface TransactionService {

//    ApiResponse<TransactionResponse> addTransaction(
//            AddTransactionRequest request);

    ApiResponse<Page<TransactionResponse>> getAllTransactions(
            int page,
            int size,
            String sortBy,
            String direction);

    ApiResponse<Page<TransactionResponse>> getTransactionsByType(
            String type,
            int page,
            int size);

    ApiResponse<Page<TransactionResponse>> getTransactionsByDateRange(
            String from,
            String to,
            int page,
            int size);

    ApiResponse<TransactionResponse> getTransactionById(
            Long id);

    ApiResponse<TransactionResponse> updateTransaction(
            Long id,
            UpdateTransactionRequest request);

    ApiResponse<Void> deleteTransaction(
            Long id);
    
    ApiResponse<TransactionSummaryResponse> getSummary();
}