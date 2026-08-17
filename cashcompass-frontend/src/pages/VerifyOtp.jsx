import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import "./VerifyOtp.css";
import "../styles/Auth.css";

function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();

    /*
     * The email is passed from Register page.
     *
     * Example:
     * navigate("/verify-otp", {
     *     state: { email: form.email }
     * });
     */
    const email = location.state?.email || "";

const [otp, setOtp] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const [showSuccess, setShowSuccess] = useState(false);

/*
 * =========================================
 * RESEND OTP STATES
 * =========================================
 */

const [resendLoading, setResendLoading] = useState(false);

const [resendMessage, setResendMessage] = useState("");

const [resendError, setResendError] = useState("");

const [resendCooldown, setResendCooldown] = useState(0);

/*
 * =========================================
 * RESEND OTP COUNTDOWN
 * =========================================
 */

useEffect(() => {

    if (resendCooldown <= 0) {
        return;
    }

    const timer = setInterval(() => {

        setResendCooldown((previous) => {

            if (previous <= 1) {
                clearInterval(timer);
                return 0;
            }

            return previous - 1;
        });

    }, 1000);

    return () => clearInterval(timer);

}, [resendCooldown]);

    const handleOtpChange = (e) => {
        const value = e.target.value;

        /*
         * Allow only numbers
         * Maximum 6 digits
         */
        if (/^\d{0,6}$/.test(value)) {
            setOtp(value);
            setError("");
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!email) {
            setError("Email information is missing. Please register again.");
            return;
        }

        if (otp.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            /*
             * Send OTP + email to backend
             *
             * CHANGE THIS URL if your backend uses
             * a different verification endpoint.
             */
            await api.post("/api/auth/verify-otp", {
                email: email,
                otp: otp,
            });

            /*
             * Verification successful
             */
            setShowSuccess(true);

            /*
             * Wait for the success animation/message
             * before going to login.
             */
            setTimeout(() => {
                navigate("/login");
            }, 2500);

        } catch (verifyError) {
            console.error("OTP verification error:", verifyError);

            setError(
                verifyError.message ||
                "Invalid or expired OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };
    
    const handleResendOtp = async () => {
      if (!email) {
        setResendError("Email information is missing. Please register again.");
        return;
      }

      if (resendCooldown > 0 || resendLoading) {
        return;
      }

      try {
        setResendLoading(true);

        setResendMessage("");
        setResendError("");
        setError("");

        /*
         * Ask backend to generate and send
         * a new OTP to the same email.
         */
        await api.post("/api/auth/resend-otp", {
          email: email,
        });

        /*
         * Successfully sent new OTP
         */
        setResendMessage("A new OTP has been sent to your email.");

        /*
         * Start 60-second cooldown
         */
        setResendCooldown(60);

        /*
         * Clear the old OTP
         */
        setOtp("");
      } catch (resendError) {
        console.error("Resend OTP error:", resendError);

        setResendError(
          resendError.message || "Unable to resend OTP. Please try again.",
        );
      } finally {
        setResendLoading(false);
      }
    };

    return (
      <div className="verify-page">
        {/* =============================== */}
        {/* OTP CARD */}
        {/* =============================== */}

        <div className="verify-card">
          <div className="verify-logo">
            <img
              src="https://raw.githubusercontent.com/parambratamoitra/fsp/main/newlogoGreen.png"
              alt="CashCompass"
            />
          </div>

          <div className="verify-icon">✉</div>

          <h1>Verify Your Email</h1>

          <p className="verify-description">
            We've sent a 6-digit verification code to
          </p>

          <strong className="verify-email">
            {email || "your email address"}
          </strong>

          <form onSubmit={handleVerify}>
            <label htmlFor="otp">Enter OTP</label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              disabled={loading || showSuccess}
            />

            {error && <div className="verify-error">{error}</div>}

            <button type="submit" disabled={loading || showSuccess}>
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="resend-section">
            <p className="verify-footer">Didn't receive the code?</p>

            {resendCooldown > 0 ? (
              <div className="resend-timer">
                <div className="timer-circle">
                  <span>{resendCooldown}</span>
                </div>

                <div className="timer-text">
                  <span>Resend OTP available in</span>

                  <strong>00:{String(resendCooldown).padStart(2, "0")}</strong>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="resend-button"
                onClick={handleResendOtp}
                disabled={loading || resendLoading || showSuccess}
              >
                {resendLoading ? "Sending..." : "↻ Resend OTP"}
              </button>
            )}

            {resendMessage && (
              <div className="resend-success">✓ {resendMessage}</div>
            )}

            {resendError && <div className="resend-error">{resendError}</div>}
          </div>
        </div>

        {/* ===================================== */}
        {/* SUCCESS POPUP */}
        {/* ===================================== */}

        {showSuccess && (
          <div className="verification-overlay">
            <div className="verification-success-popup">
              <div className="success-check">✓</div>

              <h2>You're Verified!</h2>

              <p>Your email has been successfully verified.</p>

              <p className="login-message">
                Now login to the app using your email and password.
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

export default VerifyOtp;