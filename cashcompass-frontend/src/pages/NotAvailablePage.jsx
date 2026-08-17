import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./NotAvailablePage.css";

function NotAvailablePage() {
    const navigate = useNavigate();
    const location = useLocation();

    const feature = location.state?.feature || "This feature";

    return (
        <div className="not-available-page">

            {/* =========================================
                DECORATIVE BACKGROUND
               ========================================= */}
            <div className="not-available-orb orb-one"></div>
            <div className="not-available-orb orb-two"></div>

            {/* =========================================
                MAIN CARD
               ========================================= */}
            <div className="not-available-card">

                {/* Animated icon */}
                <div className="not-available-icon">
                    <span>⚙</span>
                </div>

                {/* Small label */}
                <p className="not-available-label">
                    CASHCOMPASS
                </p>

                {/* Main heading */}
                <h1>
                    {feature}
                </h1>

                <h2>
                    Not Available Yet
                </h2>

                {/* Description */}
                <p className="not-available-description">
                    This feature isn't available right now.
                    We're working on it and will bring it to
                    CashCompass soon.
                </p>

                {/* Status badge */}
                <div className="not-available-badge">
                    <span></span>
                    Coming Soon
                </div>

                {/* Back button */}
                <button
                    className="not-available-back"
                    onClick={() => navigate(-1)}
                >
                    <span>←</span>
                    Go Back
                </button>

            </div>

        </div>
    );
}

export default NotAvailablePage;