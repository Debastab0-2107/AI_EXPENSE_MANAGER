import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import NotAvailablePage from "./pages/NotAvailablePage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Budget from "./pages/Budget";
import Transaction from "./pages/Transaction";
import Report from "./pages/Report";
import VerifyOtp from "./pages/VerifyOtp";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {

    return (
      <BrowserRouter>
        <Routes>
          {/* =============================== */}
          {/* PUBLIC ROUTES */}
          {/* =============================== */}

          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* =============================== */}
          {/* PROTECTED ROUTES */}
          {/* =============================== */}

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/income" element={<Income />} />

            <Route path="/expense" element={<Expense />} />

            <Route path="/budget" element={<Budget />} />

            <Route path="/transactions" element={<Transaction />} />

            <Route path="/reports" element={<Report />} />

            {/* =========================================
        FEATURES NOT AVAILABLE YET
       ========================================= */}
            <Route path="/not-available" element={<NotAvailablePage />} />
          </Route>

          {/* =============================== */}
          {/* DEFAULT */}
          {/* =============================== */}

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
}


export default App;