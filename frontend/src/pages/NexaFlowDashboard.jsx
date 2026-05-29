import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const styles = `
  .nf-app {
    display: flex;
    min-height: 100vh;
    background: #090d16;
    font-family: 'Inter', sans-serif;
    color: #f8fafc;
    position: relative;
    overflow: hidden;
  }
  
  /* ── SIDEBAR ── */
  .nf-sidebar {
    width: 260px;
    min-width: 260px;
    background: rgba(15, 23, 42, 0.6);
    border-right: 1px solid rgba(6, 182, 212, 0.15);
    display: flex;
    flex-direction: column;
    padding-bottom: 1.5rem;
    color: #cbd5e1;
    z-index: 10;
    backdrop-filter: blur(16px);
  }

  .nf-brand {
    padding: 1.5rem 1.5rem 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    border-bottom: 1px solid rgba(6, 182, 212, 0.15);
    margin-bottom: 1.5rem;
  }

  .nf-brand-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 1.1rem;
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);
  }

  .nf-brand-text { line-height: 1.1; }
  .nf-brand-name {
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: 1.15rem;
    color: #fff;
    letter-spacing: -0.01em;
  }
  .nf-brand-sub {
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    text-transform: uppercase;
    font-weight: 600;
  }

  .nf-nav { flex: 1; padding: 0 0.8rem; }

  .nf-nav-item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 0.3rem;
    border: none; background: none; width: 100%; text-align: left;
    font-family: 'Inter', sans-serif;
  }

  .nf-nav-item:hover { 
    background: rgba(6, 182, 212, 0.08); 
    color: #fff; 
    transform: translateX(4px);
  }
  
  .nf-nav-item.active { 
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%); 
    color: var(--accent-cyan); 
    font-weight: 700; 
    border-left: 3px solid var(--accent-cyan);
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  .nf-nav-item.active .nf-nav-icon { color: var(--accent-cyan); }

  .nf-nav-icon { font-size: 1.2rem; width: 20px; text-align: center; color: var(--text-muted); }

  .nf-sidebar-bottom {
    padding: 0 0.8rem;
    border-top: 1px solid rgba(6, 182, 212, 0.15);
    padding-top: 1.2rem;
  }

  .nf-create-btn {
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    margin-bottom: 0.8rem;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);
  }
  .nf-create-btn:hover { 
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
  }

  /* ── MAIN ── */
  .nf-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  /* TOPBAR */
  .nf-topbar {
    background: rgba(15, 23, 42, 0.4);
    border-bottom: 1px solid rgba(6, 182, 212, 0.15);
    padding: 0.75rem 2.2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    backdrop-filter: blur(8px);
  }

  .nf-topbar-actions {
    display: flex; align-items: center; gap: 1.2rem; margin-left: auto;
  }

  .nf-user {
    display: flex; align-items: center; gap: 0.8rem;
  }

  .nf-user-info { text-align: right; }
  .nf-user-name { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
  .nf-user-role { font-size: 0.72rem; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }

  .nf-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan));
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; font-weight: 700; color: #fff;
    box-shadow: 0 4px 10px rgba(6, 182, 212, 0.3);
  }

  /* CONTENT */
  .nf-content {
    flex: 1; padding: 2rem 2.2rem; overflow-y: auto;
  }

  .nf-page-title { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 2rem; letter-spacing: -0.02em; }
  .nf-page-sub { font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.3rem; margin-bottom: 2rem; }

  /* STAT CARDS */
  .nf-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .nf-stat-card {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(6, 182, 212, 0.15);
    border-radius: 16px;
    padding: 1.4rem 1.6rem;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .nf-stat-card:hover {
    transform: translateY(-6px);
    border-color: rgba(6, 182, 212, 0.4);
    box-shadow: 0 12px 25px rgba(6, 182, 212, 0.1);
  }

  .nf-stat-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 1rem;
  }

  .nf-stat-icon-wrap {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.25rem;
  }
  .nf-stat-icon-wrap.cyan   { background: rgba(6, 182, 212, 0.1); color: var(--accent-cyan); }
  .nf-stat-icon-wrap.blue   { background: rgba(59, 130, 246, 0.1); color: var(--accent-blue); }
  .nf-stat-icon-wrap.violet { background: rgba(124, 58, 237, 0.1); color: #7c3aed; }

  .nf-stat-label {
    font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--text-secondary); font-weight: 700; margin-bottom: 0.4rem;
  }

  .nf-stat-value {
    font-family: 'Outfit', sans-serif; font-weight: 800;
    font-size: 2.1rem; color: var(--text-primary); line-height: 1;
    letter-spacing: -0.02em;
  }

  /* LOWER GRID */
  .nf-lower {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 1.5rem;
  }

  .nf-projects-card {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(6, 182, 212, 0.15);
    border-radius: 16px;
    overflow: hidden;
  }

  .nf-projects-header {
    padding: 1.4rem 1.6rem;
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid rgba(6, 182, 212, 0.15);
  }

  .nf-projects-title { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 1.1rem; }
  .nf-projects-sub   { font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem; }

  .nf-table { width: 100%; border-collapse: collapse; }
  .nf-table th {
    padding: 0.9rem 1.2rem;
    font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--text-secondary); font-weight: 700; text-align: left;
    background: rgba(15, 23, 42, 0.8);
    border-bottom: 1px solid rgba(6, 182, 212, 0.15);
  }
  .nf-table td {
    padding: 1rem 1.2rem;
    font-size: 0.88rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  .nf-table tr:hover td { background: rgba(6, 182, 212, 0.05); }

  .nf-status-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: 30px;
    font-size: 0.75rem; font-weight: 700;
  }
  .nf-status-pill.Started     { background: rgba(59, 130, 246, 0.15); color: var(--accent-blue); }
  .nf-status-pill.Completed   { background: rgba(16, 185, 129, 0.15); color: var(--success); }
  .nf-status-pill.InProgress  { background: rgba(245, 158, 11, 0.15); color: var(--warning); }

  /* notification panel */
  .nf-notif-panel {
    background: rgba(15, 23, 42, 0.55);
    border: 1px solid rgba(6, 182, 212, 0.15);
    border-radius: 16px;
    padding: 1.2rem;
    margin-bottom: 1.5rem;
  }
  .nf-notif-title {
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--accent-cyan);
    margin-bottom: 0.8rem;
    display: flex; align-items: center; gap: 0.4rem;
  }
  .nf-notif-item {
    font-size: 0.82rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    color: var(--text-secondary);
  }
  .nf-notif-item:last-child { border-bottom: none; }
`;

