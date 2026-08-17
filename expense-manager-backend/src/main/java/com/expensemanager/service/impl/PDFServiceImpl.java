package com.expensemanager.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.expensemanager.dto.AIFinancialReportData;
import com.expensemanager.service.PDFService;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.options.Margin;
import com.microsoft.playwright.options.WaitUntilState;

@Service
public class PDFServiceImpl implements PDFService {

    private static final String TEMPLATE =
            "pdf/pdf.html";

    @Override
    public byte[] generateAIFinancialReport(
            AIFinancialReportData data) {

        try {

            String html =
                    loadTemplate();

            html =
                    replaceDynamicContent(
                            html,
                            data);

            try (Playwright playwright =
                         Playwright.create()) {

                try (Browser browser =
                             playwright.chromium()
                                     .launch(
                                             new BrowserType.LaunchOptions()
                                                     .setHeadless(true))) {

                    try (BrowserContext context =
                                 browser.newContext()) {

                        Page page =
                                context.newPage();

                        /*
                         * Set the complete HTML.
                         */
                        page.setContent(
                                html,
                                new Page.SetContentOptions()
                                        .setWaitUntil(
                                                WaitUntilState.NETWORKIDLE));

                        /*
                         * Give Chart.js time to render.
                         */
                        page.waitForTimeout(1500);

                        ByteArrayOutputStream output =
                                new ByteArrayOutputStream();

                        byte[] pdf =
                                page.pdf(
                                        new Page.PdfOptions()
                                                .setFormat("A4")
                                                .setPrintBackground(true)
                                                .setMargin(
                                                        new Margin()
                                                                .setTop("10mm")
                                                                .setBottom("5mm")
                                                                .setLeft("1mm")
                                                                .setRight("1mm")));

                        output.write(pdf);

                        return output.toByteArray();
                    }
                }
            }

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate AI financial PDF.",
                    e);
        }
    }

    private String loadTemplate()
            throws IOException {

        ClassPathResource resource =
                new ClassPathResource(TEMPLATE);

        try (InputStream inputStream =
                     resource.getInputStream()) {

            return new String(
                    inputStream.readAllBytes(),
                    StandardCharsets.UTF_8);
        }
    }

    private String replaceDynamicContent(
            String html,
            AIFinancialReportData data) {

        // =====================================================
        // FINANCIAL VALUES
        // =====================================================

        String income =
                formatAmount(data.getIncome());

        String expense =
                formatAmount(data.getExpense());

        String savings =
                formatAmount(data.getSavings());

        String budget =
                formatAmount(data.getBudget());

        String savingsRate =
                formatPercentage(data.getSavingsRate());

        String expenseRate =
                formatPercentage(data.getExpenseRate());

        String unusedBudget =
                formatAmount(data.getUnusedBudget());


        // =====================================================
        // BASIC VALUES
        // =====================================================

        html = html.replace(
                "{{totalIncome}}",
                income);

        html = html.replace(
                "{{totalExpenses}}",
                expense);

        html = html.replace(
                "{{totalSavings}}",
                savings);

        html = html.replace(
                "{{totalBudget}}",
                budget);

        html = html.replace(
                "{{savingsPercentage}}",
                savingsRate);

        html = html.replace(
                "{{expensePercentage}}",
                expenseRate);

        html = html.replace(
                "{{unusedBudget}}",
                unusedBudget);

        html = html.replace(
                "{{budgetStatus}}",
                safe(data.getBudgetStatus()));
        
        html = html.replace(
        	    "{{generatedDateTime}}",
        	    java.time.LocalDateTime.now()
        	        .format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"))
        	);


        // =====================================================
        // AI CONTENT
        // =====================================================

        html = html.replace(
                "{{financialOverview}}",
                safe(data.getFinancialOverview()));

        html = html.replace(
                "{{spendingAnalysis}}",
                safe(data.getSpendingAnalysis()));

        html = html.replace(
                "{{savingsPerformance}}",
                safe(data.getSavingsPerformance()));

        html = html.replace(
                "{{budgetPosition}}",
                safe(data.getBudgetPosition()));

        html = html.replace(
                "{{spendingBehaviour}}",
                safe(data.getSpendingBehaviour()));

        html = html.replace(
                "{{financialDirection}}",
                safe(data.getFinancialDirection()));

        html = html.replace(
                "{{savingsDescription}}",
                safe(data.getSavingsDescription()));

        html = html.replace(
                "{{recommendation}}",
                safe(data.getRecommendation()));


        // =====================================================
        // MONTH / YEAR
        // =====================================================

        html = html.replace(
                "{{reportMonth}}",
                String.valueOf(data.getMonth()));

        html = html.replace(
                "{{reportYear}}",
                String.valueOf(data.getYear()));


        return html;
    }//end
    
    //ABOVe METHOD HELPER SAFE//
    private String safe(String value) {

        if (value == null) {
            return "";
        }

        return value;
    }//end 
    
    
    private String formatAmount(
            java.math.BigDecimal amount) {

        if (amount == null) {
            return "0";
        }

        return amount
                .setScale(
                        2,
                        java.math.RoundingMode.HALF_UP)
                .toPlainString();
    }

    private String formatPercentage(
            java.math.BigDecimal percentage) {

        if (percentage == null) {
            return "0";
        }

        return percentage
                .setScale(
                        2,
                        java.math.RoundingMode.HALF_UP)
                .stripTrailingZeros()
                .toPlainString();
    }
}