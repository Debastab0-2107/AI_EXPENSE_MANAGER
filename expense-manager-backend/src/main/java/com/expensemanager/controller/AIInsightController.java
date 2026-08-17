package com.expensemanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.expensemanager.dto.AIInsightRequest;
import com.expensemanager.dto.AIInsightResponse;
import com.expensemanager.dto.ApiResponse;
import com.expensemanager.service.AIInsightService;


@RestController
@RequestMapping("/api/ai-insights")
public class AIInsightController {

    private final AIInsightService aiInsightService;

    public AIInsightController(
            AIInsightService aiInsightService) {

        this.aiInsightService =
                aiInsightService;
    }

    @PostMapping("/monthly")
    public ResponseEntity<
            ApiResponse<AIInsightResponse>>
            generateMonthlyInsights(
                    @RequestBody
                    AIInsightRequest request) {

        return ResponseEntity.ok(
                aiInsightService
                        .generateInsights(request));
    }
}