import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "../styles/Auth.css";

const LOGO_URL =
    "https://raw.githubusercontent.com/parambratamoitra/fsp/main/newlogoGreen.png";

function ResetPassword() {

    const navigate = useNavigate();
    const location = useLocation();

    /*
     * Email comes from ForgotPassword page.
     */
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [showSuccess, setShowSuccess] = useState(false);


    const handleOtpChange = (event) => {

        const value = event.target.value;

        if (/^\d{0,6}$/.test(value)) {

            setOtp(value);
            setError("");

        }
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!email) {

            setError(
                "Email information is missing. Please start the password reset again."
            );

            return;
        }


        if (otp.length !== 6) {

            setError(
                "Please enter the 6-digit OTP."
            );

            return;
        }


        if (!newPassword) {

            setError(
                "Please enter a new password."
            );

            return;
        }


        if (newPassword.length < 8) {

            setError(
                "New password must contain at least 8 characters."
            );

            return;
        }


        try {

            setLoading(true);

            /*
             * Send email + OTP + new password
             * to Spring Boot backend.
             */
            await api.post(
                "/api/auth/reset-password",
                {
                    email: email,
                    otp: otp,
                    newPassword: newPassword
                }
            );


            /*
             * Password successfully changed.
             */
            setShowSuccess(true);


            /*
             * Give the user time to see the
             * success animation.
             */
            setTimeout(() => {

                navigate("/login");

            }, 2800);


        } catch (resetError) {

            console.error(
                "Password reset error:",
                resetError
            );

            setError(
                resetError.message ||
                "Unable to reset your password."
            );

        } finally {

            setLoading(false);

        }
    };


    /*
     * If someone directly opens
     * /reset-password without going through
     * Forgot Password, there is no email.
     */
    if (!email) {

        return (

            <div className="reset-invalid-page">

                <div className="reset-invalid-card">

                    <div className="reset-invalid-icon">
                        ⚠
                    </div>

                    <h2>
                        Reset session expired
                    </h2>

                    <p>
                        Please start the password reset process
                        again from the login page.
                    </p>

                    <button
                        onClick={() => navigate("/forgot-password")}
                    >
                        Start Again
                    </button>

                </div>

            </div>

        );
    }


    return (

        <div className="auth-page reset-auth-page">

            {/* BACKGROUND */}

            <div className="background-glow glow-one"></div>
            <div className="background-glow glow-two"></div>

            <div className="floating-dot dot-1"></div>
            <div className="floating-dot dot-2"></div>
            <div className="floating-dot dot-3"></div>
            <div className="floating-dot dot-4"></div>
            <div className="floating-dot dot-5"></div>


            {/* BRANDING */}

            <section className="auth-brand-section">

                <div className="brand-content">

                    <div className="brand-small-heading">
                        CASHCOMPASS SECURITY
                    </div>

                    <h1 className="brand-title">
                        new
                        <br />
                        password
                    </h1>

                    <h2 className="brand-tagline">
                        A fresh start for your account.
                    </h2>

                    <p className="brand-description">
                        Enter the OTP sent to your email
                        and create a new secure password.
                    </p>

                    <div className="floating-message message-one">
                        Stay secure.
                    </div>

                    <div className="floating-message message-two">
                        Keep moving forward.
                    </div>

                </div>

            </section>


            {/* RESET CARD */}

            <section className="auth-form-section">

                <div className="auth-card password-reset-card">

                    <div className="auth-card-header">

                        <div className="reset-card-icon">
                            🔑
                        </div>

                        <h2>
                            Reset your password
                        </h2>

                        <p>
                            Enter the OTP and your new password
                            below.
                        </p>

                    </div>


                    {/* EMAIL */}

                    <div className="reset-email-display">

                        <span>
                            Resetting password for
                        </span>

                        <strong>
                            {email}
                        </strong>

                    </div>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        {/* OTP */}

                        <div className="input-group">

                            <label htmlFor="reset-otp">
                                Verification OTP
                            </label>

                            <input
                                id="reset-otp"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={handleOtpChange}
                                maxLength={6}
                                disabled={loading || showSuccess}
                            />

                        </div>


                        {/* NEW PASSWORD */}

                        <div className="input-group">

                            <label htmlFor="new-password">
                                New Password
                            </label>

                            <div className="password-wrapper">

                                <input
                                    id="new-password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Create your new password"
                                    value={newPassword}
                                    onChange={(event) => {
                                        setNewPassword(
                                            event.target.value
                                        );
                                        setError("");
                                    }}
                                    autoComplete="new-password"
                                    disabled={
                                        loading ||
                                        showSuccess
                                    }
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    disabled={
                                        loading ||
                                        showSuccess
                                    }
                                >
                                    ◉
                                </button>

                            </div>

                        </div>


                        {error && (

                            <div className="auth-message error-message">
                                {error}
                            </div>

                        )}


                        <button
                            type="submit"
                            className="primary-auth-button"
                            disabled={
                                loading ||
                                showSuccess
                            }
                        >

                            {loading
                                ? "RESETTING PASSWORD..."
                                : "RESET PASSWORD"
                            }

                        </button>


                        <div className="switch-auth">

                            Remember your password?

                            <button
                                type="button"
                                className="auth-link-button"
                                onClick={() =>
                                    navigate("/login")
                                }
                            >
                                Back to Login
                            </button>

                        </div>

                    </form>

                </div>

            </section>


            {/* LOGO */}

            <a
                className="external-logo"
                href="#"
                onClick={(event) =>
                    event.preventDefault()
                }
            >

                <img
                    src={LOGO_URL}
                    alt="CashCompass"
                />

            </a>


            {/* SUCCESS POPUP */}

            {showSuccess && (

                <div className="password-success-overlay">

                    <div className="password-success-popup">

                        <div className="password-success-orbit">

                            <div className="password-success-check">
                                ✓
                            </div>

                        </div>


                        <p className="success-kicker">
                            CASHCOMPASS SECURITY
                        </p>


                        <h2>
                            Password Changed!
                        </h2>


                        <p>
                            Your password has been successfully
                            updated.
                        </p>


                        <p className="success-login-message">
                            You can now login using your new
                            password.
                        </p>


                        <div className="success-loader">

                            <span></span>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default ResetPassword;