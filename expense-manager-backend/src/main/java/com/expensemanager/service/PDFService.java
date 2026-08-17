package com.expensemanager.service;

import com.expensemanager.dto.AIFinancialReportData;

public interface PDFService {

    byte[] generateAIFinancialReport(
            AIFinancialReportData reportData);
}