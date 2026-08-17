package com.expensemanager.service;

public interface EmailService {

    void sendOtpEmail(String toEmail, String userName, String otp);
    
    void sendForgotPasswordOtpEmail(String toEmail, String userName, String otp);
    
    void sendResetMessage( String toEmail, String userName);

}