import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "../styles/Auth.css";

const LOGO_URL =
    "https://raw.githubusercontent.com/parambratamoitra/fsp/main/newlogoGreen.png";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        try {

            setLoading(true);

            await api.post(
                "/api/auth/forgot-password",
                {
                    email: email.trim()
                }
            );

            /*
             * OTP has been successfully sent.
             *
             * Move to the password reset page and
             * carry the email address with us.
             */
            navigate("/reset-password", {
                state: {
                    email: email.trim()
                }
            });

        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );

            setError(
                error.message ||
                "Unable to send OTP. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="auth-page reset-auth-page">

            {/* BACKGROUND DECORATION */}

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
                        reset
                        <br />
                        your
                        <br />
                        password
                    </h1>

                    <h2 className="brand-tagline">
                        We'll help you get back in.
                    </h2>

                    <p className="brand-description">
                        Enter your registered email address
                        and we'll send you a secure OTP to
                        reset your password.
                    </p>

                    <div className="floating-message message-one">
                        Secure & simple.
                    </div>

                    <div className="floating-message message-two">
                        Your account stays protected.
                    </div>

                </div>

            </section>


            {/* FORGOT PASSWORD CARD */}

            <section className="auth-form-section">

                <div className="auth-card password-reset-card">

                    <div className="auth-card-header">

                        <div className="reset-card-icon">
                            🔐
                        </div>

                        <h2>
                            Forgot your password?
                        </h2>

                        <p>
                            Enter your registered email address
                            to receive a password reset OTP.
                        </p>

                    </div>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="input-group">

                            <label htmlFor="forgot-email">
                                Email Address
                            </label>

                            <input
                                id="forgot-email"
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setError("");
                                }}
                                autoComplete="email"
                                disabled={loading}
                            />

                        </div>


                        {error && (

                            <div className="auth-message error-message">
                                {error}
                            </div>

                        )}


                        <button
                            type="submit"
                            className="primary-auth-button"
                            disabled={loading}
                        >

                            {loading
                                ? "SENDING OTP..."
                                : "SEND OTP"
                            }

                        </button>


                        <div className="switch-auth">

                            Remember your password?

                            <button
                                type="button"
                                className="auth-link-button"
                                onClick={() => navigate("/login")}
                            >
                                Login
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

        </div>
    );
}

export default ForgotPassword;