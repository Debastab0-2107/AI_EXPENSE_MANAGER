import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const API_BASE_URL = "http://localhost:8080";

const LOGO_URL =
    "https://raw.githubusercontent.com/parambratamoitra/fsp/main/newlogoGreen.png";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.fullName.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!formData.email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!formData.mobile.trim()) {
            setError("Please enter your mobile number.");
            return;
        }

        if (!formData.password) {
            setError("Please enter a password.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }


        try {

            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        fullName: formData.fullName,
                        email: formData.email,
                        mobile: formData.mobile,
                        password: formData.password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok || data.success === false) {

                let message = data.message || "Registration failed.";

                if (
                    data.data &&
                    typeof data.data === "object"
                ) {

                    const validationErrors =
                        Object.values(data.data);

                    if (validationErrors.length > 0) {
                        message = validationErrors.join(" ");
                    }
                }

                throw new Error(message);
            }


            navigate("/verify-otp", {
              state: {
                email: formData.email,
              },
            });


            /*
             * We are not navigating to OTP yet because
             * the OTP page will be created separately.
             *
             * For now, after registration we allow the user
             * to go to Login.
             */

        } catch (error) {

            setError(
                error.message ||
                "Something went wrong. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="auth-page register-page">

            {/* =====================================================
                BACKGROUND DECORATION
            ====================================================== */}

            <div className="background-glow glow-one"></div>
            <div className="background-glow glow-two"></div>

            <div className="floating-dot dot-1"></div>
            <div className="floating-dot dot-2"></div>
            <div className="floating-dot dot-3"></div>
            <div className="floating-dot dot-4"></div>
            <div className="floating-dot dot-5"></div>


            {/* =====================================================
                LEFT BRANDING SECTION
            ====================================================== */}

            <section className="auth-brand-section">

                <div className="brand-content">

                    <div className="brand-small-heading">
                        YOUR FINANCIAL JOURNEY
                    </div>

                    <h1 className="brand-title">
                        cash
                        <br />
                        compass
                    </h1>

                    <h2 className="brand-tagline">
                        Directing your money, daily.
                    </h2>

                    <p className="brand-description">
                        Create your account and start managing
                        your income, expenses, savings and
                        financial goals from one simple place.
                    </p>


                    <div className="floating-message message-one">
                        Take control of your money.
                    </div>

                    <div className="floating-message message-two">
                        Track. Save. Grow.
                    </div>

                </div>

            </section>


            {/* =====================================================
                REGISTER FORM
            ====================================================== */}

            <section className="auth-form-section">

                <div className="auth-card">

                    <div className="auth-card-header">

                        <h2>
                            Create your CashCompass account
                        </h2>

                        <p>
                            Register to start managing your finances
                        </p>

                    </div>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        {/* FULL NAME */}

                        <div className="input-group">

                            <label htmlFor="fullName">
                                Full Name
                            </label>

                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                autoComplete="name"
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="input-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />

                        </div>


                        {/* MOBILE */}

                        <div className="input-group">

                            <label htmlFor="mobile">
                                Mobile Number
                            </label>

                            <input
                                id="mobile"
                                name="mobile"
                                type="tel"
                                placeholder="+91 XXXXX XXXXX"
                                value={formData.mobile}
                                onChange={handleChange}
                                autoComplete="tel"
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="input-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="password-wrapper">

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? "◉" : "◉"}
                                </button>

                            </div>

                        </div>


                        {/* TERMS */}

                        <label className="terms-row">

                            <input
                                type="checkbox"
                                required
                            />

                            <span>
                                I agree to the{" "}
                                <a
                                    href="#"
                                    onClick={(event) =>
                                        event.preventDefault()
                                    }
                                >
                                    Terms of Service
                                </a>
                                {" "}and{" "}
                                <a
                                    href="#"
                                    onClick={(event) =>
                                        event.preventDefault()
                                    }
                                >
                                    Privacy Policy
                                </a>
                            </span>

                        </label>


                        {/* ERROR */}

                        {error && (

                            <div className="auth-message error-message">
                                {error}
                            </div>

                        )}


                        {/* SUCCESS */}

                        {success && (

                            <div className="auth-message success-message">
                                {success}
                            </div>

                        )}


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="primary-auth-button"
                            disabled={loading}
                        >

                            {loading
                                ? "CREATING ACCOUNT..."
                                : "CREATE ACCOUNT"
                            }

                        </button>


                        {/* LOGIN LINK */}

                        <div className="switch-auth">

                            Already have an account?

                            <Link to="/login">
                                Login
                            </Link>

                        </div>

                    </form>

                </div>

            </section>


            {/* =====================================================
                EXTERNAL LOGO
            ====================================================== */}

            <a
                className="external-logo"
                href="#"
                onClick={(event) =>
                    event.preventDefault()
                }
                aria-label="CashCompass"
            >

                <img
                    src={LOGO_URL}
                    alt="CashCompass"
                />

            </a>

        </div>
    );
}

export default Register;