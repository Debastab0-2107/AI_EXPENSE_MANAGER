import React from "react";
import "./LogoutModal.css";

function LogoutModal({ onCancel, onConfirm, loading }) {
    return (
        <div className="logout-modal-overlay">
            
            <div className="logout-modal">

                {/* Animated logout icon */}
                <div className="logout-modal-icon">
                    <span>↪</span>
                </div>

                {/* Small label */}
                <p className="logout-modal-label">
                    CASHCOMPASS
                </p>

                {/* Heading */}
                <h2>Ready to leave?</h2>

                {/* Message */}
                <p className="logout-modal-message">
                    Are you sure you want to logout from your
                    CashCompass account?
                </p>

                {/* Buttons */}
                <div className="logout-modal-actions">

                    <button
                        type="button"
                        className="logout-cancel-button"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Stay Logged In
                    </button>

                    <button
                        type="button"
                        className="logout-confirm-button"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="logout-spinner"></span>
                                Logging out...
                            </>
                        ) : (
                            <>
                                <span>↪</span>
                                Logout
                            </>
                        )}
                    </button>

                </div>

            </div>
        </div>
    );
}

export default LogoutModal;