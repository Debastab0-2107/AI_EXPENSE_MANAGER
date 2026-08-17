package com.expensemanager.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.expensemanager.dto.AIInsightRequest;
import com.expensemanager.dto.AIInsightResponse;
import com.expensemanager.dto.ApiResponse;
import com.expensemanager.entity.User;
import com.expensemanager.exception.ResourceNotFoundException;
import com.expensemanager.repository.BudgetRepository;
import com.expensemanager.repository.ExpenseRepository;
import com.expensemanager.repository.IncomeRepository;
import com.expensemanager.repository.UserRepository;
import com.expensemanager.service.AIInsightService;
import com.expensemanager.service.GeminiService;

import org.springframework.security.core.context.SecurityContextHolder;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Transactional(readOnly = true)
public class AIInsightServiceImpl
        implements AIInsightService {

    private final GeminiService geminiService;

    private final IncomeRepository incomeRepository;

    private final ExpenseRepository expenseRepository;

    private final BudgetRepository budgetRepository;

    private final UserRepository userRepository;

    private final ObjectMapper objectMapper;

    public AIInsightServiceImpl(
            GeminiService geminiService,
            IncomeRepository incomeRepository,
            ExpenseRepository expenseRepository,
            BudgetRepository budgetRepository,
            UserRepository userRepository,
            ObjectMapper objectMapper) {

        this.geminiService = geminiService;
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public ApiResponse<AIInsightResponse>
            generateInsights(
                    AIInsightRequest request) {

        validateMonth(request.getMonth());

        User user = getCurrentUser();

        int month = request.getMonth();
        int year = request.getYear();

        BigDecimal income =
                incomeRepository.getMonthlyIncome(
                        user,
                        month,
                        year);

        BigDecimal expense =
                expenseRepository.getMonthlyExpense(
                        user,
                        month,
                        year);

        BigDecimal budget =
                budgetRepository.getTotalBudgetForMonth(
                        user,
                        month,
                        year);

        BigDecimal savings =
                income.subtract(expense);

        BigDecimal savingsRate =
                BigDecimal.ZERO;

        if (income.compareTo(
                BigDecimal.ZERO) > 0) {

            savingsRate =
                    savings
                            .divide(
                                    income,
                                    4,
                                    java.math.RoundingMode.HALF_UP)
                            .multiply(
                                    BigDecimal.valueOf(100))
                            .setScale(
                                    2,
                                    java.math.RoundingMode.HALF_UP);
        }

        String prompt =
                buildPrompt(
                        month,
                        year,
                        income,
                        expense,
                        budget,
                        savings,
                        savingsRate);

        String geminiResponse =
                geminiService.generateText(prompt);

        AIInsightResponse response =
                parseGeminiResponse(
                        geminiResponse);

        return new ApiResponse<>(
                true,
                "AI financial insights generated successfully.",
                response);
    }

    // =====================================================
    // BUILD PROMPT
    // =====================================================

    private String buildPrompt(
            int month,
            int year,
            BigDecimal income,
            BigDecimal expense,
            BigDecimal budget,
            BigDecimal savings,
            BigDecimal savingsRate) {

        return """
                You are an AI financial assistant
                inside an Expense Manager application.

                Analyze the following financial data.

                Month: %d
                Year: %d

                Total Income: ₹%s
                Total Expense: ₹%s
                Total Budget: ₹%s
                Savings: ₹%s
                Savings Rate: %s%%

                IMPORTANT RULES:

                1. Do not invent financial numbers.
                2. Use only the numbers provided.
                3. Do not provide investment advice.
                4. Give practical personal budgeting observations.
                5. Keep the language simple.
                6. Mention if expenses exceed the budget.
                7. Mention whether the savings rate is healthy,
                   moderate, or low, but make clear that this
                   is a general observation rather than financial advice.
                8. Give 3 to 5 useful insights.
                9. Give 2 to 4 practical recommendations.
                10. If there is no warning, return an empty
                    warning string.

                Return ONLY valid JSON.

                Required JSON structure:

                {
                  "summary": "short financial summary",
                  "insights": [
                    "insight 1",
                    "insight 2",
                    "insight 3"
                  ],
                  "recommendations": [
                    "recommendation 1",
                    "recommendation 2"
                  ],
                  "warning": "warning or empty string"
                }
                """.formatted(
                        month,
                        year,
                        income,
                        expense,
                        budget,
                        savings,
                        savingsRate);
    }

    // =====================================================
    // PARSE GEMINI RESPONSE
    // =====================================================

    private AIInsightResponse parseGeminiResponse(
            String response) {

        try {

            String cleaned =
                    response
                            .replace("```json", "")
                            .replace("```", "")
                            .trim();

            return objectMapper.readValue(
                    cleaned,
                    AIInsightResponse.class);

        } catch (Exception e) {

            /*
             * If Gemini returns text that is not valid JSON,
             * we don't expose a broken response.
             */

            List<String> insights =
                    new ArrayList<>();

            insights.add(
                    response);

            return new AIInsightResponse(
                    "AI generated a financial observation.",
                    insights,
                    List.of(),
                    "");
        }
    }

    // =====================================================
    // CURRENT USER
    // =====================================================

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

    // =====================================================
    // VALIDATE MONTH
    // =====================================================

    private void validateMonth(int month) {

        if (month < 1 || month > 12) {

            throw new IllegalArgumentException(
                    "Month must be between 1 and 12.");
        }
    }
}