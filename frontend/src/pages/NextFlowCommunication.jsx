import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .nf-app {
    display: flex; min-height: 100vh;
    background: #f0f2f7;
    font-family: 'DM Sans', sans-serif;
    color: #111827;
  }

  /* ── SIDEBAR ── */
  .nf-sidebar {
    width: 200px;
    min-width: 200px;
    background: #fff;
    border-right: 1px solid #e9ebf0;
    display: flex;
    flex-direction: column;
    padding-bottom: 1.5rem;
  }

  .nf-brand {
    padding: 1.2rem 1.2rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    border-bottom: 1px solid #f0f2f7;
    margin-bottom: 1rem;
  }

  .nf-brand-icon {
    width: 32px; height: 32px;
    background: #1d4ed8;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 0.9rem;
  }

  .nf-brand-text { line-height: 1.1; }
  .nf-brand-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.92rem;
    color: #111827;
  }
  .nf-brand-sub {
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    color: #9ca3af;
    text-transform: uppercase;
  }

  .nf-nav { flex: 1; padding: 0 0.7rem; }

  .nf-nav-item {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.6rem 0.75rem;
    border-radius: 9px;
    font-size: 0.87rem;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.15s;
    margin-bottom: 0.1rem;
    border: none; background: none; width: 100%; text-align: left;
  }

  .nf-nav-item:hover { background: #f3f6fa; color: #374151; }
  .nf-nav-item.active { background: #eff3ff; color: #1d4ed8; font-weight: 600; }
  .nf-nav-item.active .nf-nav-icon { color: #1d4ed8; }

  .nf-nav-icon { font-size: 1rem; width: 18px; text-align: center; }

  .nf-sidebar-bottom {
    padding: 0 0.7rem;
    border-top: 1px solid #f0f2f7;
    padding-top: 1rem;
  }

  .nf-create-btn {
    width: 100%;
    padding: 0.65rem;
    background: #1d4ed8;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.82rem;
    cursor: pointer;
    margin-bottom: 0.8rem;
    transition: background 0.15s;
  }
  .nf-create-btn:hover { background: #1a44c2; }

  .nf-nav-bottom-item {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.83rem; color: #9ca3af;
    cursor: pointer; border-radius: 8px;
    border: none; background: none; width: 100%; text-align: left;
    transition: color 0.15s;
  }
  .nf-nav-bottom-item:hover { color: #374151; }

  /* ── MAIN ── */
  .nf-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

  /* TOPBAR */
  .nf-topbar {
    background: #fff; border-bottom: 1px solid #e9ebf0;
    padding: 0.65rem 1.5rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .nf-search { flex: 1; max-width: 320px; position: relative; }
  .nf-search input {
    width: 100%; padding: 0.44rem 0.85rem 0.44rem 2rem;
    border: 1.5px solid #e5e7eb; border-radius: 9px;
    background: #f7f8fb; font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem; color: #374151; outline: none; transition: border-color 0.15s;
  }
  .nf-search input:focus { border-color: #1d4ed8; background: #fff; }
  .nf-search input::placeholder { color: #b0b7c3; }
  .nf-search-icon { position: absolute; left: 0.65rem; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 0.78rem; pointer-events: none; }

  .nf-topbar-actions { display: flex; align-items: center; gap: 0.75rem; margin-left: auto; }
  .nf-icon-btn {
    width: 30px; height: 30px; border-radius: 50%;
    border: 1.5px solid #e5e7eb; background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6b7280; font-size: 0.82rem; transition: border-color 0.15s;
  }
  .nf-icon-btn:hover { border-color: #1d4ed8; }
  .nf-user { display: flex; align-items: center; gap: 0.45rem; }
  .nf-user-name { font-size: 0.8rem; font-weight: 600; color: #111827; }
  .nf-avatar { width: 30px; height: 30px; border-radius: 50%; background: #1a1f2e; display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 700; color: #fff; }

  /* CONTENT */
  .nf-content { flex: 1; padding: 1.5rem 1.8rem; overflow-y: auto; }

  /* PAGE HEADER */
  .nf-page-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 1.2rem;
  }
  .nf-page-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.55rem; margin-bottom: 0.2rem; }
  .nf-page-sub { font-size: 0.82rem; color: #6b7280; }

  .nf-header-btns { display: flex; gap: 0.6rem; align-items: center; }
  .nf-export-btn {
    display: flex; align-items: center; gap: 0.35rem;
    padding: 0.45rem 0.85rem; border: 1.5px solid #e5e7eb;
    border-radius: 9px; background: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 0.79rem;
    color: #374151; cursor: pointer; font-weight: 500; transition: border-color 0.15s;
  }
  .nf-export-btn:hover { border-color: #1d4ed8; color: #1d4ed8; }
  .nf-new-btn {
    display: flex; align-items: center; gap: 0.35rem;
    padding: 0.45rem 0.85rem; background: #1d4ed8; color: #fff;
    border: none; border-radius: 9px; font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 0.79rem; cursor: pointer; transition: background 0.15s;
  }
  .nf-new-btn:hover { background: #1a44c2; }

  /* FILTERS */
  .nf-filters {
    background: #fff; border: 1px solid #e9ebf0; border-radius: 12px;
    padding: 0.85rem 1.1rem;
    display: flex; align-items: flex-end; gap: 1rem; flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  .nf-filter-group { display: flex; flex-direction: column; gap: 0.25rem; min-width: 130px; }
  .nf-filter-label { font-size: 0.63rem; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #9ca3af; }

  .nf-select-wrap { position: relative; }
  .nf-select {
    appearance: none; padding: 0.42rem 1.8rem 0.42rem 0.75rem;
    border: 1.5px solid #e5e7eb; border-radius: 8px;
    background: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 0.81rem; color: #374151; cursor: pointer; outline: none;
    transition: border-color 0.15s; width: 100%;
  }
  .nf-select:focus { border-color: #1d4ed8; }
  .nf-chevron { position: absolute; right: 0.55rem; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 0.62rem; pointer-events: none; }

  .nf-reset-btn {
    background: none; border: none; color: #1d4ed8; font-size: 0.8rem;
    font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
    padding: 0.42rem 0; margin-left: auto; transition: opacity 0.15s; align-self: flex-end;
  }
  .nf-reset-btn:hover { opacity: 0.7; }

  /* TABLE CARD */
  .nf-table-card {
    background: #fff; border: 1px solid #e9ebf0; border-radius: 12px;
    overflow: hidden; margin-bottom: 1rem;
  }
  .nf-table { width: 100%; border-collapse: collapse; }
  .nf-table th {
    padding: 0.75rem 1rem; font-size: 0.66rem; letter-spacing: 0.1em;
    text-transform: uppercase; color: #9ca3af; font-weight: 700; text-align: left;
    background: #fafbfd; border-bottom: 1px solid #f0f2f7;
  }
  .nf-table td {
    padding: 0.9rem 1rem; font-size: 0.82rem;
    border-bottom: 1px solid #f7f8fb; vertical-align: middle;
  }
  .nf-table tbody tr:last-child td { border-bottom: none; }
  .nf-table tbody tr:hover td { background: #fafbfd; }

  /* CLIENT CELL */
  .nf-client-cell { display: flex; align-items: center; gap: 0.6rem; }
  .nf-client-avatar {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.68rem; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .nf-client-name { font-weight: 600; font-size: 0.83rem; }

  /* EMAIL TYPE PILL */
  .nf-type-pill {
    display: inline-block; padding: 0.22rem 0.65rem;
    border-radius: 6px; font-size: 0.71rem; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
  }
  .nf-type-pill.agreement { background: #eff3ff; color: #1d4ed8; }
  .nf-type-pill.invoice   { background: #f5f3ff; color: #7c3aed; }
  .nf-type-pill.welcome   { background: #f0fdf4; color: #15803d; }
  .nf-type-pill.reminder  { background: #fff7ed; color: #c2410c; }

  /* DATE */
  .nf-date-primary { font-size: 0.82rem; color: #374151; font-weight: 500; }
  .nf-date-time    { font-size: 0.72rem; color: #9ca3af; }

  /* STATUS */
  .nf-status-pill {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.25rem 0.65rem; border-radius: 99px;
    font-size: 0.74rem; font-weight: 600;
  }
  .nf-status-pill.sent   { background: #eff3ff; color: #1d4ed8; }
  .nf-status-pill.failed { background: #fef2f2; color: #dc2626; }
  .nf-status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .nf-status-dot.sent   { background: #1d4ed8; }
  .nf-status-dot.failed { background: #dc2626; }

  /* ACTION ICONS */
  .nf-action-icon-btn {
    width: 28px; height: 28px; border-radius: 7px;
    border: none; background: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #9ca3af; font-size: 0.9rem; transition: background 0.15s, color 0.15s;
  }
  .nf-action-icon-btn:hover { background: #f3f4f6; color: #374151; }

  /* PAGINATION */
  .nf-pagination-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.75rem 1rem; border-top: 1px solid #f0f2f7;
    font-size: 0.76rem; color: #9ca3af;
  }
  .nf-page-btns { display: flex; align-items: center; gap: 0.3rem; }
  .nf-page-btn {
    width: 28px; height: 28px; border-radius: 7px;
    border: 1.5px solid #e5e7eb; background: #fff;
    font-size: 0.78rem; font-weight: 600; color: #6b7280;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .nf-page-btn:hover { border-color: #1d4ed8; color: #1d4ed8; }
  .nf-page-btn.active { background: #1d4ed8; border-color: #1d4ed8; color: #fff; }
  .nf-page-btn.arrow { border: none; background: none; color: #9ca3af; }
  .nf-page-btn.arrow:hover { background: #f3f4f6; color: #374151; }

  /* BOTTOM STATS */
  .nf-bottom-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }

  .nf-stat-card {
    border-radius: 14px; padding: 1.1rem 1.3rem;
    border: 1px solid #e9ebf0;
  }
  .nf-stat-card.light-blue { background: #eff3ff; border-color: #dbeafe; }
  .nf-stat-card.light-red  { background: #fef2f2; border-color: #fecaca; }
  .nf-stat-card.light-gray { background: #f7f8fb; border-color: #e9ebf0; }
  .nf-stat-card.empty      { background: #f7f8fb; border-color: #e9ebf0; }

  .nf-stat-icon { font-size: 1.1rem; margin-bottom: 0.6rem; }
  .nf-stat-label { font-size: 0.67rem; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #6b7280; margin-bottom: 0.4rem; }
  .nf-stat-value { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.6rem; color: #111827; line-height: 1; margin-bottom: 0.35rem; }
  .nf-stat-card.light-red .nf-stat-value { color: #111827; }
  .nf-stat-sub { font-size: 0.73rem; font-weight: 500; }
  .nf-stat-sub.green { color: #16a34a; }
  .nf-stat-sub.red   { color: #dc2626; display: flex; align-items: center; gap: 0.25rem; }
  .nf-stat-sub.gray  { color: #9ca3af; }
`;

const navItems = [
  { icon: "dashboard", label: "Dashboard" },
  { icon: "groups", label: "Clients" },
  { icon: "folder", label: "Projects" },
  { icon: "description", label: "Documents" },
  { icon: "chat", label: "Communication" },
];

const avatarColors = {
  AS: "#6366f1", MB: "#7c3aed", CW: "#0891b2", DR: "#1d4ed8", EP: "#8b5cf6",
};

const logs = [
  { initials: "AS", name: "Alexandria Sterling", type: "agreement", date: "Oct 24, 2023", time: "09:42 AM", status: "sent" },
  { initials: "MB", name: "Marcus Bennett",      type: "invoice",   date: "Oct 24, 2023", time: "08:15 AM", status: "failed" },
  { initials: "CW", name: "Claire Winston",      type: "welcome",   date: "Oct 23, 2023", time: "04:39 PM", status: "sent" },
  { initials: "DR", name: "David Rivera",        type: "reminder",  date: "Oct 23, 2023", time: "02:11 PM", status: "sent" },
  { initials: "EP", name: "Elena Parks",         type: "invoice",   date: "Oct 23, 2023", time: "11:05 AM", status: "failed" },
];

const typeLabel = { agreement: "Agreement", invoice: "Invoice", welcome: "Welcome", reminder: "Reminder" };

export default function NexaFlowCommunication() {
  const [activeNav, setActiveNav]     = useState("Communication");
  const navigate = useNavigate();
  const [emailType, setEmailType]     = useState("all");
  const [dateRange, setDateRange]     = useState("24h");
  const [statusFilter, setStatus]     = useState("all");
  const [page, setPage]               = useState(1);
  
  const filtered = logs.filter((l) => {
    const matchType   = emailType === "all"   || l.type   === emailType;
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchType && matchStatus;
  });

  const reset = () => { setEmailType("all"); setDateRange("24h"); setStatus("all"); };

  return (
    <>
      <style>{styles}</style>
      <div className="nf-app">
        {/* SIDEBAR */}
        <aside className="nf-sidebar">
          <div className="nf-brand">
            <div className="nf-brand-icon">✦</div>
            <div>
              <div className="nf-brand-name">NexaFlow</div>
              <div className="nf-brand-sub">Automation Suite</div>
            </div>
          </div>
          <nav className="nf-nav">
            {navItems.map(({ icon, label }) => (
              <button
                key={label}
                className={`nf-nav-item${activeNav === label ? " active" : ""}`}
                onClick={() => {
                    setActiveNav(label);

                    if (label === "Clients") {
                        navigate("/client");
                    }

                    if (label === "Dashboard") {
                        navigate("/dashboard");
                    }
                    if (label === "Projects"){
                        navigate("/projects")
                    }
                    if (label === "Documents"){
                        navigate("/documents")
                    }
                    if (label === "Communication"){
                        navigate("/communication")
                    }
                    }}
              >
                <span className="material-symbols-outlined nf-nav-icon">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="nf-sidebar-bottom">
            <button className="nf-nav-bottom-item">⚙️ Settings</button>
            <button className="nf-nav-bottom-item">❓ Support</button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="nf-main">
          {/* TOPBAR */}
          <header className="nf-topbar">
            <div className="nf-search">
              <span className="nf-search-icon">🔍</span>
              <input placeholder="Search communication logs..." />
            </div>
            <div className="nf-topbar-actions">
              <div className="nf-icon-btn">🔔</div>
              <div className="nf-icon-btn">❓</div>
              <div className="nf-user">
                <span className="nf-user-name">Admin User</span>
                <div className="nf-avatar">AU</div>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="nf-content">
            {/* Page Header */}
            <div className="nf-page-header">
              <div>
                <div className="nf-page-title">Email Logs</div>
                <div className="nf-page-sub">Monitor and audit automated communication flows across your ecosystem.</div>
              </div>
              <div className="nf-header-btns">
                <button className="nf-export-btn">⬇ Export CSV</button>
                <button className="nf-new-btn">+ New Template</button>
              </div>
            </div>

            {/* FILTERS */}
            <div className="nf-filters">
              <div className="nf-filter-group">
                <label className="nf-filter-label">Email Type</label>
                <div className="nf-select-wrap">
                  <select className="nf-select" value={emailType} onChange={(e) => setEmailType(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="agreement">Agreement</option>
                    <option value="invoice">Invoice</option>
                    <option value="welcome">Welcome</option>
                    <option value="reminder">Reminder</option>
                  </select>
                  <span className="nf-chevron">▼</span>
                </div>
              </div>

              <div className="nf-filter-group">
                <label className="nf-filter-label">Date Range</label>
                <div className="nf-select-wrap">
                  <select className="nf-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="all">All Time</option>
                  </select>
                  <span className="nf-chevron">▼</span>
                </div>
              </div>

              <div className="nf-filter-group">
                <label className="nf-filter-label">Status</label>
                <div className="nf-select-wrap">
                  <select className="nf-select" value={statusFilter} onChange={(e) => setStatus(e.target.value)}>
                    <option value="all">All Statuses</option>
                    <option value="sent">Sent</option>
                    <option value="failed">Failed</option>
                  </select>
                  <span className="nf-chevron">▼</span>
                </div>
              </div>

              <button className="nf-reset-btn" onClick={reset}>Reset Filters</button>
            </div>

            {/* TABLE */}
            <div className="nf-table-card">
              <table className="nf-table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Email Type</th>
                    <th>Date &amp; Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", color: "#9ca3af", padding: "2rem" }}>
                        No logs match your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((log) => (
                      <tr key={log.name}>
                        <td>
                          <div className="nf-client-cell">
                            <div className="nf-client-avatar" style={{ background: avatarColors[log.initials] }}>
                              {log.initials}
                            </div>
                            <span className="nf-client-name">{log.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`nf-type-pill ${log.type}`}>{typeLabel[log.type]}</span>
                        </td>
                        <td>
                          <div className="nf-date-primary">{log.date}</div>
                          <div className="nf-date-time">{log.time}</div>
                        </td>
                        <td>
                          <span className={`nf-status-pill ${log.status}`}>
                            <span className={`nf-status-dot ${log.status}`} />
                            {log.status === "sent" ? "Sent" : "Failed"}
                          </span>
                        </td>
                        <td>
                          <button className="nf-action-icon-btn" title={log.status === "failed" ? "Retry" : "View"}>
                            {log.status === "failed" ? "↻" : "👁"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="nf-pagination-row">
                <span>Showing 1 to {filtered.length} of 48 logs</span>
                <div className="nf-page-btns">
                  <button className="nf-page-btn arrow" onClick={() => setPage(Math.max(1, page - 1))}>‹</button>
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      className={`nf-page-btn${page === n ? " active" : ""}`}
                      onClick={() => setPage(n)}
                    >{n}</button>
                  ))}
                  <button className="nf-page-btn arrow" onClick={() => setPage(Math.min(3, page + 1))}>›</button>
                </div>
              </div>
            </div>

            {/* BOTTOM STATS */}
            <div className="nf-bottom-stats">
              {/* Delivery Rate */}
              <div className="nf-stat-card light-blue">
                <div className="nf-stat-icon">▷</div>
                <div className="nf-stat-label">Delivery Rate</div>
                <div className="nf-stat-value">94.2%</div>
                <div className="nf-stat-sub green">↗ +2.1% from last month</div>
              </div>

              {/* Failed Delivery */}
              <div className="nf-stat-card light-red">
                <div className="nf-stat-icon">⚠</div>
                <div className="nf-stat-label">Failed Delivery</div>
                <div className="nf-stat-value">12</div>
                <div className="nf-stat-sub red">⚡ Requires Attention</div>
              </div>

              {/* Avg Response Time */}
              <div className="nf-stat-card light-gray">
                <div className="nf-stat-icon">🕐</div>
                <div className="nf-stat-label">Avg. Response Time</div>
                <div className="nf-stat-value">14m</div>
                <div className="nf-stat-sub gray">Across all automations</div>
              </div>

              {/* Empty placeholder card */}
              <div className="nf-stat-card empty" />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
