package com.expensemanager.dto;

import java.util.List;

public class AIInsightResponse {

    private String summary;

    private List<String> insights;

    private List<String> recommendations;

    private String warning;

    public AIInsightResponse() {
    }

    public AIInsightResponse(
            String summary,
            List<String> insights,
            List<String> recommendations,
            String warning) {

        this.summary = summary;
        this.insights = insights;
        this.recommendations = recommendations;
        this.warning = warning;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getInsights() {
        return insights;
    }

    public void setInsights(List<String> insights) {
        this.insights = insights;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(
            List<String> recommendations) {

        this.recommendations = recommendations;
    }

    public String getWarning() {
        return warning;
    }

    public void setWarning(String warning) {
        this.warning = warning;
    }
}