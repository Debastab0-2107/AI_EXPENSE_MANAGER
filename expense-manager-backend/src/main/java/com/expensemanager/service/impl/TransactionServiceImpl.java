package com.expensemanager.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.expensemanager.dto.AddTransactionRequest;
import com.expensemanager.dto.ApiResponse;
import com.expensemanager.dto.TransactionResponse;
import com.expensemanager.dto.TransactionSummaryResponse;
import com.expensemanager.dto.UpdateTransactionRequest;
import com.expensemanager.entity.Transaction;
import com.expensemanager.entity.User;
import com.expensemanager.enums.TransactionType;
import com.expensemanager.exception.ResourceNotFoundException;
import com.expensemanager.repository.TransactionRepository;
import com.expensemanager.repository.UserRepository;
import com.expensemanager.service.TransactionService;


@Service
@Transactional
public class TransactionServiceImpl
        implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionServiceImpl(
            TransactionRepository transactionRepository,
            UserRepository userRepository) {

        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // ADD
    // =========================================================

//    @Override
//    public ApiResponse<TransactionResponse> addTransaction(
//            AddTransactionRequest request) {
//
//        User user = getCurrentUser();
//
//        Transaction transaction = new Transaction();
//
//        transaction.setTitle(request.getTitle());
//        transaction.setAmount(request.getAmount());
//        transaction.setType(request.getType());
//        transaction.setTransactionDate(
//                request.getTransactionDate());
//        transaction.setDescription(
//                request.getDescription());
//        transaction.setUser(user);
//
//        Transaction saved =
//                transactionRepository.save(transaction);
//
//        return new ApiResponse<>(
//                true,
//                "Transaction added successfully.",
//                mapToResponse(saved));
//    }

    // =========================================================
    // GET ALL
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Page<TransactionResponse>>
            getAllTransactions(
                    int page,
                    int size,
                    String sortBy,
                    String direction) {

        User user = getCurrentUser();

        Sort sort =
                "desc".equalsIgnoreCase(direction)
                        ? Sort.by(sortBy).descending()
                        : Sort.by(sortBy).ascending();

        Pageable pageable =
                PageRequest.of(page, size, sort);

        Page<Transaction> transactions =
                transactionRepository.findAllByUser(
                        user,
                        pageable);

        Page<TransactionResponse> response =
                transactions.map(this::mapToResponse);

        return new ApiResponse<>(
                true,
                "Transactions fetched successfully.",
                response);
    }

    // =========================================================
    // GET BY TYPE
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Page<TransactionResponse>>
            getTransactionsByType(
                    String type,
                    int page,
                    int size) {

        User user = getCurrentUser();

        TransactionType transactionType;

        try {

            transactionType =
                    TransactionType.valueOf(
                            type.toUpperCase());

        } catch (IllegalArgumentException e) {

            throw new IllegalArgumentException(
                    "Invalid transaction type.");
        }

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by("transactionDate")
                                .descending());

        Page<Transaction> transactions =
                transactionRepository
                        .findAllByUserAndType(
                                user,
                                transactionType,
                                pageable);

        Page<TransactionResponse> response =
                transactions.map(this::mapToResponse);

        return new ApiResponse<>(
                true,
                "Transactions fetched successfully.",
                response);
    }

    // =========================================================
    // GET BY DATE RANGE
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<Page<TransactionResponse>>
            getTransactionsByDateRange(
                    String from,
                    String to,
                    int page,
                    int size) {

        User user = getCurrentUser();

        LocalDate fromDate =
                LocalDate.parse(from);

        LocalDate toDate =
                LocalDate.parse(to);

        if (fromDate.isAfter(toDate)) {

            throw new IllegalArgumentException(
                    "From date cannot be after to date.");
        }

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by("transactionDate")
                                .descending());

        Page<Transaction> transactions =
                transactionRepository
                        .findAllByUserAndTransactionDateBetween(
                                user,
                                fromDate,
                                toDate,
                                pageable);

        Page<TransactionResponse> response =
                transactions.map(this::mapToResponse);

        return new ApiResponse<>(
                true,
                "Transactions fetched successfully.",
                response);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<TransactionResponse>
            getTransactionById(Long id) {

        User user = getCurrentUser();

        Transaction transaction =
                transactionRepository
                        .findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Transaction not found."));

        return new ApiResponse<>(
                true,
                "Transaction fetched successfully.",
                mapToResponse(transaction));
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @Override
    public ApiResponse<TransactionResponse>
            updateTransaction(
                    Long id,
                    UpdateTransactionRequest request) {

        User user = getCurrentUser();

        Transaction transaction =
                transactionRepository
                        .findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Transaction not found."));

        transaction.setTitle(request.getTitle());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setTransactionDate(
                request.getTransactionDate());
        transaction.setDescription(
                request.getDescription());

        Transaction updated =
                transactionRepository.save(transaction);

        return new ApiResponse<>(
                true,
                "Transaction updated successfully.",
                mapToResponse(updated));
    }

    // =========================================================
    // DELETE
    // =========================================================

    @Override
    public ApiResponse<Void> deleteTransaction(
            Long id) {

        User user = getCurrentUser();

        Transaction transaction =
                transactionRepository
                        .findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Transaction not found."));

        transactionRepository.delete(transaction);

        return new ApiResponse<>(
                true,
                "Transaction deleted successfully.",
                null);
    }

    // =========================================================
    // CURRENT USER
    // =========================================================

    private User getCurrentUser() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."));
    }

    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    private TransactionResponse mapToResponse(
            Transaction transaction) {

        return new TransactionResponse(
                transaction.getId(),
                transaction.getTitle(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getTransactionDate(),
                transaction.getDescription());
    }//end
    
    @Override
    @Transactional(readOnly = true)
    public ApiResponse<TransactionSummaryResponse> getSummary() {

        User user = getCurrentUser();

        BigDecimal totalIncome =
                transactionRepository.getTotalByType(
                        user,
                        TransactionType.INCOME);

        BigDecimal totalExpense =
                transactionRepository.getTotalByType(
                        user,
                        TransactionType.EXPENSE);

        BigDecimal balance =
                totalIncome.subtract(totalExpense);

        TransactionSummaryResponse summary =
                new TransactionSummaryResponse(
                        totalIncome,
                        totalExpense,
                        balance);

        return new ApiResponse<>(
                true,
                "Transaction summary fetched successfully.",
                summary);
    }//end
    
}