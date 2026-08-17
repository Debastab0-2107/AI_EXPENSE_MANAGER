import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Income.css";
import LogoutModal from "../components/LogoutModal";

const INCOME_CATEGORIES = [
  "BONUS",
  "BUSINESS",
  "FREELANCING",
  "GIFT",
  "INTEREST",
  "INVESTMENT",
  "OTHER",
  "RENTAL",
  "SALARY",
];

const CATEGORY_META = {
  SALARY: { label: "Salary", icon: "💼", className: "salary" },
  FREELANCING: { label: "Freelance", icon: "👤", className: "freelance" },
  INVESTMENT: { label: "Investments", icon: "↗", className: "investment" },
  BUSINESS: { label: "Business", icon: "▦", className: "business" },
  BONUS: { label: "Bonus", icon: "✦", className: "bonus" },
  RENTAL: { label: "Rental", icon: "⌂", className: "rental" },
  INTEREST: { label: "Interest", icon: "%", className: "interest" },
  GIFT: { label: "Gift", icon: "🎁", className: "gift" },
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

function Income() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
const [logoutLoading, setLogoutLoading] = useState(false);

  const [incomeData, setIncomeData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showCategoryDetails, setShowCategoryDetails] = useState(false);
  const [showAllIncome, setShowAllIncome] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activePoint, setActivePoint] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  
  const today = new Date();
  const localToday = 
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "SALARY",
    incomeDate: new Date().toISOString().slice(0, 10),
    description: "",
  });

  const loadIncome = async () => {
    try {
      setLoading(true);
      setError("");

      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      const [summaryResponse, allIncomeResponse, categoryResponse, ...monthlyResponses] =
        await Promise.all([
          api.get("/api/reports/summary"),
          api.get(
            "/api/income?page=0&size=1000&sortBy=incomeDate&direction=desc",
          ),
          api.get("/api/reports/income/categories"),
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

      const page = allIncomeResponse?.data;
      const incomes = page?.content || [];

      setIncomeData(incomes);
      setTotalIncome(Number(summaryResponse?.data?.totalIncome || 0));

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
            amount: Number(response?.data?.totalIncome || 0),
          };
        }),
      );
    } catch (loadError) {
      console.error("Income loading error:", loadError);
      setError(
        loadError.message || "Unable to load your income data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncome();
  }, []);

  const currentMonthAmount = monthlyData[monthlyData.length - 1]?.amount || 0;
  const previousMonthAmount = monthlyData[monthlyData.length - 2]?.amount || 0;

  const monthChange =
    previousMonthAmount > 0
      ? ((currentMonthAmount - previousMonthAmount) / previousMonthAmount) * 100
      : currentMonthAmount > 0
        ? 100
        : 0;

  const recentIncome = showAllIncome ? incomeData : incomeData.slice(0, 7);

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
    setEditingIncome(null);
    setForm({
      title: "",
      amount: "",
      category: "SALARY",
      incomeDate: new Date().toISOString().slice(0, 10),
      description: "",
    });
    setError("");
    setSuccess("");
    setShowAddIncome(true);
  };

  const openEditForm = (income) => {
    setEditingIncome(income);
    setForm({
      title: income.title || "",
      amount: income.amount || "",
      category: income.category || "SALARY",
      incomeDate: income.incomeDate || "",
      description: income.description || "",
    });
    setError("");
    setSuccess("");
    setShowAddIncome(true);
  };

  const closeIncomeForm = () => {
    if (saving) return;
    setShowAddIncome(false);
    setEditingIncome(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.amount || !form.incomeDate) {
      setError("Please fill in Title, Amount and Income Date.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category,
        incomeDate: form.incomeDate,
        description: form.description.trim(),
      };

      if (editingIncome) {
        await api.put(`/api/income/${editingIncome.id}`, payload);
        setSuccess("Income updated successfully.");
      } else {
        await api.post("/api/income", payload);
        setSuccess("Income added successfully.");
      }

      setShowAddIncome(false);
      setEditingIncome(null);
      await loadIncome();
    } catch (saveError) {
      console.error("Income save error:", saveError);
      setError(saveError.message || "Unable to save income.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setSaving(true);
      setError("");

      await api.delete(`/api/income/${deleteTarget.id}`);
      setDeleteTarget(null);
      setSuccess("Income deleted successfully.");
      await loadIncome();
    } catch (deleteError) {
      console.error("Income delete error:", deleteError);
      setError(deleteError.message || "Unable to delete income.");
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
            aria-label="Go to Dashboard"
          >
            <span>▦</span>
            <small>Dashboard</small>
          </button>

          <button
            className="income-sidebar-item active"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Income"
          >
            <span>↗</span>
            <small>Income</small>
          </button>

          <button
            className="income-sidebar-item"
            onClick={() => navigate("/expense")}
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
            aria-label="Open navigation"
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
            <button className="nav-active" aria-current="page">
              {" "}
              Income
            </button>
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
            <button onClick={() => navigate("/budget")}>Budget</button>
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
              <p className="income-eyebrow">YOUR EARNINGS AT A GLANCE</p>
              <h1>Income Overview</h1>
              <p>
                Track every source of income and understand how your earnings
                are growing.
              </p>
            </div>

            <button className="add-income-button" onClick={openAddForm}>
              <span>+</span>
              Add New Income
            </button>
          </div>

          {success && <div className="income-toast success">✓ {success}</div>}
          {error && <div className="income-toast error">! {error}</div>}

          {loading ? (
            <div className="income-loading-card">
              <div className="income-spinner" />
              <h3>Loading your income...</h3>
              <p>Fetching your latest earnings from CashCompass.</p>
            </div>
          ) : (
            <>
              <section className="income-summary-card animated-card">
                <div className="summary-card-icon">↗</div>
                <div className="summary-card-copy">
                  <span>Total Income</span>
                  <strong>{formatCurrency(totalIncome)}</strong>
                  <p>All recorded income across your account</p>
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

              <section className="income-analytics-grid">
                <div className="income-card analytics-line-card animated-card">
                  <div className="income-card-header">
                    <div>
                      <span className="income-section-label">INCOME TREND</span>
                      <h2>Last 6 Months Income</h2>
                      <p>Your monthly earnings movement</p>
                    </div>
                    <div className="chart-badge">6M</div>
                  </div>

                  <div
                    className="income-line-chart"
                    role="img"
                    aria-label="Income for the last six months"
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
                          <path d={linePath} className="income-line-path" />
                        )}

                        {chartPoints.map((point, index) => (
                          <g key={`${point.year}-${point.month}`}>
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r={activePoint === index ? 8 : 5}
                              className="income-chart-point"
                              onMouseEnter={() => setActivePoint(index)}
                              onMouseLeave={() => setActivePoint(null)}
                              aria-label={`${getMonthLabel(point.year, point.month)} income ${formatCurrency(point.amount)}`}
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

                <div className="income-card analytics-donut-card animated-card">
                  <div className="income-card-header">
                    <div>
                      <span className="income-section-label">BREAKDOWN</span>
                      <h2>Income by Category</h2>
                      <p>Where your earnings come from</p>
                    </div>
                    <button
                      className="expand-chart-button"
                      onClick={() => setShowCategoryDetails(true)}
                      aria-label="Expand income by category chart"
                    >
                      ⤢
                    </button>
                  </div>

                  <button
                    className="donut-chart-button"
                    onClick={() => setShowCategoryDetails(true)}
                    aria-label="Open detailed income category chart"
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
                        <p>No income categories yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="income-card transactions-income-card animated-card">
                <div className="income-card-header transactions-header">
                  <div>
                    <span className="income-section-label">
                      RECENT ACTIVITY
                    </span>
                    <h2>Recent Income Transactions</h2>
                    <p>Your latest recorded earnings</p>
                  </div>
                  <button
                    className="view-all-income"
                    onClick={() => setShowAllIncome((value) => !value)}
                  >
                    {showAllIncome ? "Show Recent ↑" : "View All ↓"}
                  </button>
                </div>

                <div className="income-table-wrap">
                  <table className="income-table">
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
                      {recentIncome.map((item) => {
                        const meta = CATEGORY_META[item.category] || {
                          label: item.category,
                          icon: "•",
                          className: "other",
                        };

                        return (
                          <tr key={item.id}>
                            <td className="income-date-cell">
                              {formatDate(item.incomeDate)}
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
                              <div className="income-source">
                                <strong>{item.title}</strong>
                                <span>
                                  {item.description ||
                                    "No description provided"}
                                </span>
                              </div>
                            </td>
                            <td className="income-amount-cell">
                              +{formatCurrency(item.amount)}
                            </td>
                            <td>
                              <div className="income-actions">
                                <button
                                  onClick={() => openEditForm(item)}
                                  aria-label={`Edit ${item.title}`}
                                  title="Edit income"
                                >
                                  ✎
                                </button>
                                <button
                                  className="delete-action"
                                  onClick={() => setDeleteTarget(item)}
                                  aria-label={`Delete ${item.title}`}
                                  title="Delete income"
                                >
                                  🗑
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {recentIncome.length === 0 && (
                        <tr>
                          <td colSpan="5">
                            <div className="empty-income-table">
                              <div>₹</div>
                              <h3>No income transactions yet</h3>
                              <p>
                                Click “Add New Income” to record your first
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

      {showAddIncome && (
        <div
          className="income-modal-layer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="income-form-title"
        >
          <div className="income-form-window">
            <div className="income-form-header">
              <div>
                <span className="income-section-label">CASHCOMPASS INCOME</span>
                <h2 id="income-form-title">
                  {editingIncome ? "Edit Income" : "Add New Income"}
                </h2>
                <p>Keep every earning accounted for.</p>
              </div>
              <button
                className="income-close-button"
                onClick={closeIncomeForm}
                aria-label="Close income form"
              >
                ×
              </button>
            </div>

            <form className="income-form" onSubmit={handleSubmit}>
              <div className="income-form-grid">
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
                    {INCOME_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Income Date</span>
                  <input
                    name="incomeDate"
                    type="date"
                    value={form.incomeDate}
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
                    placeholder="Add a short note about this income..."
                    maxLength="500"
                    rows="4"
                  />
                </label>
              </div>

              <div className="income-form-actions">
                <button
                  type="button"
                  className="secondary-income-button"
                  onClick={closeIncomeForm}
                  disabled={saving}
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
                    : editingIncome
                      ? "Update Income"
                      : "Save Income"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCategoryDetails && (
        <div
          className="income-modal-layer category-modal-layer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="category-details-title"
        >
          <div className="category-details-window">
            <div className="income-form-header">
              <div>
                <span className="income-section-label">INCOME ANALYTICS</span>
                <h2 id="category-details-title">Income by Category</h2>
                <p>Explore how every category contributes to your earnings.</p>
              </div>
              <button
                className="income-close-button"
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
                  aria-label="Income category distribution"
                >
                  <div className="donut-hole">
                    <strong>{formatCurrency(categoryTotal)}</strong>
                    <span>Total Income</span>
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
                        <small>{Math.round(item.percentage)}% of income</small>
                      </div>
                      <b>{formatCurrency(item.amount)}</b>
                    </div>
                  );
                })}

                {normalizedCategories.length === 0 && (
                  <div className="empty-category large-empty">
                    <span>◌</span>
                    <p>Add income to see the category breakdown.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="income-modal-layer delete-layer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
        >
          <div className="delete-confirm-window">
            <div className="delete-icon">!</div>
            <span className="income-section-label">REMOVE INCOME</span>
            <h2 id="delete-title">Delete this income?</h2>
            <p>
              “{deleteTarget.title}” will be permanently removed from your
              income records.
            </p>
            <div className="income-form-actions">
              <button
                className="secondary-income-button"
                onClick={() => setDeleteTarget(null)}
                disabled={saving}
              >
                Keep It
              </button>
              <button
                className="danger-income-button"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? "Deleting..." : "Delete Income"}
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

export default Income;
