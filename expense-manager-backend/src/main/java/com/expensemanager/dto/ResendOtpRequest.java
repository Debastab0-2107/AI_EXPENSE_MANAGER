package com.expensemanager.dto;

import jakarta.validation.constraints.Email;

public class ResendOtpRequest {

    @Email(message = "Invalid Email")
    private String email;

    public ResendOtpRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}