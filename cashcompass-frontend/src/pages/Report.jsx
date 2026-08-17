import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "./Report.css";
import LogoutModal from "../components/LogoutModal";
import { useAuth } from "../context/AuthContext";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 0,
    })}`;

const shortMonth = (month) => MONTHS[month - 1]?.slice(0, 3).toUpperCase() || "";

function Report() {
    const navigate = useNavigate();
    const now = new Date();
    const [reportData, setReportData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [insightLoading, setInsightLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [error, setError] = useState("");
    const [insightError, setInsightError] = useState("");
    const [pdfMessage, setPdfMessage] = useState("");
    const [hoveredBar, setHoveredBar] = useState(null);
    const { logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const loadTwelveMonths = async () => {
        try {
            setLoading(true);
            setError("");
            const requests = [];
            for (let offset = 11; offset >= 0; offset--) {
                const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                requests.push(
                    api.get(`/api/reports/monthly?month=${month}&year=${year}`)
                        .then((response) => ({
                            month,
                            year,
                            totalIncome: Number(response?.data?.totalIncome || 0),
                            totalExpense: Number(response?.data?.totalExpense || 0),
                            balance: Number(response?.data?.balance || 0),
                        }))
                );
            }
            setReportData(await Promise.all(requests));
        } catch (loadError) {
            console.error("Report loading error:", loadError);
            setError(loadError.message || "Unable to load report data.");
        } finally {
            setLoading(false);
        }
    };

    const loadInsights = async (month = selectedMonth, year = selectedYear) => {
        try {
            setInsightLoading(true);
            setInsightError("");
            const response = await api.post("/api/ai-insights/monthly", { month, year });
            setInsights(response?.data || null);
        } catch (loadError) {
            console.error("AI insight error:", loadError);
            setInsights(null);
            setInsightError(loadError.message || "Unable to generate AI insights.");
        } finally {
            setInsightLoading(false);
        }
    };

    useEffect(() => {
        loadTwelveMonths();
       // loadInsights();
    }, []);

    const chartMax = useMemo(() => {
        const max = Math.max(
            ...reportData.map((item) => Math.max(item.totalIncome, item.totalExpense)),
            1
        );
        return Math.ceil(max / 1000) * 1000 || 1000;
    }, [reportData]);

    const totals = useMemo(() => ({
        income: reportData.reduce((sum, item) => sum + item.totalIncome, 0),
        expense: reportData.reduce((sum, item) => sum + item.totalExpense, 0),
    }), [reportData]);

    const selectedReport = reportData.find(
        (item) => item.month === selectedMonth && item.year === selectedYear
    );

    const handleInsightMonthChange = async (month, year) => {
        setSelectedMonth(month);
        setSelectedYear(year);
        await loadInsights(month, year);
    };

    const downloadPdf = async () => {
        try {
            setPdfLoading(true);
            setPdfMessage("");
            const blob = await api.download(
                `/api/ai-insights/monthly/pdf?month=${selectedMonth}&year=${selectedYear}`
            );
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `CashCompass-AI-Financial-Report-${MONTHS[selectedMonth - 1]}-${selectedYear}.pdf`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            window.URL.revokeObjectURL(url);
            setPdfMessage(`Report downloaded for ${MONTHS[selectedMonth - 1]} ${selectedYear}.`);
        } catch (downloadError) {
            console.error("PDF download error:", downloadError);
            setPdfMessage(downloadError.message || "Unable to download the report.");
        } finally {
            setPdfLoading(false);
        }
    };

    const insightItems = insights?.insights || [];
    const recommendations = insights?.recommendations || [];

    return (
      <div className="report-page">
        <aside className="report-sidebar">
          <div className="report-sidebar-logo">
            <img
              src="https://raw.githubusercontent.com/parambratamoitra/fsp/main/newlogoGreen.png"
              alt="CashCompass"
            />
          </div>

          <div className="report-sidebar-menu">
            <button
              className="report-sidebar-item"
              onClick={() => navigate("/dashboard")}
            >
              <span>▦</span>
              <small>Dashboard</small>
            </button>
            <button
              className="report-sidebar-item"
              onClick={() => navigate("/income")}
            >
              <span>↗</span>
              <small>Income</small>
            </button>
            <button
              className="report-sidebar-item"
              onClick={() => navigate("/expense")}
            >
              <span>↘</span>
              <small>Expense</small>
            </button>
            <button
              className="report-sidebar-item"
              onClick={() => navigate("/transactions")}
            >
              <span>≡</span>
              <small>Transactions</small>
            </button>
            <button
              className="report-sidebar-item"
              onClick={() => navigate("/budget")}
            >
              <span>◫</span>
              <small>Budget</small>
            </button>
            <button className="report-sidebar-item active" aria-current="page">
              <span>▤</span>
              <small>Reports</small>
            </button>
          </div>

          <div className="report-sidebar-bottom">
            <button
              className="sidebar-item"
              onClick={() =>
                navigate("/not-available", {
                  state: { feature: "Settings" },
                })
              }
            >
              <span>⚙</span>
              <small>Settings</small>
            </button>
            <button
              className="sidebar-item logout-item"
              onClick={() => setShowLogoutModal(true)}
            >
              <span>↪</span>
              <small>Logout</small>
            </button>
          </div>
        </aside>

        <main className="report-main">
          <header className="report-header">
            <div className="report-brand">
              <img
                src="https://raw.githubusercontent.com/parambratamoitra/fsp/main/newlogoGreen.png"
                alt="CashCompass"
              />
              <div>
                <h2>CashCompass</h2>
                <p>Directing your money, daily.</p>
              </div>
            </div>
            <nav className="report-top-nav">
              <button onClick={() => navigate("/dashboard")}>Dashboard</button>
              <button onClick={() => navigate("/income")}>Income</button>
              <button onClick={() => navigate("/expenses")}>Expenses</button>
              <button className="active" onClick={() => navigate("/reports")}>
                Reports
              </button>
              <button onClick={() => navigate("/transactions")}>
                Transactions
              </button>
              <button onClick={() => navigate("/budget")}>Budget</button>
            </nav>
            <div className="transaction-header-actions">
              <button
                className="icon-button"
                onClick={() =>
                  navigate("/not-available", {
                    state: { feature: "Search" },
                  })
                }
                aria-label="Search"
              >
                🔍
              </button>

              <button className="icon-button">🔔</button>

              <button
                className="profile-circle"
                onClick={() =>
                  navigate("/not-available", {
                    state: { feature: "Profile" },
                  })
                }
                aria-label="Profile"
              >
                P
              </button>
            </div>
          </header>

          <section className="report-hero">
            <div>
              <p className="report-kicker">YOUR FINANCIAL PICTURE</p>
              <h1>Financial Reports</h1>
              <p>
                Compare your earnings and spending, understand your financial
                direction, and download a detailed monthly report.
              </p>
            </div>
            <div className="report-summary-pills">
              <div>
                <span>12-Month Income</span>
                <strong>{formatCurrency(totals.income)}</strong>
              </div>
              <div>
                <span>12-Month Expense</span>
                <strong>{formatCurrency(totals.expense)}</strong>
              </div>
            </div>
          </section>

          {error && <div className="report-alert error">{error}</div>}

          <section className="report-card comparison-card">
            <div className="report-section-heading">
              <div>
                <h2>Income vs Expense</h2>
                <p>Compare the last 12 months of your financial activity.</p>
              </div>
              <div className="report-legend">
                <span>
                  <i className="legend-income"></i>Income
                </span>
                <span>
                  <i className="legend-expense"></i>Expense
                </span>
              </div>
            </div>

            {loading ? (
              <div className="report-loading">
                <div className="report-spinner"></div>
                <p>Preparing your 12-month report...</p>
              </div>
            ) : (
              <div
                className="dual-chart"
                role="img"
                aria-label="Income and expense comparison for the last twelve months"
              >
                <div className="chart-y-labels">
                  {[5, 4, 3, 2, 1, 0].map((step) => (
                    <span key={step}>
                      {formatCurrency((chartMax / 5) * step)}
                    </span>
                  ))}
                </div>
                <div className="dual-chart-area">
                  <div className="chart-lines">
                    {[0, 1, 2, 3, 4, 5].map((line) => (
                      <span key={line}></span>
                    ))}
                  </div>
                  <div className="dual-bars">
                    {reportData.map((item, index) => {
                      const incomeHeight = Math.max(
                        (item.totalIncome / chartMax) * 100,
                        item.totalIncome > 0 ? 2 : 0,
                      );
                      const expenseHeight = Math.max(
                        (item.totalExpense / chartMax) * 100,
                        item.totalExpense > 0 ? 2 : 0,
                      );
                      const key = `${item.year}-${item.month}`;
                      return (
                        <div
                          className="dual-bar-group"
                          key={key}
                          onMouseEnter={() => setHoveredBar(key)}
                          onMouseLeave={() => setHoveredBar(null)}
                        >
                          {hoveredBar === key && (
                            <div className="bar-tooltip">
                              <strong>
                                {MONTHS[item.month - 1]} {item.year}
                              </strong>
                              <span className="tooltip-income">
                                Income: {formatCurrency(item.totalIncome)}
                              </span>
                              <span className="tooltip-expense">
                                Expense: {formatCurrency(item.totalExpense)}
                              </span>
                            </div>
                          )}
                          <div className="bars-pair">
                            <div
                              className="report-bar income-bar"
                              style={{ height: `${incomeHeight}%` }}
                              title={`Income ${formatCurrency(item.totalIncome)}`}
                            ></div>
                            <div
                              className="report-bar expense-bar"
                              style={{ height: `${expenseHeight}%` }}
                              title={`Expense ${formatCurrency(item.totalExpense)}`}
                            ></div>
                          </div>
                          <span className="bar-month">
                            {shortMonth(item.month)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="report-card ai-card">
            <div className="ai-glow"></div>
            <div className="report-section-heading ai-heading">
              <div>
                <p className="ai-label">AI FINANCIAL ASSISTANT</p>
                <h2>AI Insights</h2>
                <p>
                  Personalized observations based on your selected month's real
                  financial data.
                </p>
              </div>
              <div className="ai-month-picker">
                <select
                  value={selectedMonth}
                  onChange={(e) =>
                    handleInsightMonthChange(
                      Number(e.target.value),
                      selectedYear,
                    )
                  }
                  aria-label="AI insight month"
                >
                  {MONTHS.map((month, index) => (
                    <option key={month} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) =>
                    handleInsightMonthChange(
                      selectedMonth,
                      Number(e.target.value),
                    )
                  }
                  aria-label="AI insight year"
                >
                  {[selectedYear - 1, selectedYear, selectedYear + 1].map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            {insightLoading ? (
              <div className="ai-loading">
                <div className="ai-pulse">✦</div>
                <span>Analyzing your financial activity...</span>
              </div>
            ) : insightError ? (
              <div className="ai-empty">
                <span>!</span>
                <p>{insightError}</p>
                <button onClick={() => loadInsights()}>Try Again</button>
              </div>
            ) : insights ? (
              <div className="ai-content">
                <div className="ai-summary">
                  <span className="ai-icon">✦</span>
                  <div>
                    <strong>Financial Summary</strong>
                    <p>{insights.summary || "Your AI summary is ready."}</p>
                  </div>
                </div>
                <div className="ai-grid">
                  <div className="ai-panel">
                    <h3>Key Insights</h3>
                    {insightItems.length ? (
                      insightItems.map((item, index) => (
                        <div className="ai-list-item" key={index}>
                          <span>{index + 1}</span>
                          <p>{item}</p>
                        </div>
                      ))
                    ) : (
                      <p className="muted">
                        No additional insights were returned.
                      </p>
                    )}
                  </div>
                  <div className="ai-panel recommendations-panel">
                    <h3>Recommendations</h3>
                    {recommendations.length ? (
                      recommendations.map((item, index) => (
                        <div className="ai-list-item" key={index}>
                          <span>✓</span>
                          <p>{item}</p>
                        </div>
                      ))
                    ) : (
                      <p className="muted">No recommendations were returned.</p>
                    )}
                  </div>
                </div>
                {insights.warning && (
                  <div className="ai-warning">
                    <span>⚠</span>
                    <p>{insights.warning}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="ai-empty">
                <span>✦</span>
                <p>Select a month to generate AI financial insights.</p>
              </div>
            )}
          </section>

          <section className="report-card monthly-card">
            <div className="monthly-download-content">
              <div className="download-icon">↓</div>
              <div>
                <p className="report-kicker">MONTHLY PDF REPORT</p>
                <h2>Download Your Financial Report</h2>
                <p>
                  Generate the backend-powered AI financial PDF for any month
                  and year. It includes income, expenses, savings, budget
                  position, and AI observations.
                </p>
              </div>
            </div>
            <div className="download-controls">
              <label>
                Month
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {MONTHS.map((month, index) => (
                    <option key={month} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Year
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {Array.from(
                    { length: 7 },
                    (_, i) => now.getFullYear() - 3 + i,
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="download-report-button"
                onClick={downloadPdf}
                disabled={pdfLoading}
              >
                <span>{pdfLoading ? "⌛" : "↓"}</span>
                {pdfLoading ? "Generating PDF..." : "Download PDF"}
              </button>
            </div>
            {selectedReport && (
              <div className="selected-month-preview">
                <span>
                  {MONTHS[selectedMonth - 1]} {selectedYear}
                </span>
                <strong>{formatCurrency(selectedReport.totalIncome)}</strong>
                <em>income</em>
                <strong>{formatCurrency(selectedReport.totalExpense)}</strong>
                <em>expense</em>
                <strong
                  className={
                    selectedReport.balance >= 0 ? "positive" : "negative"
                  }
                >
                  {formatCurrency(selectedReport.balance)}
                </strong>
                <em>balance</em>
              </div>
            )}
            {pdfMessage && <div className="pdf-message">{pdfMessage}</div>}
          </section>

          <footer className="report-footer">
            CashCompass — Directing your money, daily.
          </footer>
          {showLogoutModal && (
            <LogoutModal
              onCancel={() => setShowLogoutModal(false)}
              onConfirm={async () => {
                try {
                  setLogoutLoading(true);
                  await logout();
                } finally {
                  setLogoutLoading(false);
                }
              }}
              loading={logoutLoading}
            />
          )}
        </main>
      </div>
    );
}

export default Report;