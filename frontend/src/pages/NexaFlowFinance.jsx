import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const styles = `
  .nf-finance-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  /* Individual stat card inner layout */
  .nf-fin-stat-card {
    background: rgba(15, 23, 42, 0.55);
    border: 1px solid rgba(6, 182, 212, 0.15);
    border-radius: 16px;
    padding: 1.4rem 1.6rem;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }
  .nf-fin-stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(6,182,212,0.12);
  }
  .nf-fin-stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  .nf-fin-stat-icon {
    width: 40px; height: 40px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
  }
  .nf-fin-stat-label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
    margin-bottom: 0.4rem;
  }
  .nf-fin-stat-value {
    font-size: 1.75rem;
    font-weight: 800;
    font-family: 'Outfit', sans-serif;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }
  .nf-fin-stat-note {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 0.5rem;
  }

  /* Chart and table sections */
  .nf-finance-chart-section {
    background: rgba(15, 23, 42, 0.45);
    border: 1px solid rgba(6, 182, 212, 0.15);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    height: 350px;
  }
  .nf-finance-table-section {
    background: rgba(15, 23, 42, 0.45);
    border: 1px solid rgba(6, 182, 212, 0.15);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    overflow: hidden;
  }
  .nf-fin-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }
  .nf-fin-table th {
    padding: 0.8rem 1rem;
    text-align: left;
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid rgba(6, 182, 212, 0.2);
  }
  .nf-fin-table td {
    padding: 0.9rem 1rem;
    font-size: 0.85rem;
    color: var(--text-primary);
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }
  .nf-fin-table tr:hover td { background: rgba(6, 182, 212, 0.03); }
  .nf-status-badge {
    padding: 0.25rem 0.65rem;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.03em;
  }
  .nf-status-badge.Paid    { background: rgba(16, 185, 129, 0.15); color: #34d399; }
  .nf-status-badge.Pending { background: rgba(245, 158, 11, 0.15);  color: #fbbf24; }
  .nf-status-badge.Overdue { background: rgba(239, 68, 68, 0.15);   color: #f87171; }

  /* Payment modal */
  .nf-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(9, 13, 22, 0.85);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    z-index: 100;
  }
  .nf-modal {
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid var(--accent-cyan);
    border-radius: 20px;
    width: 100%; max-width: 500px;
    padding: 2rem;
    box-shadow: 0 0 40px rgba(6, 182, 212, 0.2);
  }
`;

const navItems = [
  { icon: "dashboard",   label: "Dashboard" },
  { icon: "groups",      label: "Clients" },
  { icon: "folder",      label: "Projects" },
  { icon: "assignment",  label: "Tasks" },
  { icon: "payments",    label: "Finances" },
  { icon: "description", label: "Documents" },
  { icon: "chat",        label: "Communication" }
];

