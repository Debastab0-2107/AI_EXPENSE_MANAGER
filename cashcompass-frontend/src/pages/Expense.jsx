import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Expense.css";
import LogoutModal from "../components/LogoutModal";

const EXPENSE_CATEGORIES = [
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
  RENT: { label: "Rent", icon: "⌂", className: "rent" },
  UTILITIES: { label: "Utilities", icon: "⚡", className: "utilities" },
  SHOPPING: { label: "Shopping", icon: "🛍", className: "shopping" },
  ENTERTAINMENT: { label: "Entertainment", icon: "♪", className: "entertainment" },
  HEALTHCARE: { label: "Healthcare", icon: "♥", className: "healthcare" },
  EDUCATION: { label: "Education", icon: "▤", className: "education" },
  TRAVEL: { label: "Travel", icon: "✈", className: "travel" },
  GROCERIES: { label: "Groceries", icon: "🛒", className: "groceries" },
  SUBSCRIPTIONS: { label: "Subscriptions", icon: "↻", className: "subscriptions" },
  EMI: { label: "EMI", icon: "₹", className: "emi" },
  INSURANCE: { label: "Insurance", icon: "◆", className: "insurance" },
  INVESTMENT: { label: "Investment", icon: "↗", className: "investment" },
  OTHER: { label: "Other", icon: "•", className: "other" },
};

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

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getMonthLabel(year, month) {
  return new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "short",
  });
}

function Expense() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
const [logoutLoading, setLogoutLoading] = useState(false);

  const [expenseData, setExpenseData] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showCategoryDetails, setShowCategoryDetails] = useState(false);
  const [showAllExpense, setShowAllExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activePoint, setActivePoint] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  
  const today = new Date();
