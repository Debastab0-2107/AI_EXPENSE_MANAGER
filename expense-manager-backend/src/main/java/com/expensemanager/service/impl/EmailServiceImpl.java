package com.expensemanager.service.impl;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.expensemanager.email.EmailTemplate;
import com.expensemanager.service.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendOtpEmail(String toEmail,
                             String userName,
                             String otp) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(toEmail);

            helper.setSubject("Expense Manager - Verify Email");

            helper.setText(
                    EmailTemplate.getOtpEmail(userName, otp),
                    true);

            mailSender.send(message);

        }
        catch (MessagingException e) {

            throw new RuntimeException(e);

        }

    }//end

	@Override
	public void sendForgotPasswordOtpEmail(String toEmail, String userName, String otp) {
		// TODO Auto-generated method stub
        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(toEmail);

            helper.setSubject("Expense Manager - Password Reset OTP");

            helper.setText(
                    EmailTemplate.getForgotPasswordOtpEmail(userName, otp),
                    true);

            mailSender.send(message);

        }
        catch (MessagingException e) {

            throw new RuntimeException(e);
        }
     }//end

	@Override
	public void sendResetMessage(String toEmail, String userName) {
		// TODO Auto-generated method stub
        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(toEmail);

            helper.setSubject("Expense Manager - Reset Password successfull ");

            helper.setText(
                    EmailTemplate.getPasswordResetSuccessEmail(userName),
                    true);

            mailSender.send(message);

        }
        catch (MessagingException e) {

            throw new RuntimeException(e);
        }
		
	}//end


}