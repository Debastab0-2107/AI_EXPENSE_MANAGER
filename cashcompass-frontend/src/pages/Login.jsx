import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:8080";

const LOGO_URL =
    "https://raw.githubusercontent.com/parambratamoitra/fsp/main/newlogoGreen.png";

function Login() {

    const { login } = useAuth();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


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

        if (!formData.email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!formData.password) {
            setError("Please enter your password.");
            return;
        }


        try {

            setLoading(true);


            const response = await fetch(
                `${API_BASE_URL}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok || data.success === false) {

                throw new Error(
                    data.message ||
                    "Login failed."
                );
            }


            /*
             * Your backend returns:
             *
             * {
             *   success: true,
             *   message: "Login successful.",
             *   data: {
             *      token: "JWT..."
             *   }
             * }
             */

            const token = data?.data?.token;


            if (!token) {

                throw new Error(
                    "Login succeeded but no JWT token was returned."
                );
            }


            /*
             * Store JWT for future API requests.
             */

            login(token);

            localStorage.setItem(
                    "cashcompass_user_email",
                     formData.email
            );


            localStorage.setItem(
                "cashcompass_user_email",
                formData.email
            );


            /*
             * Dashboard will be replaced with your
             * actual reference design later.
             */

            navigate("/dashboard");


        } catch (error) {

            setError(
                error.message ||
                "Unable to login. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="auth-page login-page">

            {/* =====================================================
                BACKGROUND
            ====================================================== */}

            <div className="background-glow glow-one"></div>
            <div className="background-glow glow-two"></div>

            <div className="floating-dot dot-1"></div>
            <div className="floating-dot dot-2"></div>
            <div className="floating-dot dot-3"></div>
            <div className="floating-dot dot-4"></div>
            <div className="floating-dot dot-5"></div>


            {/* =====================================================
                LOGIN FORM
                LEFT SIDE
            ====================================================== */}

            <section className="auth-form-section login-form-section">

                <div className="auth-card">

                    <div className="auth-card-header">

                        <h2>
                            Welcome back to CashCompass
                        </h2>

                        <p>
                            Login to continue managing your finances
                        </p>

                    </div>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        {/* EMAIL */}

                        <div className="input-group">

                            <label htmlFor="login-email">
                                Email Address
                            </label>

                            <input
                                id="login-email"
                                name="email"
                                type="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="input-group">

                            <div className="password-label-row">

                                <label htmlFor="login-password">
                                    Password
                                </label>

                                <Link to="/forgot-password">
                                    Forgot Password?
                                </Link>

                            </div>


                            <div className="password-wrapper">

                                <input
                                    id="login-password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    ◉
                                </button>

                            </div>

                        </div>


                        {/* REMEMBER ME */}

                        <label className="remember-row">

                            <input
                                type="checkbox"
                            />

                            <span>
                                Remember me
                            </span>

                        </label>


                        {/* ERROR */}

                        {error && (

                            <div className="auth-message error-message">
                                {error}
                            </div>

                        )}


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="primary-auth-button"
                            disabled={loading}
                        >

                            {loading
                                ? "LOGGING IN..."
                                : "LOGIN"
                            }

                        </button>


                        {/* REGISTER LINK */}

                        <div className="switch-auth">

                            Don't have an account?

                            <Link to="/register">
                                Create Account
                            </Link>

                        </div>

                    </form>

                </div>

            </section>


            {/* =====================================================
                BRANDING
                RIGHT SIDE
            ====================================================== */}

            <section className="auth-brand-section login-brand-section">

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
                        Take control of your income, expenses,
                        savings and financial goals from one
                        simple and intelligent place.
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
                EXTERNAL LOGO
            ====================================================== */}

            <a
                className="external-logo-login"
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

export default Login;