const localToday = 
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "FOOD",
    expenseDate: new Date().toISOString().slice(0, 10),
    description: "",
  });

  const loadExpense = async () => {
    try {
      setLoading(true);
      setError("");

      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      const [summaryResponse, allExpenseResponse, categoryResponse, ...monthlyResponses] =
        await Promise.all([
          api.get("/api/reports/summary"),
          api.get(
            "/api/expenses?page=0&size=1000&sortBy=expenseDate&direction=desc",
          ),
          api.get("/api/reports/expenses/categories"),
          ...Array.from({ length: 6 }, (_, index) => {
            const date = new Date(
              currentYear,
              currentMonth - 1 - (5 - index),
              1,
            );

            return api.get(
              `/api/reports/monthly?month=${date.getMonth() + 1}&year=${date.getFullYear()}`,
            );
          }),
        ]);

      const page = allExpenseResponse?.data;
      const expenses = page?.content || [];

      setExpenseData(expenses);
      setTotalExpense(Number(summaryResponse?.data?.totalExpense || 0));

      const categories = categoryResponse?.data || [];
      setCategoryData(categories);

      setMonthlyData(
        monthlyResponses.map((response, index) => {
          const date = new Date(
            currentYear,
            currentMonth - 1 - (5 - index),
            1,
          );

          return {
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            amount: Number(response?.data?.totalExpense || 0),
          };
        }),
      );
    } catch (loadError) {
      console.error("Expense loading error:", loadError);
      setError(
        loadError.message || "Unable to load your expense data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpense();
  }, []);

  const currentMonthAmount = monthlyData[monthlyData.length - 1]?.amount || 0;
  const previousMonthAmount = monthlyData[monthlyData.length - 2]?.amount || 0;

  const monthChange =
    previousMonthAmount > 0
      ? ((currentMonthAmount - previousMonthAmount) / previousMonthAmount) * 100
      : currentMonthAmount > 0
        ? 100
        : 0;

  const recentExpense = showAllExpense ? expenseData : expenseData.slice(0, 7);

  const categoryTotal = categoryData.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  const normalizedCategories = useMemo(
    () =>
      categoryData.map((item) => ({
        ...item,
        amount: Number(item.amount || 0),
        percentage:
          categoryTotal > 0
            ? (Number(item.amount || 0) / categoryTotal) * 100
            : 0,
      })),
    [categoryData, categoryTotal],
  );

  const openAddForm = () => {
    setEditingExpense(null);
    setForm({
      title: "",
      amount: "",
      category: "FOOD",
      expenseDate: new Date().toISOString().slice(0, 10),
      description: "",
    });
    setError("");
    setSuccess("");
    setShowAddExpense(true);
  };

  const openEditForm = (expense) => {
    setEditingExpense(expense);
    setForm({
      title: expense.title || "",
      amount: expense.amount || "",
      category: expense.category || "FOOD",
      expenseDate: expense.expenseDate || "",
      description: expense.description || "",
    });
    setError("");
    setSuccess("");
    setShowAddExpense(true);
  };

  const closeExpenseForm = () => {
    if (saving) return;
    setShowAddExpense(false);
    setEditingExpense(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.amount || !form.expenseDate) {
      setError("Please fill in Title, Amount and Expense Date.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category,
        expenseDate: form.expenseDate,
        description: form.description.trim(),
      };

      if (editingExpense) {
        await api.put(`/api/expenses/${editingExpense.id}`, payload);
        setSuccess("Expense updated successfully.");
      } else {
        await api.post("/api/expenses", payload);
        setSuccess("Expense added successfully.");
      }

      setShowAddExpense(false);
      setEditingExpense(null);
      await loadExpense();
    } catch (saveError) {
      console.error("Expense save error:", saveError);
      setError(saveError.message || "Unable to save expense.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setSaving(true);
      setError("");

      await api.delete(`/api/expenses/${deleteTarget.id}`);
      setDeleteTarget(null);
      setSuccess("Expense deleted successfully.");
      await loadExpense();
    } catch (deleteError) {
      console.error("Expense delete error:", deleteError);
      setError(deleteError.message || "Unable to delete expense.");
    } finally {
      setSaving(false);
    }
  };

  const chartPoints = useMemo(() => {
    const width = 720;
    const height = 250;
    const paddingX = 42;
    const paddingY = 28;
    const values = monthlyData.map((item) => item.amount);
    const maxValue = Math.max(...values, 1);
    const minValue = Math.min(...values, 0);
    const range = Math.max(maxValue - minValue, 1);

    return monthlyData.map((item, index) => {
      const x =
        monthlyData.length === 1
          ? width / 2
          : paddingX +
            (index * (width - paddingX * 2)) /
              (monthlyData.length - 1);

      const y =
        height -
        paddingY -
        ((item.amount - minValue) / range) * (height - paddingY * 2);

      return { ...item, x, y };
    });
  }, [monthlyData]);

  const linePath = chartPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const maxChartValue = Math.max(...monthlyData.map((item) => item.amount), 1);

  const donutGradient = useMemo(() => {
    if (!normalizedCategories.length || categoryTotal === 0) {
      return "conic-gradient(#e8efeb 0deg 360deg)";
    }

    let current = 0;
    const segments = normalizedCategories.map((item, index) => {
      const start = current;
      const end = current + (item.percentage / 100) * 360;
      current = end;
      const colors = ["#74C69D", "#F4D35E", "#92DCE5", "#1B7B57", "#A7D7C5"];
      return `${colors[index % colors.length]} ${start}deg ${end}deg`;
    });

    return `conic-gradient(${segments.join(", ")})`;
  }, [normalizedCategories, categoryTotal]);

  return (
    <div className="expense-page">
      <aside className={`expense-sidebar ${mobileSidebarOpen ? "open" : ""}`}>
        <div className="expense-sidebar-logo">
          <img
            src="https://raw.githubusercontent.com/parambratamoitra/fsp/main/newlogoGreen.png"
            alt="CashCompass"
          />
        </div>

        <div className="expense-sidebar-menu">
          <button
            className="expense-sidebar-item"
            onClick={() => navigate("/dashboard")}
            aria-label="Go to Dashboard"
          >
            <span>▦</span>
            <small>Dashboard</small>
          </button>

          <button
            className="income-sidebar-item"
            onClick={() => navigate("/income")}
            aria-label="Income"
          >
            <span>↗</span>
            <small>Income</small>
          </button>

          <button
            className="income-sidebar-item active"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Income"
          >
            <span>↘</span>
            <small>Expense</small>
          </button>

          <button
            className="income-sidebar-item"
            onClick={() => navigate("/transactions")}
            aria-label="Transactions"
          >
            <span>≡</span>
            <small>Transactions</small>
          </button>

          <button
            className="income-sidebar-item"
            onClick={() => navigate("/budget")}
            aria-label="Income"
          >
            <span>◫</span>
            <small>Budget</small>
          </button>

          <button
            className="expense-sidebar-item"
            onClick={() => navigate("/reports")}
            aria-label="Reports"
          >
            <span>▤</span>
            <small>Reports</small>
          </button>
        </div>

        <div className="expense-sidebar-bottom">
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
          className="expense-sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="expense-main">
        <header className="expense-header">
          <button
            className="expense-mobile-menu"
            onClick={() => setMobileSidebarOpen((value) => !value)}
            aria-label="Open navigation"
          >
            ☰
          </button>

          <div className="expense-header-brand">
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
            className="expense-top-navigation"
            aria-label="Primary navigation"
          >
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/income")}>Income</button>
            <button className="nav-active" aria-current="page">
              Expense
            </button>
            <button
              className="sidebar-item"
              onClick={() => navigate("/reports")}
            >
              Reports
            </button>
            <button onClick={() => navigate("/transactions")}>
              Transactions
            </button>
            <button onClick={() => navigate("/budget")}>Budget</button>
          </nav>

          <div className="expense-header-actions">
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

        <section className="expense-content">
          <div className="expense-page-heading">
            <div>
              <p className="expense-eyebrow">YOUR EARNINGS AT A GLANCE</p>
              <h1>Expense Overview</h1>
              <p>
                Track every source of expense and understand how your earnings
                are growing.
              </p>
            </div>

            <button className="add-expense-button" onClick={openAddForm}>
              <span>+</span>
              Add New Expense
            </button>
          </div>

          {success && <div className="expense-toast success">✓ {success}</div>}
          {error && <div className="expense-toast error">! {error}</div>}

          {loading ? (
            <div className="expense-loading-card">
              <div className="expense-spinner" />
              <h3>Loading your expense...</h3>
              <p>Fetching your latest earnings from CashCompass.</p>
            </div>
          ) : (
            <>
              <section className="expense-summary-card animated-card">
                <div className="summary-card-icon">↗</div>
                <div className="summary-card-copy">
                  <span>Total Expense</span>
                  <strong>{formatCurrency(totalExpense)}</strong>
                  <p>All recorded expense across your account</p>
                </div>
                <div
                  className={`summary-trend ${monthChange >= 0 ? "positive" : "negative"}`}
                >
                  <span>{monthChange >= 0 ? "↗" : "↘"}</span>
                  <div>
                    <strong>
                      {monthChange >= 0 ? "+" : ""}
                      {Math.round(monthChange)}%
                    </strong>
                    <small>vs Last Month</small>
                  </div>
                </div>
              </section>

              <section className="expense-analytics-grid">
                <div className="expense-card analytics-line-card animated-card">
                  <div className="expense-card-header">
                    <div>
                      <span className="expense-section-label">
                        EXPENSE TREND
                      </span>
                      <h2>Last 6 Months Expense</h2>
                      <p>Your monthly earnings movement</p>
                    </div>
                    <div className="chart-badge">6M</div>
                  </div>

                  <div
                    className="expense-line-chart"
                    role="img"
                    aria-label="Expense for the last six months"
                  >
                    <div className="chart-scale">
                      <span>{formatCompactCurrency(maxChartValue)}</span>
                      <span>{formatCompactCurrency(maxChartValue * 0.75)}</span>
                      <span>{formatCompactCurrency(maxChartValue * 0.5)}</span>
                      <span>{formatCompactCurrency(maxChartValue * 0.25)}</span>
                      <span>₹0</span>
                    </div>

                    <div className="chart-svg-wrap">
                      <svg viewBox="0 0 720 250" preserveAspectRatio="none">
                        {[28, 76, 124, 172, 220].map((y) => (
                          <line
                            key={y}
                            x1="42"
                            y1={y}
                            x2="678"
                            y2={y}
                            className="chart-grid"
                          />
                        ))}

                        {chartPoints.length > 1 && (
                          <path d={linePath} className="expense-line-path" />
                        )}

                        {chartPoints.map((point, index) => (
                          <g key={`${point.year}-${point.month}`}>
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r={activePoint === index ? 8 : 5}
                              className="expense-chart-point"
                              onMouseEnter={() => setActivePoint(index)}
                              onMouseLeave={() => setActivePoint(null)}
                              aria-label={`${getMonthLabel(point.year, point.month)} expense ${formatCurrency(point.amount)}`}
                            />
                            {activePoint === index && (
                              <g className="chart-tooltip">
                                <rect
                                  x={Math.max(5, point.x - 65)}
                                  y={Math.max(5, point.y - 58)}
                                  width="130"
                                  height="43"
                                  rx="10"
                                />
                                <text
                                  x={point.x}
                                  y={Math.max(23, point.y - 36)}
                                  textAnchor="middle"
                                >
                                  {getMonthLabel(point.year, point.month)}
                                </text>
                                <text
                                  x={point.x}
                                  y={Math.max(40, point.y - 19)}
                                  textAnchor="middle"
                                  className="tooltip-value"
                                >
                                  {formatCurrency(point.amount)}
                                </text>
                              </g>
                            )}
                          </g>
                        ))}
                      </svg>

                      <div className="chart-months">
                        {monthlyData.map((item) => (
                          <span key={`${item.year}-${item.month}`}>
                            {getMonthLabel(item.year, item.month)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="expense-card analytics-donut-card animated-card">
                  <div className="expense-card-header">
                    <div>
                      <span className="expense-section-label">BREAKDOWN</span>
                      <h2>Expense by Category</h2>
                      <p>Where your earnings come from</p>
                    </div>
                    <button
                      className="expand-chart-button"
                      onClick={() => setShowCategoryDetails(true)}
                      aria-label="Expand expense by category chart"
                    >
                      ⤢
                    </button>
                  </div>

                  <button
                    className="donut-chart-button"
                    onClick={() => setShowCategoryDetails(true)}
                    aria-label="Open detailed expense category chart"
                  >
                    <div
                      className="donut-chart"
                      style={{ background: donutGradient }}
                    >
                      <div className="donut-hole">
                        <strong>{formatCompactCurrency(categoryTotal)}</strong>
                        <span>Total</span>
                      </div>
                    </div>
                  </button>

                  <div className="category-legend">
                    {normalizedCategories.slice(0, 5).map((item, index) => {
                      const meta = CATEGORY_META[item.category] || {
                        label: item.category,
                        icon: "•",
                        className: "other",
                      };

                      return (
                        <button
                          className={`category-row ${activeCategory === item.category ? "active" : ""}`}
                          key={item.category}
                          onMouseEnter={() => setActiveCategory(item.category)}
                          onMouseLeave={() => setActiveCategory(null)}
                          onClick={() => setShowCategoryDetails(true)}
                          title={`${meta.label}: ${formatCurrency(item.amount)}`}
                        >
                          <span className={`category-icon ${meta.className}`}>
                            {meta.icon}
                          </span>
                          <span className="category-name">{meta.label}</span>
                          <span className="category-percent">
                            {Math.round(item.percentage)}%
                          </span>
                          <strong>{formatCurrency(item.amount)}</strong>
                        </button>
                      );
                    })}

                    {normalizedCategories.length === 0 && (
                      <div className="empty-category">
                        <span>◌</span>
                        <p>No expense categories yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="expense-card transactions-expense-card animated-card">
                <div className="expense-card-header transactions-header">
                  <div>
                    <span className="expense-section-label">
                      RECENT ACTIVITY
                    </span>
                    <h2>Recent Expense Transactions</h2>
                    <p>Your latest recorded earnings</p>
                  </div>
                  <button
                    className="view-all-expense"
                    onClick={() => setShowAllExpense((value) => !value)}
                  >
                    {showAllExpense ? "Show Recent ↑" : "View All ↓"}
                  </button>
                </div>

                <div className="expense-table-wrap">
                  <table className="expense-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Source / Description</th>
                        <th>Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentExpense.map((item) => {
                        const meta = CATEGORY_META[item.category] || {
                          label: item.category,
                          icon: "•",
                          className: "other",
                        };

                        return (
                          <tr key={item.id}>
                            <td className="expense-date-cell">
                              {formatDate(item.expenseDate)}
                            </td>
                            <td>
                              <span className="table-category">
                                <span
                                  className={`category-icon ${meta.className}`}
                                >
                                  {meta.icon}
                                </span>
                                {meta.label}
                              </span>
                            </td>
                            <td>
                              <div className="expense-source">
                                <strong>{item.title}</strong>
                                <span>
                                  {item.description ||
                                    "No description provided"}
                                </span>
                              </div>
                            </td>
                            <td className="expense-amount-cell">
                              +{formatCurrency(item.amount)}
                            </td>
                            <td>
                              <div className="expense-actions">
                                <button
                                  onClick={() => openEditForm(item)}
                                  aria-label={`Edit ${item.title}`}
                                  title="Edit expense"
                                >
                                  ✎
                                </button>
                                <button
                                  className="delete-action"
                                  onClick={() => setDeleteTarget(item)}
                                  aria-label={`Delete ${item.title}`}
                                  title="Delete expense"
                                >
                                  🗑
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {recentExpense.length === 0 && (
                        <tr>
                          <td colSpan="5">
                            <div className="empty-expense-table">
                              <div>₹</div>
                              <h3>No expense transactions yet</h3>
                              <p>
                                Click “Add New Expense” to record your first
                                earning.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </section>
      </main>

      {showAddExpense && (
        <div
          className="expense-modal-layer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="expense-form-title"
        >
          <div className="expense-form-window">
            <div className="expense-form-header">
              <div>
                <span className="expense-section-label">
                  CASHCOMPASS EXPENSE
                </span>
                <h2 id="expense-form-title">
                  {editingExpense ? "Edit Expense" : "Add New Expense"}
                </h2>
                <p>Keep every earning accounted for.</p>
              </div>
              <button
                className="expense-close-button"
                onClick={closeExpenseForm}
                aria-label="Close expense form"
              >
                ×
              </button>
            </div>

            <form className="expense-form" onSubmit={handleSubmit}>
              <div className="expense-form-grid">
                <label>
                  <span>Title</span>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="e.g. Monthly Salary"
                    maxLength="255"
                    required
                  />
                </label>

                <label>
                  <span>Amount</span>
                  <div className="amount-input-wrap">
                    <b>₹</b>
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
                    required
                  >
                    {EXPENSE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Expense Date</span>
                  <input
                    name="expenseDate"
                    type="date"
                    value={form.expenseDate}
                    onChange={handleFormChange}
                    required
                    max={localToday}
                  />
                </label>

                <label className="full-width-field">
                  <span>Description</span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    placeholder="Add a short note about this expense..."
                    maxLength="500"
                    rows="4"
                  />
                </label>
              </div>

              <div className="expense-form-actions">
                <button
                  type="button"
                  className="secondary-expense-button"
                  onClick={closeExpenseForm}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-expense-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingExpense
                      ? "Update Expense"
                      : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCategoryDetails && (
        <div
          className="expense-modal-layer category-modal-layer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="category-details-title"
        >
          <div className="category-details-window">
            <div className="expense-form-header">
              <div>
                <span className="expense-section-label">EXPENSE ANALYTICS</span>
                <h2 id="category-details-title">Expense by Category</h2>
                <p>Explore how every category contributes to your earnings.</p>
              </div>
              <button
                className="expense-close-button"
                onClick={() => setShowCategoryDetails(false)}
                aria-label="Close category details"
              >
                ×
              </button>
            </div>

            <div className="category-details-body">
              <div className="category-large-donut-wrap">
                <div
                  className="donut-chart large"
                  style={{ background: donutGradient }}
                  aria-label="Expense category distribution"
                >
                  <div className="donut-hole">
                    <strong>{formatCurrency(categoryTotal)}</strong>
                    <span>Total Expense</span>
                  </div>
                </div>
              </div>

              <div className="category-detail-list">
                {normalizedCategories.map((item) => {
                  const meta = CATEGORY_META[item.category] || {
                    label: item.category,
                    icon: "•",
                    className: "other",
                  };

                  return (
                    <div className="category-detail-row" key={item.category}>
                      <span className={`category-icon ${meta.className}`}>
                        {meta.icon}
                      </span>
                      <div>
                        <strong>{meta.label}</strong>
                        <small>{Math.round(item.percentage)}% of expense</small>
                      </div>
                      <b>{formatCurrency(item.amount)}</b>
                    </div>
                  );
                })}

                {normalizedCategories.length === 0 && (
                  <div className="empty-category large-empty">
                    <span>◌</span>
                    <p>Add expense to see the category breakdown.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="expense-modal-layer delete-layer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
        >
          <div className="delete-confirm-window">
            <div className="delete-icon">!</div>
            <span className="expense-section-label">REMOVE EXPENSE</span>
            <h2 id="delete-title">Delete this expense?</h2>
            <p>
              “{deleteTarget.title}” will be permanently removed from your
              expense records.
            </p>
            <div className="expense-form-actions">
              <button
                className="secondary-expense-button"
                onClick={() => setDeleteTarget(null)}
                disabled={saving}
              >
                Keep It
              </button>
              <button
                className="danger-expense-button"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? "Deleting..." : "Delete Expense"}
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

export default Expense;
