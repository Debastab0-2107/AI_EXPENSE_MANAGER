package com.expensemanager.email;

public class EmailTemplate {

    private EmailTemplate() {
    }

    public static String getOtpEmail(String name, String otp) {

        return """
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>

body{
    background:#f5f5f5;
    font-family:Arial,sans-serif;
}

.container{
    max-width:600px;
    margin:auto;
    background:white;
    padding:40px;
    border-radius:12px;
    box-shadow:0 0 10px rgba(0,0,0,.1);
}

.header{
    text-align:center;
    color:#1565c0;
}

.otp{

    font-size:34px;
    font-weight:bold;

    letter-spacing:8px;

    color:white;

    background:#1565c0;

    padding:18px;

    border-radius:10px;

    text-align:center;

    margin:30px 0;

}

.footer{

    font-size:13px;

    color:gray;

    margin-top:40px;

}

</style>
</head>

<body>

<div class="container">

<h1 class="header">
Expense Manager
</h1>

<h2>Email Verification</h2>

<p>Hello <b>%s</b>,</p>

<p>
Your One-Time Password is:
</p>

<div class="otp">

%s

</div>

<p>

This OTP is valid for <b>5 minutes</b>.

</p>

<p>

If you didn't request this email, simply ignore it.

</p>

<hr>

<div class="footer">

© 2026 Expense Manager Team

</div>

</div>

</body>

</html>
""".formatted(name, otp);

    }//end of first public method for register
    
    public static String getForgotPasswordOtpEmail(String name, String otp) {

        return """
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <style>

    body{
        background:#f5f5f5;
        font-family:Arial,sans-serif;
    }

    .container{
        max-width:600px;
        margin:auto;
        background:white;
        padding:40px;
        border-radius:12px;
        box-shadow:0 0 10px rgba(0,0,0,.1);
    }

    .header{
        text-align:center;
        color:#d32f2f;
    }

    .otp{
        font-size:34px;
        font-weight:bold;
        letter-spacing:8px;
        color:white;
        background:#d32f2f;
        padding:18px;
        border-radius:10px;
        text-align:center;
        margin:30px 0;
    }

    .footer{
        font-size:13px;
        color:gray;
        margin-top:40px;
    }

    </style>
    </head>

    <body>

    <div class="container">

    <h1 class="header">
    Expense Manager
    </h1>

    <h2>Password Reset Request</h2>

    <p>Hello <b>%s</b>,</p>

    <p>
    We received a request to reset your password.
    Use the OTP below to continue:
    </p>

    <div class="otp">

    %s

    </div>

    <p>
    This OTP is valid for <b>10 minutes</b>.
    </p>

    <p>
    If you did not request a password reset, please ignore this email.
    Your password will remain unchanged.
    </p>

    <hr>

    <div class="footer">
    © 2026 Expense Manager Team
    </div>

    </div>

    </body>
    </html>
    """.formatted(name, otp);

    }//end of public method for forgot otp
    
    public static String getPasswordResetSuccessEmail(String name) {

        return """
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <style>

    body{
        background:#f5f5f5;
        font-family:Arial,sans-serif;
    }

    .container{
        max-width:600px;
        margin:auto;
        background:white;
        padding:40px;
        border-radius:12px;
        box-shadow:0 0 10px rgba(0,0,0,.1);
    }

    .header{
        text-align:center;
        color:#2e7d32;
    }

    .success-box{
        background:#2e7d32;
        color:white;
        font-size:28px;
        font-weight:bold;
        text-align:center;
        padding:22px;
        border-radius:10px;
        margin:30px 0;
    }

    .message{
        font-size:16px;
        line-height:1.7;
        color:#333;
    }

    .info{
        background:#f1f8e9;
        border-left:5px solid #2e7d32;
        padding:15px;
        margin-top:25px;
        border-radius:6px;
        color:#444;
    }

    .footer{
        font-size:13px;
        color:gray;
        margin-top:40px;
    }

    </style>
    </head>

    <body>

    <div class="container">

    <h1 class="header">
    Expense Manager
    </h1>

    <h2>Password Reset Successful</h2>

    <p class="message">
    Hello <b>%s</b>,
    </p>

    <p class="message">
    Your password has been successfully reset. You can now sign in to your Expense Manager account using your new password.
    </p>

    <div class="success-box">
    ✓ Password Updated Successfully
    </div>

    <div class="info">
    <strong>Security Tip:</strong><br><br>
    If you made this change, no further action is required.<br><br>
    If you did <b>not</b> reset your password, please change your password immediately and contact our support team as soon as possible.
    </div>

    <p class="message" style="margin-top:30px;">
    Thank you for keeping your account secure.
    </p>

    <hr>

    <div class="footer">
    © 2026 Expense Manager Team
    </div>

    </div>

    </body>
    </html>
    """.formatted(name);
    }// end of the public class for reset message

}