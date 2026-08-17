package com.expensemanager.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.expensemanager.dto.AddBudgetRequest;
import com.expensemanager.dto.ApiResponse;
import com.expensemanager.dto.BudgetResponse;
import com.expensemanager.dto.BudgetSummaryResponse;
import com.expensemanager.dto.UpdateBudgetRequest;
import com.expensemanager.service.BudgetService;


import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(
            BudgetService budgetService) {

        this.budgetService = budgetService;
    }

    // =====================================================
    // ADD
    // =====================================================

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetResponse>>
            addBudget(
                    @Valid @RequestBody
                    AddBudgetRequest request) {

        return ResponseEntity.ok(
                budgetService.addBudget(request));
    }

    // =====================================================
    // GET ALL
    // =====================================================

    @GetMapping
    public ResponseEntity<
            ApiResponse<List<BudgetResponse>>>
            getAllBudgets() {

        return ResponseEntity.ok(
                budgetService.getAllBudgets());
    }

    // =====================================================
    // GET BY MONTH
    // =====================================================

    @GetMapping("/month")
    public ResponseEntity<
            ApiResponse<List<BudgetResponse>>>
            getBudgetsByMonth(

                    @RequestParam int month,

                    @RequestParam int year) {

        return ResponseEntity.ok(
                budgetService
                        .getBudgetsByMonth(
                                month,
                                year));
    }

    // =====================================================
    // GET BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            ApiResponse<BudgetResponse>>
            getBudgetById(
                    @PathVariable Long id) {

        return ResponseEntity.ok(
                budgetService
                        .getBudgetById(id));
    }

    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<
            ApiResponse<BudgetResponse>>
            updateBudget(

                    @PathVariable Long id,

                    @Valid @RequestBody
                    UpdateBudgetRequest request) {

        return ResponseEntity.ok(
                budgetService
                        .updateBudget(
                                id,
                                request));
    }

    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>>
            deleteBudget(
                    @PathVariable Long id) {

        return ResponseEntity.ok(
                budgetService
                        .deleteBudget(id));
    }//end
    
    @GetMapping("/{id}/summary")
    public ResponseEntity<
            ApiResponse<BudgetSummaryResponse>>
            getBudgetSummary(
                    @PathVariable Long id) {

        return ResponseEntity.ok(
                budgetService.getBudgetSummary(id));
    }
    
}