package com.expensemanager.util;

import java.util.Random;

public class OtpGenerator {

    private OtpGenerator() {
    }

    public static String generateOtp() {

        Random random = new Random();

        int otp = 100000 + random.nextInt(900000);
        System.out.println("😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑");
        System.out.println("😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑");
        System.out.println("😑     Generated OTP = " + otp+"  😑");
        System.out.println("😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑");
        System.out.println("😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑😑");
        return String.valueOf(otp);
    }
}