const COLORS = ["#3b82f6", "#06b6d4", "#10b981"];

const navItems = [
  { icon: "dashboard",   label: "Dashboard" },
  { icon: "groups",      label: "Clients" },
  { icon: "folder",      label: "Projects" },
  { icon: "assignment",  label: "Tasks" },
  { icon: "payments",    label: "Finances" },
  { icon: "description", label: "Documents" },
  { icon: "chat",        label: "Communication" },
  { icon: "smart_toy",   label: "NexaAI" }
];

export default function NexaFlowDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [totalClients, setTotalClients] = useState(null);
  const [statusCounts, setStatusCounts] = useState({
    Started: 0, "In Progress": 0, Completed: 0
  });
  const [notifications, setNotifications] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch me
      const meRes = await fetch("http://127.0.0.1:8000/api/dashboard/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.data);
      }

      // Fetch projects
      const res = await fetch("http://127.0.0.1:8000/api/dashboard/get-projects", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && data.data) {
        const allProjects = data.data;
        setProjects(allProjects);

        const uniqueClients = new Set(allProjects.map((p) => p.client_name).filter(Boolean));
        setTotalClients(uniqueClients.size);

        const counts = { Started: 0, "In Progress": 0, Completed: 0 };
        allProjects.forEach((p) => {
          if (counts[p.status] !== undefined) counts[p.status]++;
        });
        setStatusCounts(counts);
      }

      // Fetch activity logs for the live feed
      const logsRes = await fetch("http://127.0.0.1:8000/api/dashboard/activity-logs", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        if (logsData.data) {
          const formattedLogs = logsData.data.map(log => `${log.user_name}: ${log.action}`);
          setNotifications(formattedLogs.slice(0, 5));
        }
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
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

    fetchDashboardData();

    // WS updates
    const ws = new WebSocket("ws://127.0.0.1:8000/api/dashboard/ws/updates");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.message) {
        setNotifications((prev) => [msg.message, ...prev.slice(0, 4)]);
      }
      fetchDashboardData();
    };

    return () => ws.close();
  }, []);

  const totalProjects = projects.length;
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.deadline) - new Date(a.deadline))
    .slice(0, 5);

  const totalPipeline = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const formattedPipeline = totalPipeline.toLocaleString("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  });

  const pieData = [
    { name: "Started", value: statusCounts.Started },
    { name: "In Progress", value: statusCounts["In Progress"] },
    { name: "Completed", value: statusCounts.Completed }
  ];

  const barData = projects.slice(0, 6).map(p => ({
    name: p.project_name.substring(0, 10),
    budget: p.budget || 0
  }));

  return (
    <>
      <style>{styles}</style>
      <div className="nf-app">
        {/* Animated Orbs */}
        <div className="nf-orb nf-orb-cyan" />
        <div className="nf-orb nf-orb-blue" />

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
                className={`nf-nav-item${label === "Dashboard" ? " active" : ""}`}
                onClick={() => {
                  if (label === "Clients")       navigate("/client");
                  if (label === "Dashboard")     navigate("/dashboard");
                  if (label === "Projects")      navigate("/projects");
                  if (label === "Tasks")         navigate("/tasks");
                  if (label === "Finances")      navigate("/finances");
                  if (label === "Documents")     navigate("/documents");
                  if (label === "Communication") navigate("/communication");
                  if (label === "NexaAI")        navigate("/nexaAI");
                }}
              >
                <span className="material-symbols-outlined nf-nav-icon">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="nf-sidebar-bottom">
            <button className="nf-create-btn" onClick={() => navigate("/client")}>
              + Onboard Client
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="nf-main">
          {/* TOPBAR */}
          <header className="nf-topbar">
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-cyan)" }}>
              SYSTEM ONLINE
            </div>
            <div className="nf-topbar-actions">
              <div className="nf-user">
                <div className="nf-user-info">
                  <div className="nf-user-name">{currentUser?.name || "Loading..."}</div>
                  <div className="nf-user-role">{currentUser?.role || "Employee"}</div>
                </div>
                <div className="nf-avatar">
                  {currentUser?.name?.substring(0, 2).toUpperCase() || "NF"}
                </div>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="nf-content">
            <div className="nf-page-title">Operational Dashboard</div>
            <p className="nf-page-sub">Real-time analytical view of Zeptrix internal business parameters.</p>

            {/* Live Notifications Feed */}
            <div className="nf-notif-panel">
              <div className="nf-notif-title">
                <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>sensors</span>
                Live Activity Broadcast Feed
              </div>
              <div>
                {notifications.map((n, i) => (
                  <div className="nf-notif-item" key={i}>• {n}</div>
                ))}
              </div>
            </div>

            {/* Stat Cards */}
            <div className="nf-stats">
              <div className="nf-stat-card">
                <div className="nf-stat-top">
                  <div className="nf-stat-icon-wrap cyan"><span className="material-symbols-outlined">groups</span></div>
                </div>
                <div className="nf-stat-label">Onboarded Clients</div>
                <div className="nf-stat-value">{loading ? "—" : totalClients}</div>
              </div>
              <div className="nf-stat-card">
                <div className="nf-stat-top">
                  <div className="nf-stat-icon-wrap blue"><span className="material-symbols-outlined">folder</span></div>
                </div>
                <div className="nf-stat-label">Active Workflows</div>
                <div className="nf-stat-value">{loading ? "—" : totalProjects}</div>
              </div>
              <div className="nf-stat-card">
                <div className="nf-stat-top">
                  <div className="nf-stat-icon-wrap violet"><span className="material-symbols-outlined">payments</span></div>
                </div>
                <div className="nf-stat-label">Gross Value Pipeline</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, marginTop: "0.5rem" }}>
                  {loading ? "—" : formattedPipeline}
                </div>
              </div>
            </div>

            {/* Charts & Graphs Grid */}
            <div className="nf-lower" style={{ marginBottom: "2rem" }}>
              {/* Project Status Breakdown (PieChart) */}
              <div className="nf-glass-card" style={{ height: "340px" }}>
                <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", marginBottom: "1rem" }}>Project Status Breakdown</h2>
                {loading ? (
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}>Loading...</div>
                ) : (
                  <div style={{ width: "100%", height: "230px" }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid var(--accent-cyan)" }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Project Budgets Comparison (BarChart) */}
              <div className="nf-glass-card" style={{ height: "340px" }}>
                <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", marginBottom: "1rem" }}>Project Budgets (₹)</h2>
                {loading ? (
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}>Loading...</div>
                ) : (
                  <div style={{ width: "100%", height: "230px" }}>
                    <ResponsiveContainer>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                        <YAxis stroke="var(--text-muted)" fontSize={11} />
                        <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid var(--accent-cyan)" }} />
                        <Bar dataKey="budget" fill="var(--accent-cyan)">
                          {barData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "var(--accent-cyan)" : "var(--accent-blue)"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Workflows Table */}
            <div className="nf-projects-card">
              <div className="nf-projects-header">
                <div>
                  <div className="nf-projects-title">Active Operational Pipelines</div>
                  <div className="nf-projects-sub">Showing status details and deadlines.</div>
                </div>
              </div>
              <table className="nf-table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Project name</th>
                    <th>Status</th>
                    <th>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={4} style={{ textAlign: "center" }}>Loading pipelines...</td></tr>
                  ) : projects.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: "center" }}>No active projects.</td></tr>
                  ) : (
                    recentProjects.map((p) => (
                      <tr key={p.project_id}>
                        <td style={{ fontWeight: 600 }}>{p.client_name}</td>
                        <td>{p.project_name}</td>
                        <td>
                          <span className={`nf-status-pill ${p.status.replace(" ", "")}`}>
                            {p.status}
                          </span>
                        </td>
                        <td>{p.deadline}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </main>
        </div>
      </div>
    </>
  );
}