export default function NexaFlowFinance() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Payment recording form state
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

  const fetchFinanceData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://nexaflow-js2m.onrender.com/api/dashboard/finance", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.ok && result.data) {
        setData(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetchFinanceData();

    // WS Connection
    const ws = new WebSocket("ws://localhost:8000/api/dashboard/ws/updates");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "finance_update") {
        fetchFinanceData();
      }
    };
    return () => ws.close();
  }, []);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!invoiceNumber || !paymentAmount) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://nexaflow-js2m.onrender.com/api/dashboard/finance/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          invoice_number: invoiceNumber.trim(),
          amount: parseFloat(paymentAmount),
          payment_method: paymentMethod
        })
      });
      if (res.ok) {
        setShowPaymentModal(false);
        setInvoiceNumber("");
        setPaymentAmount("");
        setPaymentMethod("Bank Transfer");
        fetchFinanceData();
      } else {
        const errorData = await res.json();
        alert(errorData.detail || errorData.message || "Failed to record transaction. Verify the Invoice Number.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to record transaction due to network connection error.");
    }
  };

  const currencyFormatter = (value) => {
    if (value === undefined || value === null || isNaN(value)) {
      return "₹0";
    }
    return value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="nf-app">
        {/* SIDEBAR */}
        <aside className="nf-sidebar">
          <div className="nf-brand">
            <div className="nf-brand-icon">✦</div>
            <div className="nf-brand-text">
              <div className="nf-brand-name">NexaFlow</div>
              <div className="nf-brand-sub">Automation Suite</div>
            </div>
          </div>
          <nav className="nf-nav">
            {navItems.map(({ icon, label }) => (
              <button
                key={label}
                className={`nf-nav-item${label === "Finances" ? " active" : ""}`}
                onClick={() => {
                  if (label === "Clients")       navigate("/client");
                  if (label === "Dashboard")     navigate("/dashboard");
                  if (label === "Projects")      navigate("/projects");
                  if (label === "Tasks")         navigate("/tasks");
                  if (label === "Finances")      navigate("/finances");
                  if (label === "Documents")     navigate("/documents");
                  if (label === "Communication") navigate("/communication");
                }}
              >
                <span className="material-symbols-outlined nf-nav-icon">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="nf-sidebar-bottom">
            <button
              className="nf-create-btn"
              onClick={() => navigate("/client")}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>add</span>
              Onboard Client
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="nf-main">
          <div className="nf-content" style={{ overflowY: "auto" }}>
          {/* Page Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <div>
              <h1 className="nf-page-title">Financial Tracker</h1>
              <p className="nf-page-sub" style={{ marginBottom: 0 }}>Monitor revenue streams, invoice balances, taxes, and operational costs.</p>
            </div>
            <button className="nf-btn-glow" onClick={() => setShowPaymentModal(true)} style={{ marginTop: "0.3rem" }}>
              <span className="material-symbols-outlined">account_balance_wallet</span> Record Payment
            </button>
          </div>

          {loading || !data ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "6rem", gap: "1rem" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", color: "var(--accent-cyan)", animation: "spin 1.5s linear infinite" }}>sync</span>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Loading financial data…</span>
            </div>
          ) : (
            <>
              {/* ── Real Financial Stats from Backend ── */}
              <div className="nf-finance-grid">

                {/* Total Revenue */}
                <div className="nf-fin-stat-card">
                  <div className="nf-fin-stat-header">
                    <div className="nf-fin-stat-icon" style={{ background: "rgba(6,182,212,0.12)", color: "var(--accent-cyan)" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>trending_up</span>
                    </div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--accent-cyan)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Revenue</span>
                  </div>
                  <div className="nf-fin-stat-label">Total Revenue</div>
                  <div className="nf-fin-stat-value" style={{ color: "var(--accent-cyan)" }}>{currencyFormatter(data.total_revenue)}</div>
                  <div className="nf-fin-stat-note">Payments received from all clients</div>
                </div>

                {/* Total Expenses */}
                <div className="nf-fin-stat-card">
                  <div className="nf-fin-stat-header">
                    <div className="nf-fin-stat-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#fbbf24" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>payments</span>
                    </div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#fbbf24", letterSpacing: "0.05em", textTransform: "uppercase" }}>Expenses</span>
                  </div>
                  <div className="nf-fin-stat-label">Total Expenses</div>
                  <div className="nf-fin-stat-value" style={{ color: "#fbbf24" }}>{currencyFormatter(data.total_expenses)}</div>
                  <div className="nf-fin-stat-note">Payroll + GST liabilities combined</div>
                </div>

                {/* Total Profit */}
                <div className="nf-fin-stat-card">
                  <div className="nf-fin-stat-header">
                    <div className="nf-fin-stat-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#34d399" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>savings</span>
                    </div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#34d399", letterSpacing: "0.05em", textTransform: "uppercase" }}>Profit</span>
                  </div>
                  <div className="nf-fin-stat-label">Total Profit</div>
                  <div className="nf-fin-stat-value" style={{ color: "#34d399" }}>{currencyFormatter(data.total_profit)}</div>
                  <div className="nf-fin-stat-note">{data.total_profit > 0 ? "Revenue exceeds expenses ✓" : "No profit recorded yet"}</div>
                </div>

                {/* Total Loss */}
                <div className="nf-fin-stat-card">
                  <div className="nf-fin-stat-header">
                    <div className="nf-fin-stat-icon" style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>trending_down</span>
                    </div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#f87171", letterSpacing: "0.05em", textTransform: "uppercase" }}>Loss</span>
                  </div>
                  <div className="nf-fin-stat-label">Total Loss</div>
                  <div className="nf-fin-stat-value" style={{ color: data.total_loss > 0 ? "#f87171" : "var(--text-muted)" }}>
                    {currencyFormatter(data.total_loss)}
                  </div>
                  <div className="nf-fin-stat-note">{data.total_loss > 0 ? "Expenses exceed revenue ⚠" : "No loss — finances healthy"}</div>
                </div>

              </div>

              {/* Cashflow Graph */}
              <div className="nf-finance-chart-section">
                <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", marginBottom: "1rem" }}>Monthly Cashflow</h2>
                <div style={{ width: "100%", height: "260px" }}>
                  <ResponsiveContainer>
                    <AreaChart data={data.cashflow.length > 0 ? data.cashflow : [{month: "Empty", amount: 0}]}>
                      <defs>
                        <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={currencyFormatter} />
                      <Tooltip formatter={(value) => currencyFormatter(value)} contentStyle={{ background: "#0f172a", border: "1px solid var(--accent-cyan)" }} />
                      <Area type="monotone" dataKey="amount" stroke="var(--accent-cyan)" fillOpacity={1} fill="url(#colorAmt)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Invoices List */}
              <div className="nf-finance-table-section">
                <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem" }}>Billing Invoices</h2>
                <table className="nf-fin-table">
                  <thead>
                    <tr>
                      <th>Invoice Ref</th>
                      <th>Project / Client</th>
                      <th>Base Amount</th>
                      <th>GST (18%)</th>
                      <th>Total Amount</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.invoices.map(inv => (
                      <tr key={inv.invoice_id}>
                        <td style={{ fontFamily: "Orbitron, monospace" }}>{inv.invoice_number}</td>
                        <td>{inv.project_name}</td>
                        <td>{currencyFormatter(inv.base_amount)}</td>
                        <td>{currencyFormatter(inv.gst_amount)}</td>
                        <td style={{ fontWeight: 700 }}>{currencyFormatter(inv.total_amount)}</td>
                        <td>{inv.due_date || "—"}</td>
                        <td>
                          <span className={`nf-status-badge ${inv.payment_status}`}>{inv.payment_status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          </div>{/* end nf-content */}
        </div>{/* end nf-main */}
      </div>{/* end nf-app */}

      {/* RECORD PAYMENT MODAL */}
      <AnimatePresence>
        {showPaymentModal && data && (
          <div className="nf-modal-overlay">
            <motion.div
              className="nf-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 style={{ fontFamily: "Outfit, sans-serif", marginBottom: "1.5rem", color: "var(--text-primary)" }}>Record Client Payment</h2>
              <form onSubmit={handleRecordPayment} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>Invoice Number</label>
                  <input
                    type="text"
                    required
                    className="nf-input-glass"
                    style={{ width: "100%" }}
                    placeholder="Enter Invoice Number (e.g. INV-1001)"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="nf-input-glass"
                    style={{ width: "100%" }}
                    placeholder="Enter recorded amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>Payment Method</label>
                  <select
                    className="nf-input-glass"
                    style={{ width: "100%" }}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" className="nf-btn-glow" style={{ flex: 1, justifyContent: "center" }}>Record Transaction</button>
                  <button
                    type="button"
                    className="nf-input-glass"
                    style={{ flex: 1 }}
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
