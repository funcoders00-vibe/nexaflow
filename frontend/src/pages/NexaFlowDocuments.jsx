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
  .nf-main { flex: 1; display: flex; flex-direction: column; }

  /* TOPBAR */
  .nf-topbar {
    background: #fff; border-bottom: 1px solid #e9ebf0;
    padding: 0.65rem 1.5rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .nf-search { flex: 1; max-width: 300px; position: relative; }
  .nf-search input {
    width: 100%; padding: 0.44rem 0.85rem 0.44rem 2rem;
    border: 1.5px solid #e5e7eb; border-radius: 9px;
    background: #f7f8fb; font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem; color: #374151; outline: none; transition: border-color 0.15s;
  }
  .nf-search input:focus { border-color: #1d4ed8; background: #fff; }
  .nf-search input::placeholder { color: #b0b7c3; }
  .nf-search-icon { position: absolute; left: 0.65rem; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 0.78rem; pointer-events: none; }

  .nf-topbar-actions { display: flex; align-items: center; gap: 0.8rem; margin-left: auto; }
  .nf-icon-btn {
    width: 31px; height: 31px; border-radius: 50%;
    border: 1.5px solid #e5e7eb; background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6b7280; font-size: 0.85rem; transition: border-color 0.15s;
  }
  .nf-icon-btn:hover { border-color: #1d4ed8; }
  .nf-user { display: flex; align-items: center; gap: 0.5rem; }
  .nf-user-info { text-align: right; }
  .nf-user-name { font-size: 0.8rem; font-weight: 600; color: #111827; }
  .nf-user-role { font-size: 0.65rem; color: #9ca3af; letter-spacing: 0.04em; text-transform: uppercase; }
  .nf-avatar { width: 31px; height: 31px; border-radius: 50%; background: #1a1f2e; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; color: #fff; }

  /* CONTENT */
  .nf-content {
    flex: 1; padding: 1.3rem 1.5rem 1.5rem;
    overflow-y: auto;
    border: 1.5px dashed #c7d2e8;
    margin: 0.6rem;
    border-radius: 10px;
    background: #fff;
  }

  /* BREADCRUMB */
  .nf-breadcrumb {
    display: flex; align-items: center; gap: 0.3rem;
    font-size: 0.7rem; color: #9ca3af; margin-bottom: 0.5rem;
    text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;
  }
  .nf-breadcrumb span { cursor: pointer; }
  .nf-breadcrumb span:hover { color: #1d4ed8; }
  .nf-breadcrumb-active { color: #1d4ed8 !important; }
  .nf-breadcrumb-sep { color: #d1d5db; }

  /* PAGE HEADER */
  .nf-doc-header { margin-bottom: 0.9rem; }
  .nf-doc-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.6rem; color: #111827; margin-bottom: 0.5rem; }

  .nf-doc-meta { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.8rem; }
  .nf-meta-badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.25rem 0.65rem; border-radius: 7px;
    font-size: 0.76rem; font-weight: 500;
  }
  .nf-meta-badge.client { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
  .nf-meta-badge.date   { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }

  .nf-doc-actions { display: flex; align-items: center; gap: 0.6rem; margin-left: auto; }
  .nf-save-btn {
    display: flex; align-items: center; gap: 0.35rem;
    padding: 0.45rem 0.9rem; border: 1.5px solid #e5e7eb;
    border-radius: 9px; background: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
    color: #374151; cursor: pointer; font-weight: 500; transition: border-color 0.15s;
  }
  .nf-save-btn:hover { border-color: #1d4ed8; color: #1d4ed8; }
  .nf-download-btn {
    display: flex; align-items: center; gap: 0.35rem;
    padding: 0.45rem 0.9rem; background: #1d4ed8; color: #fff;
    border: none; border-radius: 9px; font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 0.8rem; cursor: pointer; transition: background 0.15s;
  }
  .nf-download-btn:hover { background: #1a44c2; }

  .nf-header-row { display: flex; align-items: flex-start; justify-content: space-between; }

  /* TABS */
  .nf-tabs { display: flex; gap: 0; border-bottom: 1.5px solid #e9ebf0; margin-bottom: 1rem; }
  .nf-tab {
    padding: 0.55rem 1.1rem; font-size: 0.82rem; font-weight: 500;
    color: #9ca3af; cursor: pointer; border: none; background: none;
    border-bottom: 2.5px solid transparent; margin-bottom: -1.5px;
    transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .nf-tab.active { color: #1d4ed8; border-bottom-color: #1d4ed8; font-weight: 600; }
  .nf-tab:hover:not(.active) { color: #374151; }

  /* TWO-COL LAYOUT */
  .nf-doc-layout { display: grid; grid-template-columns: 1fr 220px; gap: 1.2rem; align-items: start; }

  /* DOCUMENT PREVIEW */
  .nf-doc-preview {
    border: 1px solid #e9ebf0; border-radius: 10px; overflow: hidden;
    background: #fff;
  }

  .nf-agreement-header {
    padding: 1.5rem 2rem 1rem;
    display: flex; align-items: flex-start; justify-content: space-between;
    border-bottom: 1px solid #f0f2f7;
  }
  .nf-agreement-logo {
    width: 52px; height: 52px; background: #1d4ed8; border-radius: 8px; flex-shrink: 0;
  }
  .nf-agreement-title-block { text-align: right; }
  .nf-agreement-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.05rem; }
  .nf-agreement-ref { font-size: 0.72rem; color: #9ca3af; margin-top: 0.2rem; }

  .nf-agreement-body { padding: 1.2rem 2rem; }

  .nf-parties { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.2rem; }
  .nf-party-label { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #9ca3af; margin-bottom: 0.3rem; }
  .nf-party-name { font-weight: 700; font-size: 0.85rem; color: #111827; margin-bottom: 0.15rem; }
  .nf-party-addr { font-size: 0.76rem; color: #6b7280; line-height: 1.55; }

  .nf-section-heading { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.9rem; margin: 1rem 0 0.5rem; }
  .nf-section-text { font-size: 0.79rem; color: #374151; line-height: 1.65; margin-bottom: 0.8rem; }

  .nf-deliverable-list { list-style: none; margin-bottom: 1rem; }
  .nf-deliverable-list li {
    display: flex; align-items: flex-start; gap: 0.5rem;
    font-size: 0.79rem; color: #374151; line-height: 1.55; margin-bottom: 0.45rem;
  }
  .nf-bullet { width: 6px; height: 6px; border-radius: 50%; background: #1d4ed8; flex-shrink: 0; margin-top: 0.4rem; }

  .nf-fin-table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
  .nf-fin-table th {
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase;
    color: #9ca3af; text-align: left; padding: 0.4rem 0;
    border-bottom: 1px solid #f0f2f7;
  }
  .nf-fin-table th:last-child { text-align: right; }
  .nf-fin-table td { font-size: 0.8rem; color: #374151; padding: 0.55rem 0; border-bottom: 1px solid #f7f8fb; }
  .nf-fin-table td:last-child { text-align: right; font-weight: 500; }
  .nf-fin-table tr:last-child td { border-bottom: none; }

  .nf-agreement-footer {
    background: #1a1f2e; padding: 1rem 2rem;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .nf-sig-label { font-size: 0.62rem; letter-spacing: 0.09em; text-transform: uppercase; color: #6b7280; font-weight: 600; }

  /* RIGHT PANEL */
  .nf-right-panel { display: flex; flex-direction: column; gap: 0.8rem; }

  .nf-panel-card { background: #f7f8fb; border: 1px solid #e9ebf0; border-radius: 11px; padding: 1rem; }

  .nf-panel-title { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #374151; margin-bottom: 0.7rem; }

  .nf-action-btn {
    display: flex; align-items: center; gap: 0.5rem;
    width: 100%; padding: 0.6rem 0.8rem;
    border: 1.5px solid #e5e7eb; border-radius: 9px; background: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
    color: #374151; cursor: pointer; font-weight: 500; text-align: left;
    transition: border-color 0.15s; margin-bottom: 0.5rem;
  }
  .nf-action-btn:last-child { margin-bottom: 0; }
  .nf-action-btn:hover { border-color: #1d4ed8; color: #1d4ed8; }
  .nf-action-icon { font-size: 0.85rem; }

  /* INVOICE DETAILS */
  .nf-inv-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.7rem; }
  .nf-draft-badge { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 5px; letter-spacing: 0.06em; text-transform: uppercase; }

  .nf-inv-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem; }
  .nf-inv-label { font-size: 0.75rem; color: #6b7280; }
  .nf-inv-val   { font-size: 0.75rem; color: #374151; font-weight: 500; }
  .nf-inv-divider { border: none; border-top: 1px solid #e9ebf0; margin: 0.5rem 0; }
  .nf-inv-total-label { font-size: 0.78rem; font-weight: 700; color: #111827; }
  .nf-inv-total-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem; color: #1d4ed8; }

  /* INTERNAL ACCESS */
  .nf-access-avatars { display: flex; align-items: center; margin-bottom: 0.55rem; }
  .nf-access-avatar {
    width: 26px; height: 26px; border-radius: 50%; border: 2px solid #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.6rem; font-weight: 700; color: #fff; margin-right: -6px;
  }
  .nf-access-more { width: 26px; height: 26px; border-radius: 50%; background: #e5e7eb; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; font-weight: 700; color: #6b7280; }
  .nf-access-edited { font-size: 0.72rem; color: #9ca3af; display: flex; align-items: center; gap: 0.3rem; margin-top: 0.4rem; }
  .nf-edit-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; }

  /* AI SUGGESTION */
  .nf-ai-card { background: #eff3ff; border: 1px solid #c7d2fe; border-radius: 11px; padding: 0.9rem; }
  .nf-ai-label { font-size: 0.63rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #4f46e5; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.3rem; }
  .nf-ai-text { font-size: 0.76rem; color: #374151; line-height: 1.6; font-style: italic; margin-bottom: 0.7rem; }
  .nf-ai-text strong { font-style: normal; color: #111827; }
  .nf-apply-btn {
    width: 100%; padding: 0.5rem; background: #1d4ed8; color: #fff;
    border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif;
    font-size: 0.77rem; font-weight: 700; cursor: pointer; text-transform: uppercase;
    letter-spacing: 0.05em; transition: background 0.15s;
  }
  .nf-apply-btn:hover { background: #1a44c2; }
`;
const navItems = [
  { icon: "dashboard", label: "Dashboard" },
  { icon: "groups", label: "Clients" },
  { icon: "folder", label: "Projects" },
  { icon: "description", label: "Documents" },
  { icon: "chat", label: "Communication" },
];

export default function NexaFlowDocuments() {
  const [activeNav, setActiveNav] = useState("Documents");
  const [activeTab, setActiveTab] = useState("agreement");
  const navigate = useNavigate();
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
            <button className="nf-create-btn">Create Project</button>
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
              <input placeholder="Search documents, invoices..." />
            </div>
            <div className="nf-topbar-actions">
              <div className="nf-icon-btn">🔔</div>
              <div className="nf-icon-btn">❓</div>
              <div className="nf-user">
                <div className="nf-user-info">
                  <div className="nf-user-name">Alex Sterling</div>
                  <div className="nf-user-role">Admin Account</div>
                </div>
                <div className="nf-avatar">AS</div>
              </div>
            </div>
          </header>

          {/* CONTENT (dashed border box) */}
          <main className="nf-content">
            {/* Breadcrumb */}
            <div className="nf-breadcrumb">
              <span>Projects</span>
              <span className="nf-breadcrumb-sep">›</span>
              <span>Design Phase</span>
              <span className="nf-breadcrumb-sep">›</span>
              <span className="nf-breadcrumb-active">Documents</span>
            </div>

            {/* Header Row */}
            <div className="nf-header-row" style={{ marginBottom: "0.7rem" }}>
              <div className="nf-doc-header">
                <div className="nf-doc-title">CloudScale Infrastructure</div>
                <div className="nf-doc-meta">
                  <span className="nf-meta-badge client">⭐ Starlight Ventures</span>
                  <span className="nf-meta-badge date">📅 Due Sept 14, 2024</span>
                </div>
              </div>
              <div className="nf-doc-actions">
                <button className="nf-save-btn">💾 Save Draft</button>
                <button className="nf-download-btn">⬇ Download PDF</button>
              </div>
            </div>

            {/* TABS */}
            <div className="nf-tabs">
              <button
                className={`nf-tab${activeTab === "agreement" ? " active" : ""}`}
                onClick={() => setActiveTab("agreement")}
              >
                Agreement Preview
              </button>
              <button
                className={`nf-tab${activeTab === "invoice" ? " active" : ""}`}
                onClick={() => setActiveTab("invoice")}
              >
                Invoice Preview
              </button>
            </div>

            {/* TWO-COL LAYOUT */}
            <div className="nf-doc-layout">
              {/* DOCUMENT PREVIEW */}
              <div className="nf-doc-preview">
                {/* Agreement header */}
                <div className="nf-agreement-header">
                  <div className="nf-agreement-logo" />
                  <div className="nf-agreement-title-block">
                    <div className="nf-agreement-title">Service Agreement</div>
                    <div className="nf-agreement-ref">Ref: NF-2024-8891</div>
                  </div>
                </div>

                {/* Body */}
                <div className="nf-agreement-body">
                  {/* Parties */}
                  <div className="nf-parties">
                    <div>
                      <div className="nf-party-label">Service Provider</div>
                      <div className="nf-party-name">NexaFlow Automation Suite</div>
                      <div className="nf-party-addr">122 Innovation Way<br />San Francisco, CA 94103</div>
                    </div>
                    <div>
                      <div className="nf-party-label">Prepared For</div>
                      <div className="nf-party-name">Starlight Ventures LLC</div>
                      <div className="nf-party-addr">450 Market St, Suite 101<br />Austin, TX 78701</div>
                    </div>
                  </div>

                  {/* Section 1 */}
                  <div className="nf-section-heading">1. Project Overview</div>
                  <div className="nf-section-text">
                    This agreement outlines the automated infrastructure deployment for CloudScale. NexaFlow will provide end-to-end orchestration, monitoring integration, and secure pipeline management for a period of 12 months starting from the commencement date.
                  </div>

                  {/* Section 2 */}
                  <div className="nf-section-heading">2. Deliverables</div>
                  <ul className="nf-deliverable-list">
                    <li><span className="nf-bullet" />Custom CI/CD Pipeline Automation with 99.9% uptime SLA.</li>
                    <li><span className="nf-bullet" />Multi-region database synchronization and failover orchestration.</li>
                    <li><span className="nf-bullet" />24/7 Priority Enterprise Support and Incident Response.</li>
                  </ul>

                  {/* Section 3 */}
                  <div className="nf-section-heading">3. Financial Summary</div>
                  <table className="nf-fin-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Core Orchestration License (Annual)</td>
                        <td>$12,000.00</td>
                      </tr>
                      <tr>
                        <td>Setup &amp; Integration Fee</td>
                        <td>$2,500.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer signature bar */}
                <div className="nf-agreement-footer">
                  <div className="nf-sig-label">Client Signature</div>
                  <div className="nf-sig-label">NexaFlow Executive</div>
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="nf-right-panel">
                {/* Document Actions */}
                <div className="nf-panel-card">
                  <div className="nf-panel-title">Document Actions</div>
                  <button className="nf-action-btn"><span className="nf-action-icon">✏️</span> Generate Agreement</button>
                  <button className="nf-action-btn"><span className="nf-action-icon">📄</span> Generate Invoice</button>
                </div>

                {/* Invoice Details */}
                <div className="nf-panel-card">
                  <div className="nf-inv-header">
                    <div className="nf-panel-title" style={{ marginBottom: 0 }}>Invoice Details</div>
                    <span className="nf-draft-badge">Draft</span>
                  </div>

                  <div className="nf-inv-row">
                    <span className="nf-inv-label">Invoice Number</span>
                    <span className="nf-inv-val">INV-2024-001</span>
                  </div>
                  <hr className="nf-inv-divider" />
                  <div className="nf-inv-row">
                    <span className="nf-inv-label">Base Cost</span>
                    <span className="nf-inv-val">$14,500.00</span>
                  </div>
                  <div className="nf-inv-row">
                    <span className="nf-inv-label">GST 18%</span>
                    <span className="nf-inv-val">$2,610.00</span>
                  </div>
                  <hr className="nf-inv-divider" />
                  <div className="nf-inv-row">
                    <span className="nf-inv-total-label">Total Amount</span>
                    <span className="nf-inv-total-val">$17,110.00</span>
                  </div>
                </div>

                {/* Internal Access */}
                <div className="nf-panel-card">
                  <div className="nf-panel-title">Internal Access</div>
                  <div className="nf-access-avatars">
                    {[["#1d4ed8","AR"],["#7c3aed","JD"],["#0891b2","KL"]].map(([bg, initials]) => (
                      <div key={initials} className="nf-access-avatar" style={{ background: bg }}>{initials}</div>
                    ))}
                    <div className="nf-access-more">+2</div>
                  </div>
                  <div className="nf-access-edited">
                    <span className="nf-edit-dot" />
                    Last edited by Alex&nbsp;<span style={{ color: "#b0b7c3" }}>2 hours ago</span>
                  </div>
                </div>

                {/* AI Suggestion */}
                <div className="nf-ai-card">
                  <div className="nf-ai-label">✦ Nexa AI Suggestion</div>
                  <div className="nf-ai-text">
                    "Your payment terms are set to Net-30. Based on Starlight Ventures' history, Net-15 might improve your cash flow by <strong>12%</strong>."
                  </div>
                  <button className="nf-apply-btn">Apply Smart Terms</button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
