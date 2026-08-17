package com.expensemanager.service;

import com.expensemanager.dto.AIInsightRequest;
import com.expensemanager.dto.AIInsightResponse;
import com.expensemanager.dto.ApiResponse;


public interface AIInsightService {

    ApiResponse<AIInsightResponse>
    generateInsights(
            AIInsightRequest request);
}