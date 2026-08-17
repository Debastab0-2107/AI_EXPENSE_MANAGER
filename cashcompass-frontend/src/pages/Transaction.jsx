import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Income.css";
import "./Transaction.css";
import LogoutModal from "../components/LogoutModal";

const PAGE_SIZE = 10;

const EMPTY_FORM = {
  title: "",
  amount: "",
  type: "EXPENSE",
  transactionDate: new Date().toISOString().slice(0, 10),
  description: "",
};

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function dateText(value) {
  if (!value) return "—";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function unwrap(response) {
  return response?.data ?? response ?? null;
}

export default function Transaction() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [transactions, setTransactions] = useState([]);

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);

  // =========================================================
  // LOAD SUMMARY
  // =========================================================

  const loadSummary = async () => {
    try {
      const response = await api.get("/api/transactions/summary");

      const data = unwrap(response);

      setSummary({
        totalIncome: Number(data?.totalIncome || 0),
        totalExpense: Number(data?.totalExpense || 0),
        balance: Number(data?.balance || 0),
      });
    } catch (err) {
      console.error("Summary error:", err);
    }
  };

  // =========================================================
  // LOAD TRANSACTIONS
  // =========================================================

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      let endpoint;

      if (from && to) {
        endpoint =
          `/api/transactions/date-range?from=${from}&to=${to}` +
          `&page=${page}&size=${PAGE_SIZE}`;
      } else if (activeFilter !== "ALL") {
        endpoint =
          `/api/transactions/type?type=${activeFilter}` +
          `&page=${page}&size=${PAGE_SIZE}`;
      } else {
        endpoint =
          `/api/transactions?page=${page}&size=${PAGE_SIZE}` +
          `&sortBy=transactionDate&direction=desc`;
      }

      const response = await api.get(endpoint);

      const data = unwrap(response);

      setTransactions(data?.content || []);
      setTotalPages(Math.max(1, Number(data?.totalPages || 1)));
      setTotalElements(Number(data?.totalElements || 0));
    } catch (err) {
      console.error("Transaction loading error:", err);

      setError(
        err.message || "Unable to load transactions."
      );

      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadSummary();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [page, activeFilter, from, to]);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return transactions;
    }

    return transactions.filter((item) =>
      [
        item.title,
        item.description,
        item.type,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(term)
        )
    );
  }, [transactions, search]);

  // =========================================================
  // ADD
  // =========================================================

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const openEdit = (item) => {
    setEditing(item);

    setForm({
      title: item.title || "",
      amount: item.amount || "",
      type: item.type || "EXPENSE",
      transactionDate:
        item.transactionDate ||
        new Date().toISOString().slice(0, 10),
      description: item.description || "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // =========================================================
  // CLOSE FORM
  // =========================================================

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditing(null);
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a transaction title.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    if (!form.transactionDate) {
      setError("Please select a transaction date.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: form.title.trim(),
        amount: Number(form.amount),
        type: form.type,
        transactionDate: form.transactionDate,
        description:
          form.description.trim() || null,
      };

      if (editing) {
        await api.put(
          `/api/transactions/${editing.id}`,
          payload
        );

        setSuccess(
          "Transaction updated successfully."
        );
      } else {
        await api.post(
          "/api/transactions",
          payload
        );

        setSuccess(
          "Transaction added successfully."
        );
      }

      setShowForm(false);
      setEditing(null);

      await Promise.all([
        loadTransactions(),
        loadSummary(),
      ]);
    } catch (err) {
      console.error("Save error:", err);

      setError(
        err.message || "Unable to save transaction."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setSaving(true);
      setError("");

      await api.delete(
        `/api/transactions/${deleteTarget.id}`
      );

      setDeleteTarget(null);

      setSuccess(
        "Transaction deleted successfully."
      );

      if (
        transactions.length === 1 &&
        page > 0
      ) {
        setPage((previous) => previous - 1);
      } else {
        await Promise.all([
          loadTransactions(),
          loadSummary(),
        ]);
      }
    } catch (err) {
      console.error("Delete error:", err);

      setError(
        err.message ||
          "Unable to delete transaction."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // FILTER
  // =========================================================

  const changeFilter = (filter) => {
    setPage(0);
    setActiveFilter(filter);

    setFrom("");
    setTo("");
  };

  // =========================================================
  // DATE FILTER
  // =========================================================

  const applyDateRange = () => {
    if (!from || !to) {
      setError(
        "Select both From and To dates."
      );

      return;
    }

    if (from > to) {
      setError(
        "From date cannot be after To date."
      );

      return;
    }

    setPage(0);
    setActiveFilter("ALL");
    setError("");
  };

  // =========================================================
  // CLEAR
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setFrom("");
    setTo("");
    setActiveFilter("ALL");
    setPage(0);
  };

  return (
    <div className="transaction-page">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`transaction-sidebar ${mobileSidebarOpen ? "open" : ""}`}
      >
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
            className="income-sidebar-item "
            onClick={() => navigate("/income")}
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
            className="income-sidebar-item active"
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
            aria-label="Reports"
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

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="transaction-main">
        {/* HEADER */}

        <header className="transaction-header">
          <button
            className="transaction-mobile-menu"
            onClick={() => setMobileSidebarOpen((value) => !value)}
          >
            ☰
          </button>

          <div className="transaction-header-brand">
            <img
              src="https://raw.githubusercontent.com/parambratamoitra/fsp/main/newlogoGreen.png"
              alt="CashCompass"
            />

            <div>
              <h2>CashCompass</h2>

              <p>Directing your money, daily.</p>
            </div>
          </div>

          <nav className="transaction-top-navigation">
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>

            <button onClick={() => navigate("/income")}>Income</button>

            <button onClick={() => navigate("/reports")}>Reports</button>

            <button onClick={() => navigate("/expense")}>Expense</button>

            <button className="nav-active">Transactions</button>

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

        {/* CONTENT */}

        <section className="transaction-content">
          <div className="transaction-heading">
            <div>
              <p className="transaction-eyebrow">YOUR MONEY ACTIVITY</p>

              <h1>Transactions</h1>

              <p>
                One clean place to view, filter, edit, and manage every money
                movement.
              </p>
            </div>
          </div>

          {/* MESSAGES */}

          {success && (
            <div className="transaction-toast success">✓ {success}</div>
          )}

          {error && <div className="transaction-toast error">! {error}</div>}

          {/* SUMMARY */}

          {/* TRANSACTION PANEL */}

          <section className="transaction-panel">
            <div className="transaction-panel-head">
              <div>
                <h2>All Transactions</h2>

                <p>
                  {totalElements} transaction
                  {totalElements === 1 ? "" : "s"} found
                </p>
              </div>

              <div className="transaction-search-wrap">
                <span>⌕</span>

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search title or description..."
                />
              </div>
            </div>

            {/* FILTERS */}

            <div className="transaction-controls">
              <div className="transaction-filter-tabs">
                {["ALL", "INCOME", "EXPENSE"].map((filter) => (
                  <button
                    key={filter}
                    className={
                      activeFilter === filter && !(from && to) ? "active" : ""
                    }
                    onClick={() => changeFilter(filter)}
                  >
                    {filter === "ALL"
                      ? "All"
                      : filter === "INCOME"
                        ? "Income"
                        : "Expense"}
                  </button>
                ))}
              </div>

              <div className="transaction-date-controls">
                <label>
                  <span>From</span>

                  <input
                    type="date"
                    value={from}
                    onChange={(event) => setFrom(event.target.value)}
                  />
                </label>

                <label>
                  <span>To</span>

                  <input
                    type="date"
                    value={to}
                    onChange={(event) => setTo(event.target.value)}
                  />
                </label>

                <button onClick={applyDateRange}>Apply</button>

                <button className="clear-button" onClick={clearFilters}>
                  Clear
                </button>
              </div>
            </div>

            {/* TABLE */}

            {loading ? (
              <div className="transaction-loading">
                <div className="transaction-spinner" />

                <h3>Loading transactions...</h3>

                <p>Gathering your latest money activity.</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="transaction-empty">
                <div className="transaction-empty-icon">≡</div>

                <h3>No transactions found</h3>

                <p>Try another filter or add your first transaction.</p>
              </div>
            ) : (
              <div className="transaction-table-wrap">
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th>Transaction</th>

                      <th>Type</th>

                      <th>Date</th>

                      <th>Description</th>

                      <th>Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransactions.map((item, index) => (
                      <tr
                        key={item.id}
                        style={{
                          "--row-index": index,
                        }}
                      >
                        <td>
                          <div className="transaction-title-cell">
                            <div
                              className={`transaction-type-icon ${
                                item.type === "INCOME" ? "income" : "expense"
                              }`}
                            >
                              {item.type === "INCOME" ? "↗" : "↘"}
                            </div>

                            <div>
                              <strong>{item.title}</strong>

                              <small>#{item.id}</small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`transaction-badge ${
                              item.type === "INCOME" ? "income" : "expense"
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>

                        <td>{dateText(item.transactionDate)}</td>

                        <td className="description-cell">
                          {item.description || "No description"}
                        </td>

                        <td
                          className={`amount-cell ${
                            item.type === "INCOME" ? "income" : "expense"
                          }`}
                        >
                          {item.type === "INCOME" ? "+" : "-"}

                          {money(item.amount)}
                        </td>

                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PAGINATION */}

            {!loading && totalPages > 1 && (
              <div className="transaction-pagination">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((value) => value - 1)}
                >
                  ← Previous
                </button>

                <span>
                  Page <strong>{page + 1}</strong> of{" "}
                  <strong>{totalPages}</strong>
                </span>

                <button
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </section>
        </section>
      </main>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showForm && (
        <div className="transaction-modal-layer" onMouseDown={closeForm}>
          <div
            className="transaction-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="transaction-modal-head">
              <div>
                <p>KEEP IT ORGANIZED</p>

                <h2>{editing ? "Edit Transaction" : "Add Transaction"}</h2>
              </div>

              <button onClick={closeForm}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="transaction-form-grid">
                <label>
                  <span>Title</span>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Grocery shopping"
                    maxLength={100}
                    required
                  />
                </label>

                <label>
                  <span>Amount</span>

                  <input
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </label>

                <label>
                  <span>Type</span>

                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="INCOME">Income</option>

                    <option value="EXPENSE">Expense</option>
                  </select>
                </label>

                <label>
                  <span>Transaction Date</span>

                  <input
                    name="transactionDate"
                    type="date"
                    value={form.transactionDate}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="full-width">
                  <span>Description</span>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Optional note..."
                    maxLength={500}
                    rows="4"
                  />
                </label>
              </div>

              <div className="transaction-modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button type="submit" className="save-button" disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editing
                      ? "Update Transaction"
                      : "Save Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {deleteTarget && (
        <div
          className="transaction-modal-layer"
          onMouseDown={() => !saving && setDeleteTarget(null)}
        >
          <div
            className="transaction-delete-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="delete-icon">!</div>

            <h2>Delete Transaction?</h2>

            <p>
              This will permanently remove <strong>{deleteTarget.title}</strong>{" "}
              from your transaction history.
            </p>

            <div className="transaction-modal-actions">
              <button
                className="cancel-button"
                onClick={() => setDeleteTarget(null)}
                disabled={saving}
              >
                Keep It
              </button>

              <button
                className="delete-button"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? "Deleting..." : "Delete"}
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