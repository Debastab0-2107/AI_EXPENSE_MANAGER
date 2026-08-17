import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../services/api";
import "./Dashboard.css";
import { useAuth } from "../context/AuthContext";
import LogoutModal from "../components/LogoutModal";


function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
const [logoutLoading, setLogoutLoading] = useState(false);
  const [dashboard, setDashboard] = useState({
    income: 0,

    expense: 0,

    savings: 0,

    budget: 0,

    budgetUsed: 0,

    budgetRemaining: 0,

    budgetPercentage: 0,

    budgetExceeded: false,

    transactions: [],

    monthlyData: [],
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      setError("");

      /*
       * ==========================================
       * CURRENT DATE
       * ==========================================
       */

      const today = new Date();

      const currentMonth = today.getMonth() + 1;

      const currentYear = today.getFullYear();

      /*
       * ==========================================
       * 1. OVERALL FINANCIAL SUMMARY
       * ==========================================
       */

      const summaryResponse = await api.get("/api/reports/summary");

      const summary = summaryResponse?.data;

      /*
       * ==========================================
       * 2. CURRENT MONTH BUDGET
       * ==========================================
       */

      const budgetResponse = await api.get(
        `/api/reports/budget-vs-actual?month=${currentMonth}&year=${currentYear}`,
      );

      const budget = budgetResponse?.data;

      /*
       * ==========================================
       * 3. RECENT TRANSACTIONS
       * ==========================================
       */

      const transactionResponse = await api.get(
        "/api/transactions?page=0&size=5&sortBy=transactionDate&direction=desc",
      );

      const transactionPage = transactionResponse?.data;

      /*
       * ==========================================
       * 4. LAST SIX MONTHS
       *
       * Used for the Dashboard bar graph.
       * ==========================================
       */

      const monthlyRequests = [];

      for (let offset = 5; offset >= 0; offset--) {
        const date = new Date(currentYear, currentMonth - 1 - offset, 1);

        const month = date.getMonth() + 1;

        const year = date.getFullYear();

        monthlyRequests.push(
          api
            .get(`/api/reports/monthly?month=${month}&year=${year}`)
            .then((response) => ({
              month,
              year,

              totalIncome: Number(response?.data?.totalIncome || 0),

              totalExpense: Number(response?.data?.totalExpense || 0),

              balance: Number(response?.data?.balance || 0),
            })),
        );
      }

      const monthlyData = await Promise.all(monthlyRequests);

      /*
       * ==========================================
       * 5. CONVERT TRANSACTIONS
       * ==========================================
       */

      const transactions = transactionPage?.content || [];

      /*
       * ==========================================
       * 6. UPDATE DASHBOARD
       * ==========================================
       */

      setDashboard({
        income: Number(summary?.totalIncome || 0),

        expense: Number(summary?.totalExpense || 0),

        savings: Number(summary?.balance || 0),

        budget: Number(budget?.totalBudget || 0),

        budgetUsed: Number(budget?.totalSpent || 0),

        budgetRemaining: Number(budget?.remainingAmount || 0),

        budgetPercentage: Number(budget?.usagePercentage || 0),

        budgetExceeded: Boolean(budget?.exceeded),

        transactions,

        monthlyData,
      });
    } catch (error) {
      console.error("Dashboard loading error:", error);

      setError(error.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const income = dashboard.income;
  const expense = dashboard.expense;
  const savings = dashboard.savings;
  const budget = dashboard.budget;

  const savingsPercentage =
    income > 0 ? Math.round((savings / income) * 100) : 0;

  const expensePercentage =
    income > 0 ? Math.round((expense / income) * 100) : 0;

  return (
    <div className="dashboard">
      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img
            src="https://raw.githubusercontent.com/parambratamoitra/fsp/main/newlogoGreen.png"
            alt="CashCompass"
          />
        </div>

        <div className="sidebar-menu">
          <button className="sidebar-item active">
            <span>▦</span>
            <small>Dashboard</small>
          </button>

          <button className="sidebar-item" onClick={() => navigate("/income")}>
            <span>↗</span>
            <small>Income</small>
          </button>

          <button className="sidebar-item" onClick={() => navigate("/expense")}>
            <span>↘</span>
            <small>Expense</small>
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/transactions")}
          >
            <span>≡</span>
            <small>Transactions</small>
          </button>

          <button className="sidebar-item" onClick={() => navigate("/budget")}>
            <span>◫</span>
            <small>Budget</small>
          </button>

          <button className="sidebar-item" onClick={() => navigate("/reports")}>
            <span>▤</span>
            <small>Reports</small>
          </button>
        </div>

        <div className="sidebar-bottom">
          {/* SETTINGS */}
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

          {/* LOGOUT */}
          <button
            className="sidebar-item logout-item"
            onClick={() => setShowLogoutModal(true)}
          >
            <span>↪</span>
            <small>Logout</small>
          </button>
        </div>
      </aside>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <main className="dashboard-main">
        {/* ================================================= */}
        {/* TOP NAVBAR */}
        {/* ================================================= */}

        <header className="dashboard-header">
          <div className="header-brand">
            <img
              src="https://raw.githubusercontent.com/parambratamoitra/fsp/main/newlogoGreen.png"
              alt="CashCompass"
            />

            <div>
              <h2>CashCompass</h2>
              <p>Directing your money, daily.</p>
            </div>
          </div>

          <nav className="top-navigation">
            <button className="nav-active">Dashboard</button>

            <button onClick={() => navigate("/income")}>Income</button>

            <button onClick={() => navigate("/expense")}>Expense</button>

            <button onClick={() => navigate("/reports")}>Reports</button>

            <button onClick={() => navigate("/transactions")}>
              {" "}
              Transactions{" "}
            </button>

            <button onClick={() => navigate("/budget")}>Budget</button>
          </nav>

          <div className="header-actions">
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

        {/* ================================================= */}
        {/* WELCOME */}
        {/* ================================================= */}

        <section className="welcome-section">
          <div>
            <p className="welcome-small">YOUR FINANCIAL JOURNEY</p>

            <h1>
              Welcome To
              <span> CashCompass</span>
            </h1>

            <p className="welcome-description">
              Take control of your money, track your spending and grow your
              savings.
            </p>
          </div>

          <div className="date-control">
            <span>◷</span>

            <span>This Month</span>

            <span>▾</span>
          </div>
        </section>

        {/* ================================================= */}
        {/* SUMMARY CARDS */}
        {/* ================================================= */}

        <section className="summary-grid">
          {/* INCOME */}

          <div className="summary-card income-card">
            <div className="card-heading">
              <div className="card-icon">↗</div>

              <span>TOTAL INCOME</span>
            </div>

            <h2>₹{income.toLocaleString("en-IN")}</h2>

            <p>Money received during this period</p>

            <div className="card-line income-line"></div>
          </div>

          {/* EXPENSE */}

          <div className="summary-card expense-card">
            <div className="card-heading">
              <div className="card-icon">↘</div>

              <span>TOTAL EXPENSE</span>
            </div>

            <h2>₹{expense.toLocaleString("en-IN")}</h2>

            <p>Money spent during this period</p>

            <div className="card-line expense-line"></div>
          </div>

          {/* SAVINGS */}

          <div className="summary-card savings-card">
            <div className="card-heading">
              <div className="card-icon">₹</div>

              <span>TOTAL SAVINGS</span>
            </div>

            <h2>₹{savings.toLocaleString("en-IN")}</h2>

            <p>Money retained after expenses</p>

            <div className="card-line savings-line"></div>
          </div>
        </section>

        {/* ================================================= */}
        {/* CHART + FINANCIAL OVERVIEW */}
        {/* ================================================= */}

        <section className="middle-grid">
          {/* BAR CHART */}

          <div className="dashboard-card chart-card">
            <div className="section-header">
              <div>
                <h3>Spending Overview</h3>

                <p>Your financial activity throughout the period</p>
              </div>

              <button className="chart-filter">Monthly </button>
            </div>

            <div className="bar-chart">
              <div className="chart-y-axis">
                <span>₹{Math.round(savings * 1)}</span>
                <span>₹{Math.round(savings * 0.75)}</span>
                <span>₹{Math.round(savings * 0.5)}</span>
                <span>₹{Math.round(savings * 0.25)}</span>
                <span>₹{Math.round(savings * 0)}</span>
              </div>

              <div className="chart-area">
                <div className="chart-grid-line line-1"></div>
                <div className="chart-grid-line line-2"></div>
                <div className="chart-grid-line line-3"></div>
                <div className="chart-grid-line line-4"></div>
                <div className="chart-grid-line line-5"></div>

                <div className="bars">
                  {dashboard.monthlyData.map((item, index) => {
                    const maxValue = Math.max(
                      ...dashboard.monthlyData.map((month) =>
                        Math.max(month.totalIncome, month.totalExpense),
                      ),
                      1,
                    );

                    const barValue = Math.max(
                      item.totalIncome,
                      item.totalExpense,
                    );

                    const height = Math.max((barValue / maxValue) * 100, 4);

                    const date = new Date(item.year, item.month - 1, 1);

                    const label = date
                      .toLocaleString("en-US", {
                        month: "short",
                      })
                      .toUpperCase();

                    return (
                      <div
                        className="bar-container"
                        key={`${item.year}-${item.month}`}
                      >
                        <div
                          className={`bar ${
                            index === dashboard.monthlyData.length - 1
                              ? "active-bar"
                              : ""
                          }`}
                          style={{
                            height: `${height}%`,
                          }}
                          title={`Income: ₹${item.totalIncome.toLocaleString("en-IN")}
                             | Expense: ₹${item.totalExpense.toLocaleString("en-IN")}`}
                        ></div>

                        <span>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* FINANCIAL OVERVIEW */}

          <div className="dashboard-card overview-card">
            <div className="section-header">
              <div>
                <h3>Financial Overview</h3>

                <p>Your current financial position</p>
              </div>

              <div className="overview-icon">↗</div>
            </div>

            <div className="overview-total">
              <span>Current Savings</span>

              <strong>₹{savings.toLocaleString("en-IN")}</strong>
            </div>

            <div className="overview-list">
              <div className="overview-row">
                <div className="overview-label">
                  <span className="dot income-dot"></span>

                  <span>Income</span>
                </div>

                <strong>₹{income.toLocaleString("en-IN")}</strong>
              </div>

              <div className="overview-row">
                <div className="overview-label">
                  <span className="dot expense-dot"></span>

                  <span>Expenses</span>
                </div>

                <strong>₹{expense.toLocaleString("en-IN")}</strong>
              </div>

              <div className="overview-row">
                <div className="overview-label">
                  <span className="dot savings-dot"></span>

                  <span>Savings</span>
                </div>

                <strong>₹{savings.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            <div className="savings-progress">
              <div className="progress-title">
                <span>Savings Rate</span>

                <strong>{savingsPercentage}%</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(savingsPercentage, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* TRANSACTIONS + BUDGET */}
        {/* ================================================= */}

        <section className="bottom-grid">
          {/* RECENT TRANSACTIONS */}

          <div className="dashboard-card transactions-card">
            <div className="section-header">
              <div>
                <h3>Recent Transactions</h3>

                <p>Your latest financial activity</p>
              </div>

              <button className="view-button">View All →</button>
            </div>

            <div className="transaction-list">
              {dashboard.transactions.length === 0 ? (
                <div className="empty-transactions">
                  <div className="empty-icon">₹</div>

                  <h4>No transactions yet</h4>

                  <p>Your recent income and expenses will appear here.</p>
                </div>
              ) : (
                dashboard.transactions.map((transaction, index) => (
                  <div className="transaction-row" key={index}>
                    <div className="transaction-icon">
                      {transaction.type === "INCOME" ? "↗" : "↘"}
                    </div>

                    <div className="transaction-info">
                      <strong>{transaction.title}</strong>

                      <span>{transaction.transactionDate}</span>
                    </div>

                    <strong
                      className={
                        transaction.type === "INCOME"
                          ? "amount-income"
                          : "amount-expense"
                      }
                    >
                      {transaction.type === "INCOME" ? "+" : "-"}₹
                      {Number(transaction.amount).toLocaleString("en-IN")}
                    </strong>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* BUDGET */}

          <div className="dashboard-card budget-card">
            <div className="section-header">
              <div>
                <h3>Budget Status</h3>

                <p>Monitor your spending limit</p>
              </div>

              <div className="budget-icon">₹</div>
            </div>

            <div className="budget-amount">
              <span>Total Budget</span>

              <strong>₹{budget.toLocaleString("en-IN")}</strong>
            </div>

            <div className="budget-used">
              <div>
                <span>Used</span>

                <strong>₹{dashboard.budgetUsed.toLocaleString("en-IN")}</strong>
              </div>

              <div>
                <span>Remaining</span>

                <strong>
                  ₹{dashboard.budgetRemaining.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="budget-progress">
              <div
                className="budget-progress-fill"
                style={{
                  width: `${Math.min(
                    Math.max(dashboard.budgetPercentage, 0),
                    100,
                  )}%`,
                }}
              ></div>
            </div>

            <div className="budget-percentage">
              <span>Budget utilization</span>

              <strong>{Math.round(dashboard.budgetPercentage)}%</strong>
            </div>

            <button className="budget-button">Manage Budget →</button>
          </div>
        </section>

        {/* ================================================= */}
        {/* FINANCIAL HEALTH */}
        {/* ================================================= */}

        <section className="financial-health">
          <div className="health-card">
            <div className="health-icon">✓</div>

            <div>
              <span>SAVINGS PERFORMANCE</span>

              <strong>{savingsPercentage}%</strong>

              <p>of your income is currently being retained.</p>
            </div>
          </div>

          <div className="health-card">
            <div className="health-icon">%</div>

            <div>
              <span>EXPENSE RATE</span>

              <strong>{expensePercentage}%</strong>

              <p>of your income has been spent.</p>
            </div>
          </div>

          <div className="health-card">
            <div className="health-icon">₹</div>

            <div>
              <span>FINANCIAL DIRECTION</span>

              <strong>{savings >= 0 ? "Positive" : "Needs Attention"}</strong>

              <p>Keep tracking your money consistently.</p>
            </div>
          </div>
        </section>
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

export default Dashboard;
