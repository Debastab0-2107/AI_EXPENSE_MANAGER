package com.expensemanager.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.expensemanager.dto.AddTransactionRequest;
import com.expensemanager.dto.ApiResponse;
import com.expensemanager.dto.TransactionResponse;
import com.expensemanager.dto.TransactionSummaryResponse;
import com.expensemanager.dto.UpdateTransactionRequest;
import com.expensemanager.service.TransactionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService) {

        this.transactionService = transactionService;
    }

    // =========================================================
    // ADD
    // =========================================================

//    @PostMapping
//    public ResponseEntity<
//            ApiResponse<TransactionResponse>>
//            addTransaction(
//                    @Valid @RequestBody
//                    AddTransactionRequest request) {
//
//        return ResponseEntity.ok(
//                transactionService
//                        .addTransaction(request));
//    }

    // =========================================================
    // GET ALL
    // =========================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<Page<TransactionResponse>>>
            getAllTransactions(

                    @RequestParam(
                            defaultValue = "0")
                    int page,

                    @RequestParam(
                            defaultValue = "10")
                    int size,

                    @RequestParam(
                            defaultValue = "transactionDate")
                    String sortBy,

                    @RequestParam(
                            defaultValue = "desc")
                    String direction) {

        return ResponseEntity.ok(
                transactionService
                        .getAllTransactions(
                                page,
                                size,
                                sortBy,
                                direction));
    }

    // =========================================================
    // GET BY TYPE
    // =========================================================

    @GetMapping("/type")
    public ResponseEntity<
            ApiResponse<Page<TransactionResponse>>>
            getTransactionsByType(

                    @RequestParam String type,

                    @RequestParam(
                            defaultValue = "0")
                    int page,

                    @RequestParam(
                            defaultValue = "10")
                    int size) {

        return ResponseEntity.ok(
                transactionService
                        .getTransactionsByType(
                                type,
                                page,
                                size));
    }

    // =========================================================
    // GET BY DATE RANGE
    // =========================================================

    @GetMapping("/date-range")
    public ResponseEntity<
            ApiResponse<Page<TransactionResponse>>>
            getTransactionsByDateRange(

                    @RequestParam String from,

                    @RequestParam String to,

                    @RequestParam(
                            defaultValue = "0")
                    int page,

                    @RequestParam(
                            defaultValue = "10")
                    int size) {

        return ResponseEntity.ok(
                transactionService
                        .getTransactionsByDateRange(
                                from,
                                to,
                                page,
                                size));
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<TransactionResponse>>
            getTransactionById(
                    @PathVariable Long id) {

        return ResponseEntity.ok(
                transactionService
                        .getTransactionById(id));
    }

    // =========================================================
    // UPDATE
    // =========================================================

//    @PutMapping("/{id}")
//    public ResponseEntity<
//            ApiResponse<TransactionResponse>>
//            updateTransaction(
//
//                    @PathVariable Long id,
//
//                    @Valid @RequestBody
//                    UpdateTransactionRequest request) {
//
//        return ResponseEntity.ok(
//                transactionService
//                        .updateTransaction(
//                                id,
//                                request));
//    }

    // =========================================================
    // DELETE
    // =========================================================

//    @DeleteMapping("/{id}")
//    public ResponseEntity<ApiResponse<Void>>
//            deleteTransaction(
//                    @PathVariable Long id) {
//
//        return ResponseEntity.ok(
//                transactionService
//                        .deleteTransaction(id));
//    }
//    
//    @GetMapping("/summary")
//    public ResponseEntity<
//            ApiResponse<TransactionSummaryResponse>>
//            getSummary() {
//
//        return ResponseEntity.ok(
//                transactionService.getSummary());
//    }
}