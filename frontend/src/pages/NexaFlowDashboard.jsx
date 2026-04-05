import { useState } from "react";
import { useNavigate } from "react-router-dom";
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .nf-app {
    display: flex;
    min-height: 100vh;
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
  .nf-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* TOPBAR */
  .nf-topbar {
    background: #fff;
    border-bottom: 1px solid #e9ebf0;
    padding: 0.75rem 1.8rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nf-search {
    flex: 1;
    max-width: 480px;
    position: relative;
  }

  .nf-search input {
    width: 100%;
    padding: 0.5rem 0.9rem 0.5rem 2.3rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    background: #f7f8fb;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.83rem;
    color: #374151;
    outline: none;
    transition: border-color 0.15s;
  }
  .nf-search input:focus { border-color: #1d4ed8; background: #fff; }
  .nf-search input::placeholder { color: #b0b7c3; }

  .nf-search-icon {
    position: absolute; left: 0.75rem; top: 50%;
    transform: translateY(-50%); color: #9ca3af; font-size: 0.85rem;
    pointer-events: none;
  }

  .nf-topbar-actions {
    display: flex; align-items: center; gap: 0.9rem; margin-left: auto;
  }

  .nf-icon-btn {
    width: 34px; height: 34px;
    border-radius: 50%;
    border: 1.5px solid #e5e7eb;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6b7280; font-size: 0.9rem;
    position: relative; transition: border-color 0.15s;
  }
  .nf-icon-btn:hover { border-color: #1d4ed8; color: #1d4ed8; }

  .nf-notif-dot {
    position: absolute; top: 4px; right: 4px;
    width: 7px; height: 7px;
    background: #ef4444; border-radius: 50%;
    border: 1.5px solid #fff;
  }

  .nf-user {
    display: flex; align-items: center; gap: 0.6rem;
  }

  .nf-user-info { text-align: right; }
  .nf-user-name { font-size: 0.83rem; font-weight: 600; color: #111827; }
  .nf-user-role { font-size: 0.72rem; color: #9ca3af; }

  .nf-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, #a5b4fc, #818cf8);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; font-weight: 700; color: #fff;
  }

  /* CONTENT */
  .nf-content {
    flex: 1; padding: 1.8rem; overflow-y: auto;
  }

  .nf-page-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.6rem; }
  .nf-page-sub { font-size: 0.85rem; color: #6b7280; margin-top: 0.25rem; margin-bottom: 1.5rem; }

  /* STAT CARDS */
  .nf-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.3rem;
  }

  .nf-stat-card {
    background: #fff;
    border-radius: 14px;
    padding: 1.2rem 1.4rem;
    position: relative;
    border: 1px solid #eef0f5;
  }

  .nf-stat-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 0.9rem;
  }

  .nf-stat-icon-wrap {
    width: 40px; height: 40px;
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
  }

  .nf-stat-icon-wrap.blue { background: #eff3ff; }
  .nf-stat-icon-wrap.teal { background: #f0fdf4; }
  .nf-stat-icon-wrap.violet { background: #f5f3ff; }

  .nf-stat-badge {
    font-size: 0.72rem; font-weight: 600; padding: 0.2rem 0.5rem;
    border-radius: 6px;
  }
  .nf-stat-badge.green { background: #dcfce7; color: #16a34a; }
  .nf-stat-badge.active { background: #eff6ff; color: #1d4ed8; }

  .nf-stat-label {
    font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: #9ca3af; font-weight: 600; margin-bottom: 0.35rem;
  }

  .nf-stat-value {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 1.9rem; color: #111827; line-height: 1;
  }

  .nf-stat-value-row { display: flex; align-items: baseline; gap: 0.4rem; }
  .nf-stat-uptime { font-size: 0.85rem; color: #6b7280; font-weight: 400; }

  /* LOWER GRID */
  .nf-lower {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 1rem;
  }

  /* PROJECT STATUS */
  .nf-status-card {
    background: #fff;
    border-radius: 14px;
    padding: 1.4rem;
    border: 1px solid #eef0f5;
    display: flex; flex-direction: column; gap: 0;
  }

  .nf-section-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 1rem; margin-bottom: 1.2rem;
  }

  .nf-progress-row { margin-bottom: 1rem; }
  .nf-progress-header {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.82rem; margin-bottom: 0.4rem;
  }
  .nf-progress-label { color: #374151; font-weight: 500; }
  .nf-progress-pct { font-weight: 700; color: #1d4ed8; }
  .nf-progress-pct.gray { color: #9ca3af; }

  .nf-progress-track {
    height: 7px; background: #f0f2f7; border-radius: 99px; overflow: hidden;
  }
  .nf-progress-fill {
    height: 100%; border-radius: 99px;
    transition: width 0.6s ease;
  }
  .nf-progress-fill.blue { background: #1d4ed8; }
  .nf-progress-fill.light-blue { background: #93c5fd; }
  .nf-progress-fill.gray { background: #d1d5db; }

  .nf-stat-legend {
    display: flex; gap: 1rem; margin-top: 0.5rem; margin-bottom: 1rem;
    font-size: 0.78rem; color: #6b7280;
  }
  .nf-legend-dot {
    width: 9px; height: 9px; border-radius: 50%; display: inline-block; margin-right: 0.3rem;
  }

  /* PULSE CARD */
  .nf-pulse-card {
    background: #1d4ed8;
    border-radius: 14px;
    padding: 1.4rem;
    color: #fff;
    position: relative;
    overflow: hidden;
  }

  .nf-pulse-card::before {
    content: '';
    position: absolute;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,0.07);
    bottom: -50px; right: -30px;
  }

  .nf-pulse-label {
    font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.6); font-weight: 600; margin-bottom: 0.4rem;
  }

  .nf-pulse-title {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.15rem;
    margin-bottom: 0.7rem;
  }

  .nf-pulse-desc {
    font-size: 0.8rem; color: rgba(255,255,255,0.75); line-height: 1.55;
    margin-bottom: 1rem;
  }

  .nf-pulse-btn {
    padding: 0.45rem 0.9rem;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 8px;
    color: #fff; font-size: 0.78rem; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
    z-index: 1; position: relative;
  }
  .nf-pulse-btn:hover { background: rgba(255,255,255,0.25); }

  /* RECENT PROJECTS TABLE */
  .nf-projects-card {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #eef0f5;
    overflow: hidden;
  }

  .nf-projects-header {
    padding: 1.2rem 1.4rem 0.8rem;
    display: flex; justify-content: space-between; align-items: flex-start;
    border-bottom: 1px solid #f3f4f6;
  }

  .nf-projects-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; }
  .nf-projects-sub { font-size: 0.75rem; color: #9ca3af; margin-top: 0.15rem; }

  .nf-filter-icon { color: #9ca3af; font-size: 1rem; cursor: pointer; padding: 0.3rem; }
  .nf-filter-icon:hover { color: #374151; }

  .nf-table { width: 100%; border-collapse: collapse; }

  .nf-table th {
    padding: 0.65rem 1rem;
    font-size: 0.68rem; letter-spacing: 0.09em; text-transform: uppercase;
    color: #9ca3af; font-weight: 600; text-align: left;
    background: #fafbfd;
    border-bottom: 1px solid #f0f2f7;
  }

  .nf-table td {
    padding: 0.85rem 1rem;
    font-size: 0.83rem;
    border-bottom: 1px solid #f7f8fb;
    vertical-align: middle;
  }

  .nf-table tr:last-child td { border-bottom: none; }
  .nf-table tbody tr:hover td { background: #fafbfd; }

  .nf-client-cell { display: flex; align-items: center; gap: 0.6rem; }

  .nf-client-avatar {
    width: 30px; height: 30px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.68rem; font-weight: 700; color: #fff;
    flex-shrink: 0;
  }

  .nf-client-name { font-weight: 600; font-size: 0.83rem; }

  .nf-status-pill {
    display: inline-block;
    padding: 0.22rem 0.6rem;
    border-radius: 6px;
    font-size: 0.72rem; font-weight: 600;
  }
  .nf-status-pill.started { background: #eff6ff; color: #1d4ed8; }
  .nf-status-pill.completed { background: #dcfce7; color: #16a34a; }
  .nf-status-pill.in-progress { background: #fef9c3; color: #a16207; }

  .nf-deadline { font-size: 0.8rem; color: #374151; }
  .nf-deadline.urgent { color: #ef4444; font-weight: 600; }

  .nf-urgent-badge {
    display: inline-block;
    background: #fef2f2; color: #dc2626;
    font-size: 0.6rem; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: 0.1rem 0.35rem; border-radius: 4px;
    margin-top: 0.15rem;
  }

  .nf-critical-badge {
    display: inline-block;
    background: #fff7ed; color: #c2410c;
    font-size: 0.6rem; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: 0.1rem 0.35rem; border-radius: 4px;
    margin-top: 0.15rem;
  }

  .nf-view-all {
    padding: 0.9rem 1rem;
    text-align: center;
    border-top: 1px solid #f0f2f7;
    font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em;
    color: #1d4ed8; text-transform: uppercase;
    cursor: pointer; transition: background 0.15s;
  }
  .nf-view-all:hover { background: #eff3ff; }

  /* STATUS CARD LAYOUT FIX */
  .nf-left-col { display: flex; flex-direction: column; gap: 1rem; }

  @media (max-width: 900px) {
    .nf-lower { grid-template-columns: 1fr; }
    .nf-stats { grid-template-columns: 1fr 1fr; }
    .nf-sidebar { width: 60px; min-width: 60px; }
    .nf-brand-text, .nf-nav-item span, .nf-brand-name, .nf-brand-sub { display: none; }
    .nf-create-btn { font-size: 0; padding: 0.65rem; }
  }
`;

const avatarColors = ["#1d4ed8","#7c3aed","#0891b2","#059669","#d97706","#dc2626"];

const projects = [
  { initials: "SV", name: "Skyline Ventures", project: "Financial Pipeline v2", status: "started", deadline: "Tomorrow", urgent: "URGENT", color: avatarColors[0] },
  { initials: "HM", name: "Harbor Med", project: "Compliance Sync Engine", status: "completed", deadline: "May 12, 2024", color: avatarColors[2] },
  { initials: "QL", name: "Quantum Labs", project: "Inventory Auto-Sort", status: "in-progress", deadline: "In 2 days", critical: "CRITICAL", color: avatarColors[1] },
  { initials: "AT", name: "Apex Tech", project: "Legacy Data Migration", status: "in-progress", deadline: "Jun 04, 2024", color: avatarColors[4] },
  { initials: "NV", name: "Nova Retail", project: "Dynamic Pricing Bot", status: "started", deadline: "Jun 18, 2024", color: avatarColors[5] },
];

const statusLabel = { started: "Started", completed: "Completed", "in-progress": "In Progress" };

export default function NexaFlowDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const navigate = useNavigate();

  const navItems = [
    { icon: "dashboard", label: "Dashboard" },
    { icon: "groups", label: "Clients" },
    { icon: "folder", label: "Projects" },
    { icon: "description", label: "Documents" },
    { icon: "chat", label: "Communication" },
    ];

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
                className={`nf-nav-item${activeNav === label ? " active" : ""}`}
                onClick={() => {
                    setActiveNav(label);

                    if (label === "Clients") {
                        navigate("/client"); // 🚀 redirect
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
            <button className="nf-create-btn">+ Create Project</button>
            <button className="nf-nav-bottom-item">⚙️ <span>Settings</span></button>
            <button className="nf-nav-bottom-item">❓ <span>Support</span></button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="nf-main">
          {/* TOPBAR */}
          <header className="nf-topbar">
            <div className="nf-search">
              <span className="nf-search-icon">🔍</span>
              <input placeholder="Search automation workflows, projects, or clients..." />
            </div>
            <div className="nf-topbar-actions">
              <div className="nf-icon-btn">❓</div>
              <div className="nf-icon-btn">
                🔔
                <span className="nf-notif-dot" />
              </div>
              <div className="nf-user">
                <div className="nf-user-info">
                  <div className="nf-user-name">Alex Rivera</div>
                  <div className="nf-user-role">Administrator</div>
                </div>
                <div className="nf-avatar">AR</div>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="nf-content">
            <div className="nf-page-title">Dashboard</div>
            <div className="nf-page-sub">Welcome back, Alex. Here is what's happening with your automation suite today.</div>

            {/* STAT CARDS */}
            <div className="nf-stats">
              <div className="nf-stat-card">
                <div className="nf-stat-top">
                  <div className="nf-stat-icon-wrap blue">👥</div>
                  <span className="nf-stat-badge green">+12%</span>
                </div>
                <div className="nf-stat-label">Total Clients</div>
                <div className="nf-stat-value">1,284</div>
              </div>

              <div className="nf-stat-card">
                <div className="nf-stat-top">
                  <div className="nf-stat-icon-wrap teal">📁</div>
                  <span className="nf-stat-badge green">+4%</span>
                </div>
                <div className="nf-stat-label">Total Projects</div>
                <div className="nf-stat-value">432</div>
              </div>

              <div className="nf-stat-card">
                <div className="nf-stat-top">
                  <div className="nf-stat-icon-wrap violet">⚡</div>
                  <span className="nf-stat-badge active">Active</span>
                </div>
                <div className="nf-stat-label">Recent Automation Activity</div>
                <div className="nf-stat-value-row">
                  <span className="nf-stat-value">98.2%</span>
                  <span className="nf-stat-uptime">Uptime</span>
                </div>
              </div>
            </div>

            {/* LOWER GRID */}
            <div className="nf-lower">
              {/* LEFT COL */}
              <div className="nf-left-col">
                <div className="nf-status-card">
                  <div className="nf-section-title">Project Status</div>

                  {[
                    { label: "Completed", pct: 65, cls: "blue", pctCls: "" },
                    { label: "In Progress", pct: 25, cls: "light-blue", pctCls: "gray" },
                    { label: "Started", pct: 10, cls: "gray", pctCls: "gray" },
                  ].map(({ label, pct, cls, pctCls }) => (
                    <div className="nf-progress-row" key={label}>
                      <div className="nf-progress-header">
                        <span className="nf-progress-label">{label}</span>
                        <span className={`nf-progress-pct${pctCls ? " " + pctCls : ""}`}>{pct}%</span>
                      </div>
                      <div className="nf-progress-track">
                        <div className={`nf-progress-fill ${cls}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}

                  <div className="nf-stat-legend">
                    <span><span className="nf-legend-dot" style={{ background: "#1d4ed8" }} />281 Done</span>
                    <span><span className="nf-legend-dot" style={{ background: "#93c5fd" }} />108 Flow</span>
                  </div>
                </div>

                {/* PULSE */}
                <div className="nf-pulse-card">
                  <div className="nf-pulse-label">System Pulse</div>
                  <div className="nf-pulse-title">Automation Healthy</div>
                  <div className="nf-pulse-desc">
                    All 48 scheduled workflows executed successfully in the last 24 hours without bottlenecks.
                  </div>
                  <button className="nf-pulse-btn">View Logs</button>
                </div>
              </div>

              {/* PROJECTS TABLE */}
              <div className="nf-projects-card">
                <div className="nf-projects-header">
                  <div>
                    <div className="nf-projects-title">Recent Projects</div>
                    <div className="nf-projects-sub">Currently monitoring 432 active items</div>
                  </div>
                  <span className="nf-filter-icon">☰</span>
                </div>

                <table className="nf-table">
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Project Name</th>
                      <th>Status</th>
                      <th>Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.name}>
                        <td>
                          <div className="nf-client-cell">
                            <div className="nf-client-avatar" style={{ background: p.color }}>
                              {p.initials}
                            </div>
                            <span className="nf-client-name">{p.name}</span>
                          </div>
                        </td>
                        <td>{p.project}</td>
                        <td>
                          <span className={`nf-status-pill ${p.status}`}>
                            {statusLabel[p.status]}
                          </span>
                        </td>
                        <td>
                          <div className={`nf-deadline${p.urgent || p.critical ? " urgent" : ""}`}>
                            {p.deadline}
                          </div>
                          {p.urgent && <div className="nf-urgent-badge">{p.urgent}</div>}
                          {p.critical && <div className="nf-critical-badge">{p.critical}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="nf-view-all">View All Project Assets</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
