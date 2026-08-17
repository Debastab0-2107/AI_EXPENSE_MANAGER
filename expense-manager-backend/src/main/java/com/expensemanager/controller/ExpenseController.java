package com.expensemanager.controller;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.expensemanager.dto.AddExpenseRequest;
import com.expensemanager.dto.ApiResponse;
import com.expensemanager.dto.ExpenseFilterRequest;
import com.expensemanager.dto.ExpenseResponse;
import com.expensemanager.dto.ExpenseSummaryResponse;
import com.expensemanager.dto.UpdateExpenseRequest;
import com.expensemanager.enums.ExpenseCategory;
import com.expensemanager.service.ExpenseService;


import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(
            ExpenseService expenseService) {

        this.expenseService = expenseService;
    }

    // =========================================================
    // ADD
    // =========================================================

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>>
            addExpense(
                    @Valid @RequestBody
                    AddExpenseRequest request) {

        return ResponseEntity.ok(
                expenseService.addExpense(request));
    }

    // =========================================================
    // GET ALL
    // =========================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<Page<ExpenseResponse>>>
            getAllExpenses(

                    @RequestParam(
                            defaultValue = "0")
                    int page,

                    @RequestParam(
                            defaultValue = "10")
                    int size,

                    @RequestParam(
                            defaultValue = "expenseDate")
                    String sortBy,

                    @RequestParam(
                            defaultValue = "desc")
                    String direction) {

        return ResponseEntity.ok(
                expenseService.getAllExpenses(
                        page,
                        size,
                        sortBy,
                        direction));
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<ExpenseResponse>>
            getExpenseById(
                    @PathVariable Long id) {

        return ResponseEntity.ok(
                expenseService.getExpenseById(id));
    }

    // =========================================================
    // UPDATE
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<ExpenseResponse>>
            updateExpense(

                    @PathVariable Long id,

                    @Valid @RequestBody
                    UpdateExpenseRequest request) {

        return ResponseEntity.ok(
                expenseService.updateExpense(
                        id,
                        request));
    }

    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>>
            deleteExpense(
                    @PathVariable Long id) {

        return ResponseEntity.ok(
                expenseService.deleteExpense(id));
    }

    // =========================================================
    // SEARCH + FILTER
    // =========================================================

    @GetMapping("/filter")
    public ResponseEntity<
            ApiResponse<Page<ExpenseResponse>>>
            searchAndFilter(

                    @RequestParam(
                            required = false)
                    String keyword,

                    @RequestParam(
                            required = false)
                    ExpenseCategory category,

                    @RequestParam(
                            required = false)
                    LocalDate from,

                    @RequestParam(
                            required = false)
                    LocalDate to,

                    @RequestParam(
                            defaultValue = "0")
                    int page,

                    @RequestParam(
                            defaultValue = "10")
                    int size,

                    @RequestParam(
                            defaultValue = "expenseDate")
                    String sortBy,

                    @RequestParam(
                            defaultValue = "desc")
                    String direction) {

        ExpenseFilterRequest request =
                new ExpenseFilterRequest();

        request.setKeyword(keyword);
        request.setCategory(category);
        request.setFrom(from);
        request.setTo(to);
        request.setPage(page);
        request.setSize(size);
        request.setSortBy(sortBy);
        request.setDirection(direction);

        return ResponseEntity.ok(
                expenseService.searchAndFilter(
                        request));
    }

    // =========================================================
    // MONTHLY SUMMARY
    // =========================================================

    @GetMapping("/summary/monthly")
    public ResponseEntity<
            ApiResponse<ExpenseSummaryResponse>>
            getMonthlySummary(

                    @RequestParam int year,
                    @RequestParam int month) {

        return ResponseEntity.ok(
                expenseService.getMonthlySummary(
                        year,
                        month));
    }

    // =========================================================
    // YEARLY SUMMARY
    // =========================================================

    @GetMapping("/summary/yearly")
    public ResponseEntity<
            ApiResponse<ExpenseSummaryResponse>>
            getYearlySummary(

                    @RequestParam int year) {

        return ResponseEntity.ok(
                expenseService.getYearlySummary(
                        year));
    }
}