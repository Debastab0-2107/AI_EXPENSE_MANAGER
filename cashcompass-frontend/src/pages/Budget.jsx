import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Budget.css";
import LogoutModal from "../components/LogoutModal";

const BUDGET_CATEGORIES = [
  "FOOD",
  "TRANSPORT",
  "RENT",
  "UTILITIES",
  "SHOPPING",
  "ENTERTAINMENT",
  "HEALTHCARE",
  "EDUCATION",
  "TRAVEL",
  "GROCERIES",
  "SUBSCRIPTIONS",
  "EMI",
  "INSURANCE",
  "INVESTMENT",
  "OTHER",
];



const CATEGORY_META = {
  FOOD: { label: "Food", icon: "🍽", className: "food" },
  TRANSPORT: { label: "Transport", icon: "🚗", className: "transport" },
  SHOPPING: { label: "Shopping", icon: "🛍", className: "shopping" },
  BILLS: { label: "Bills", icon: "⚡", className: "utilities" },
  RENT: { label: "Rent", icon: "⌂", className: "rent" },
  ENTERTAINMENT: { label: "Entertainment", icon: "♪", className: "entertainment" },
  HEALTH: { label: "Health", icon: "♥", className: "healthcare" },
  EDUCATION: { label: "Education", icon: "▤", className: "education" },
  TRAVEL: { label: "Travel", icon: "✈", className: "travel" },
  OTHER: { label: "Other", icon: "•", className: "other" },
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatCompactCurrency(value) {
  const amount = Number(value || 0);
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${Math.round(amount)}`;
}

function getMonthLabel(year, month) {
  return new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "short",
  });
}

function Budget() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const today = new Date();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [budgetData, setBudgetData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAllBudget, setShowAllBudget] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeBudget, setActiveBudget] = useState(null);

  const [form, setForm] = useState({
    amount: "",
    category: "FOOD",
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  });

  const loadBudgets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/api/budgets/month?month=${selectedMonth}&year=${selectedYear}`,
      );
      const budgets = response?.data || [];

      const summaries = await Promise.all(
        budgets.map(async (budget) => {
          try {
            const summaryResponse = await api.get(`/api/budgets/${budget.id}/summary`);
            return summaryResponse?.data || null;
          } catch (summaryError) {
            console.error("Budget summary error:", summaryError);
            return null;
          }
        }),
      );

      setBudgetData(budgets);
      setSummaryData(summaries.filter(Boolean));
    } catch (loadError) {
      console.error("Budget loading error:", loadError);
      setError(loadError.message || "Unable to load your budget data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, [selectedMonth, selectedYear]);

  const totalBudget = useMemo(
    () => summaryData.reduce((sum, item) => sum + Number(item.budgetAmount || 0), 0),
    [summaryData],
  );
  const totalSpent = useMemo(
    () => summaryData.reduce((sum, item) => sum + Number(item.spentAmount || 0), 0),
    [summaryData],
  );
  const remaining = totalBudget - totalSpent;
  const usage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const visibleBudgets = showAllBudget ? summaryData : summaryData.slice(0, 6);

  const openAddForm = () => {
    setEditingBudget(null);
    setForm({ amount: "", category: "FOOD", month: selectedMonth, year: selectedYear });
    setError("");
    setSuccess("");
    setShowAddBudget(true);
  };

  const openEditForm = (budget) => {
    setEditingBudget(budget);
    setForm({
      amount: budget.amount || "",
      category: budget.category || "FOOD",
      month: budget.month,
      year: budget.year,
    });
    setError("");
    setSuccess("");
    setShowAddBudget(true);
  };

  const closeBudgetForm = () => {
    if (saving) return;
    setShowAddBudget(false);
    setEditingBudget(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Please enter a budget amount greater than zero.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const payload = {
        amount: Number(form.amount),
        category: form.category,
        month: Number(form.month),
        year: Number(form.year),
      };

      if (editingBudget) {
        await api.put(`/api/budgets/${editingBudget.id}`, payload);
        setSuccess("Budget updated successfully.");
      } else {
        await api.post("/api/budgets", payload);
        setSuccess("Budget added successfully.");
      }

      setShowAddBudget(false);
      setEditingBudget(null);
      if (payload.month !== selectedMonth || payload.year !== selectedYear) {
        setSelectedMonth(payload.month);
        setSelectedYear(payload.year);
      } else {
        await loadBudgets();
      }
    } catch (saveError) {
      console.error("Budget save error:", saveError);
      setError(saveError.message || "Unable to save budget.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setSaving(true);
      setError("");
      await api.delete(`/api/budgets/${deleteTarget.budgetId}`);
      setDeleteTarget(null);
      setSuccess("Budget deleted successfully.");
      await loadBudgets();
    } catch (deleteError) {
      console.error("Budget delete error:", deleteError);
      setError(deleteError.message || "Unable to delete budget.");
    } finally {
      setSaving(false);
    }
  };

  const moveMonth = (direction) => {
    const date = new Date(selectedYear, selectedMonth - 1 + direction, 1);
    setSelectedMonth(date.getMonth() + 1);
    setSelectedYear(date.getFullYear());
  };

  return (
    <div className="income-page">
      <aside className={`income-sidebar ${mobileSidebarOpen ? "open" : ""}`}>
        <div className="income-sidebar-logo">
          <img
            src="https://raw.githubusercontent.com/parambratamoitra/fsp/main/newlogoGreen.png"
            alt="CashCompass"
          />
        </div>
        <div className="income-sidebar-menu">
          <button
            className="income-sidebar-item"
            onClick={() => navigate("/dashboard")}
          >
            <span>▦</span>
            <small>Dashboard</small>
          </button>
          <button
            className="income-sidebar-item"
            onClick={() => navigate("/income")}
          >
            <span>↗</span>
            <small>Income</small>
          </button>
          <button
            className="income-sidebar-item"
            onClick={() => navigate("/expense")}
          >
            <span>↘</span>
            <small>Expense</small>
          </button>
          <button
            className="income-sidebar-item"
            onClick={() => navigate("/transactions")}
          >
            <span>≡</span>
            <small>Transactions</small>
          </button>
          <button
            className="income-sidebar-item active"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <span>◫</span>
            <small>Budget</small>
          </button>
          <button
            className="income-sidebar-item"
            onClick={() => navigate("/reports")}
          >
            <span>▤</span>
            <small>Reports</small>
          </button>
        </div>
        <div className="income-sidebar-bottom">
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

      {mobileSidebarOpen && (
        <button
          className="income-sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="income-main">
        <header className="income-header">
          <button
            className="income-mobile-menu"
            onClick={() => setMobileSidebarOpen((value) => !value)}
          >
            ☰
          </button>
          <div className="income-header-brand">
            <img
              src="https://raw.githubusercontent.com/parambratamoitra/fsp/main/newlogoGreen.png"
              alt="CashCompass"
            />
            <div>
              <h2>CashCompass</h2>
              <p>Directing your money, daily.</p>
            </div>
          </div>
          <nav
            className="income-top-navigation"
            aria-label="Primary navigation"
          >
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/income")}>Income</button>
            <button onClick={() => navigate("/expense")}>Expense</button>
            <button
              className="sidebar-item"
              onClick={() => navigate("/reports")}
            >
              Reports
            </button>
            <button onClick={() => navigate("/transactions")}>
              Transactions
            </button>
            <button onClick={() => setMobileSidebarOpen(false)}>Budget</button>
          </nav>
          <div className="income-header-actions">
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

        <section className="income-content">
          <div className="income-page-heading">
            <div>
              <p className="income-eyebrow">PLAN BEFORE YOU SPEND</p>
              <h1>Budget Overview</h1>
              <p>
                Set category limits, watch your spending, and keep every month
                under control.
              </p>
            </div>
            <div className="budget-heading-actions">
              <div className="budget-month-picker">
                <button
                  onClick={() => moveMonth(-1)}
                  aria-label="Previous month"
                >
                  ‹
                </button>
                <div>
                  <strong>{MONTHS[selectedMonth - 1]}</strong>
                  <small>{selectedYear}</small>
                </div>
                <button onClick={() => moveMonth(1)} aria-label="Next month">
                  ›
                </button>
              </div>
              <button className="add-income-button" onClick={openAddForm}>
                <span>+</span> Add New Budget
              </button>
            </div>
          </div>

          {success && <div className="income-toast success">✓ {success}</div>}
          {error && <div className="income-toast error">! {error}</div>}

          {loading ? (
            <div className="income-loading-card">
              <div className="income-spinner" />
              <h3>Loading your budget...</h3>
              <p>Checking your limits and spending for this month.</p>
            </div>
          ) : (
            <>
              <section className="budget-summary-grid">
                <div className="income-summary-card animated-card budget-summary budget-blue">
                  <div className="summary-card-icon">◫</div>
                  <div className="summary-card-copy">
                    <span>Total Budget</span>
                    <strong>{formatCurrency(totalBudget)}</strong>
                    <p>Planned spending for {MONTHS[selectedMonth - 1]}</p>
                  </div>
                </div>
                <div className="income-summary-card animated-card budget-summary budget-orange">
                  <div className="summary-card-icon">↘</div>
                  <div className="summary-card-copy">
                    <span>Total Spent</span>
                    <strong>{formatCurrency(totalSpent)}</strong>
                    <p>Recorded expense against your limits</p>
                  </div>
                </div>
                <div
                  className={`income-summary-card animated-card budget-summary ${remaining >= 0 ? "budget-green" : "budget-red"}`}
                >
                  <div className="summary-card-icon">
                    {remaining >= 0 ? "✓" : "!"}
                  </div>
                  <div className="summary-card-copy">
                    <span>{remaining >= 0 ? "Remaining" : "Over Budget"}</span>
                    <strong>{formatCurrency(Math.abs(remaining))}</strong>
                    <p>
                      {remaining >= 0
                        ? "Room left in your monthly plan"
                        : "Amount above your planned limits"}
                    </p>
                  </div>
                </div>
                <div className="income-summary-card animated-card budget-summary budget-purple">
                  <div className="summary-card-icon">%</div>
                  <div className="summary-card-copy">
                    <span>Overall Usage</span>
                    <strong>{Math.round(usage)}%</strong>
                    <p>
                      {usage <= 80
                        ? "You're comfortably within your plan"
                        : usage <= 100
                          ? "Keep an eye on your spending"
                          : "Your budget needs attention"}
                    </p>
                  </div>
                </div>
              </section>

              <section className="budget-progress-card income-card animated-card">
                <div className="income-card-header">
                  <div>
                    <span className="income-section-label">MONTHLY HEALTH</span>
                    <h2>Budget vs Actual</h2>
                    <p>See how much of your monthly plan has been used.</p>
                  </div>
                  <span
                    className={`budget-status ${usage > 100 ? "danger" : usage > 80 ? "warning" : "safe"}`}
                  >
                    {usage > 100
                      ? "OVER LIMIT"
                      : usage > 80
                        ? "WATCH IT"
                        : "ON TRACK"}
                  </span>
                </div>
                <div className="budget-big-progress">
                  <div className="budget-progress-track">
                    <div
                      className={`budget-progress-fill ${usage > 100 ? "danger" : usage > 80 ? "warning" : ""}`}
                      style={{ width: `${Math.min(usage, 100)}%` }}
                    />
                  </div>
                  <div className="budget-progress-labels">
                    <span>{formatCurrency(totalSpent)} spent</span>
                    <strong>{formatCurrency(totalBudget)} budget</strong>
                  </div>
                </div>
              </section>

              <section className="income-card animated-card budget-categories-card">
                <div className="income-card-header">
                  <div>
                    <span className="income-section-label">
                      CATEGORY LIMITS
                    </span>
                    <h2>Your Monthly Budgets</h2>
                    <p>
                      Each category shows the amount planned, spent, and
                      remaining.
                    </p>
                  </div>
                  <span className="chart-badge">
                    {budgetData.length}/{BUDGET_CATEGORIES.length}
                  </span>
                </div>
                <div className="budget-category-grid">
                  {visibleBudgets.map((item) => {
                    const meta = CATEGORY_META[item.category] || {
                      label: item.category,
                      icon: "•",
                      className: "other",
                    };
                    const percent = Number(item.usagePercentage || 0);
                    const safePercent = Math.max(0, Math.min(percent, 100));
                    const over = Boolean(item.exceeded) || percent > 100;
                    return (
                      <article
                        className={`budget-category-card ${activeBudget === item.budgetId ? "active" : ""}`}
                        key={item.budgetId}
                        onMouseEnter={() => setActiveBudget(item.budgetId)}
                        onMouseLeave={() => setActiveBudget(null)}
                      >
                        <div className="budget-category-top">
                          <div className={`category-icon ${meta.className}`}>
                            {meta.icon}
                          </div>
                          <div>
                            <strong>{meta.label}</strong>
                            <small>
                              {formatCurrency(item.budgetAmount)} limit
                            </small>
                          </div>
                          <span
                            className={`budget-percent ${over ? "danger" : ""}`}
                          >
                            {Math.round(percent)}%
                          </span>
                        </div>
                        <div className="budget-mini-track">
                          <div
                            className={`budget-mini-fill ${over ? "danger" : percent > 80 ? "warning" : ""}`}
                            style={{ width: `${safePercent}%` }}
                          />
                        </div>
                        <div className="budget-category-numbers">
                          <span>
                            Spent <b>{formatCurrency(item.spentAmount)}</b>
                          </span>
                          <span>
                            {over ? "Over" : "Left"}{" "}
                            <b>
                              {formatCurrency(
                                Math.abs(Number(item.remainingAmount || 0)),
                              )}
                            </b>
                          </span>
                        </div>
                        <div className="budget-card-actions">
                          <button
                            onClick={() =>
                              openEditForm(
                                budgetData.find((b) => b.id === item.budgetId),
                              )
                            }
                          >
                            ✎ Edit
                          </button>
                          <button
                            className="delete-action"
                            onClick={() => setDeleteTarget(item)}
                          >
                            🗑
                          </button>
                        </div>
                      </article>
                    );
                  })}
                  {summaryData.length === 0 && (
                    <div className="budget-empty">
                      <div>◫</div>
                      <h3>No budgets for this month</h3>
                      <p>
                        Start by adding a category limit for{" "}
                        {MONTHS[selectedMonth - 1]}.
                      </p>
                      <button
                        className="add-income-button"
                        onClick={openAddForm}
                      >
                        + Create First Budget
                      </button>
                    </div>
                  )}
                </div>
                {summaryData.length > 6 && (
                  <button
                    className="view-all-income budget-view-all"
                    onClick={() => setShowAllBudget((value) => !value)}
                  >
                    {showAllBudget ? "Show Less ↑" : "View All Categories ↓"}
                  </button>
                )}
              </section>
            </>
          )}
        </section>
      </main>

      {showAddBudget && (
        <div
          className="income-modal-layer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="budget-form-title"
        >
          <div className="income-form-window budget-form-window">
            <div className="income-form-header">
              <div>
                <span className="income-section-label">CASHCOMPASS BUDGET</span>
                <h2 id="budget-form-title">
                  {editingBudget ? "Edit Budget" : "Add New Budget"}
                </h2>
                <p>
                  Choose a category and set the maximum amount you want to
                  spend.
                </p>
              </div>
              <button
                className="income-close-button"
                onClick={closeBudgetForm}
                aria-label="Close budget form"
              >
                ×
              </button>
            </div>
            <form className="income-form" onSubmit={handleSubmit}>
              <div className="income-form-grid">
                <label>
                  <span>Budget Amount</span>
                  <div className="amount-input-wrap">
                    <span>₹</span>
                    <input
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={form.amount}
                      onChange={handleFormChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </label>
                <label>
                  <span>Category</span>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                  >
                    {BUDGET_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {CATEGORY_META[category]?.label || category}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Month</span>

                  <select
                    name="month"
                    value={form.month}
                    onChange={handleFormChange}
                    required
                  >
                    {MONTHS.map((month, index) => {
                      const monthNumber = index + 1;

                      const currentYear = new Date().getFullYear();
                      const currentMonth = new Date().getMonth() + 1;

                      const selectedYear = Number(form.year);

                      const disabled =
                        selectedYear < currentYear ||
                        (selectedYear === currentYear &&
                          monthNumber < currentMonth);

                      return (
                        <option
                          key={month}
                          value={monthNumber}
                          disabled={disabled}
                        >
                          {month}
                        </option>
                      );
                    })}
                  </select>
                </label>

                <label>
                  <span>Year</span>

                  <input
                    name="year"
                    type="number"
                    min={new Date().getFullYear()}
                    value={form.year}
                    onChange={handleFormChange}
                    required
                  />
                </label>
              </div>
              <div className="income-form-actions">
                <button
                  type="button"
                  className="secondary-income-button"
                  onClick={closeBudgetForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-income-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingBudget
                      ? "Update Budget"
                      : "Save Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="income-modal-layer delete-layer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-budget-title"
        >
          <div className="delete-confirm-window">
            <span className="income-section-label">REMOVE BUDGET</span>
            <h2 id="delete-budget-title">Delete this budget?</h2>
            <p>
              The{" "}
              <strong>
                {CATEGORY_META[deleteTarget.category]?.label ||
                  deleteTarget.category}
              </strong>{" "}
              budget for {MONTHS[selectedMonth - 1]} will be permanently
              removed.
            </p>
            <div className="income-form-actions">
              <button
                className="secondary-income-button"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className="danger-income-button"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? "Deleting..." : "Delete Budget"}
              </button>
            </div>
          </div>
        </div>
      )}
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
    </div>
  );
}

export default Budget;
