import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
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
  .nf-main { flex: 1; display: flex; flex-direction: column; border: 1.5px dashed #c7d2e8; }

  /* TOPBAR */
  .nf-topbar {
    background: #fff; border-bottom: 1px solid #e9ebf0;
    padding: 0.7rem 1.8rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .nf-search { flex: 1; max-width: 320px; position: relative; }
  .nf-search input {
    width: 100%; padding: 0.46rem 0.9rem 0.46rem 2.1rem;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    background: #f7f8fb; font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; color: #374151; outline: none; transition: border-color 0.15s;
  }
  .nf-search input:focus { border-color: #1d4ed8; background: #fff; }
  .nf-search input::placeholder { color: #b0b7c3; }
  .nf-search-icon { position: absolute; left: 0.68rem; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 0.8rem; pointer-events: none; }

  .nf-topbar-actions { display: flex; align-items: center; gap: 0.85rem; margin-left: auto; }
  .nf-icon-btn {
    width: 33px; height: 33px; border-radius: 50%;
    border: 1.5px solid #e5e7eb; background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6b7280; font-size: 0.88rem; position: relative;
    transition: border-color 0.15s;
  }
  .nf-icon-btn:hover { border-color: #1d4ed8; }
  .nf-user { display: flex; align-items: center; gap: 0.55rem; }
  .nf-user-info { text-align: right; }
  .nf-user-name { font-size: 0.82rem; font-weight: 600; color: #111827; }
  .nf-user-role { font-size: 0.7rem; color: #9ca3af; }
  .nf-avatar { width: 33px; height: 33px; border-radius: 50%; background: linear-gradient(135deg,#a5b4fc,#818cf8); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: #fff; }

  /* CONTENT */
  .nf-content { flex: 1; padding: 1.6rem 2rem 2rem; overflow-y: auto; }

  .nf-overline { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.13em; color: #1d4ed8; text-transform: uppercase; margin-bottom: 0.3rem; }
  .nf-page-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.75rem; margin-bottom: 0.35rem; }
  .nf-page-sub { font-size: 0.84rem; color: #6b7280; line-height: 1.55; max-width: 500px; }

  /* FILTER ROW */
  .nf-filter-row {
    display: flex; align-items: center; gap: 0.75rem;
    margin: 1.4rem 0 0.9rem; flex-wrap: wrap;
  }

  .nf-filter-search { flex: 1; min-width: 200px; max-width: 360px; position: relative; }
  .nf-filter-search input {
    width: 100%; padding: 0.52rem 0.9rem 0.52rem 2.1rem;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    background: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 0.83rem; color: #374151; outline: none; transition: border-color 0.15s;
  }
  .nf-filter-search input:focus { border-color: #1d4ed8; }
  .nf-filter-search input::placeholder { color: #b0b7c3; }
  .nf-filter-search-icon { position: absolute; left: 0.7rem; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 0.8rem; pointer-events: none; }

  .nf-filter-group { display: flex; align-items: center; gap: 0.6rem; margin-left: auto; }

  .nf-select-wrap { position: relative; }
  .nf-select-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #9ca3af; display: block; margin-bottom: 0.2rem; }
  .nf-select {
    appearance: none; padding: 0.46rem 2rem 0.46rem 0.8rem;
    border: 1.5px solid #e5e7eb; border-radius: 9px;
    background: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; color: #374151; cursor: pointer; outline: none;
    transition: border-color 0.15s; min-width: 120px;
  }
  .nf-select:focus { border-color: #1d4ed8; }
  .nf-select-chevron { position: absolute; right: 0.6rem; bottom: 0.55rem; color: #9ca3af; font-size: 0.65rem; pointer-events: none; }

  .nf-filter-icon-btn {
    width: 35px; height: 35px; border: 1.5px solid #e5e7eb;
    border-radius: 9px; background: #fff; display: flex;
    align-items: center; justify-content: center; cursor: pointer;
    color: #6b7280; font-size: 0.9rem; transition: border-color 0.15s; align-self: flex-end;
  }
  .nf-filter-icon-btn:hover { border-color: #1d4ed8; }

  .nf-export-btn {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.46rem 0.9rem; border: 1.5px solid #e5e7eb;
    border-radius: 9px; background: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
    color: #374151; cursor: pointer; font-weight: 500;
    transition: border-color 0.15s; white-space: nowrap; align-self: flex-end;
  }
  .nf-export-btn:hover { border-color: #1d4ed8; color: #1d4ed8; }

  /* TABLE */
  .nf-table-card {
    background: #fff; border: 1px solid #e9ebf0; border-radius: 14px; overflow: hidden; margin-bottom: 1.2rem;
  }
  .nf-table { width: 100%; border-collapse: collapse; }
  .nf-table th {
    padding: 0.8rem 1.1rem; font-size: 0.67rem; letter-spacing: 0.1em;
    text-transform: uppercase; color: #9ca3af; font-weight: 700; text-align: left;
    background: #fafbfd; border-bottom: 1px solid #f0f2f7;
  }
  .nf-table td {
    padding: 1rem 1.1rem; font-size: 0.84rem;
    border-bottom: 1px solid #f7f8fb; vertical-align: middle;
  }
  .nf-table tbody tr:last-child td { border-bottom: none; }
  .nf-table tbody tr:hover td { background: #fafbfd; }

  .nf-client-cell { display: flex; align-items: center; gap: 0.65rem; }
  .nf-client-avatar {
    width: 34px; height: 34px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .nf-client-name { font-weight: 600; font-size: 0.84rem; line-height: 1.3; }

  .nf-budget { font-family: 'Syne', sans-serif; font-size: 0.84rem; font-weight: 600; color: #111827; letter-spacing: 0.01em; }
  .nf-deadline { font-size: 0.82rem; color: #374151; }

  .nf-status-pill {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.25rem 0.7rem; border-radius: 7px;
    font-size: 0.74rem; font-weight: 600; white-space: nowrap;
  }
  .nf-status-pill.in-progress  { background: #eff3ff; color: #1d4ed8; }
  .nf-status-pill.completed    { background: #f3e8ff; color: #7c3aed; }
  .nf-status-pill.started      { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }

  .nf-status-chevron { font-size: 0.6rem; }

  .nf-actions-btn {
    width: 28px; height: 28px; border-radius: 7px;
    border: none; background: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #9ca3af; font-size: 1rem; transition: background 0.15s;
  }
  .nf-actions-btn:hover { background: #f3f4f6; color: #374151; }

  /* PAGINATION */
  .nf-pagination-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.8rem 1.1rem;
    border-top: 1px solid #f0f2f7;
    font-size: 0.78rem; color: #9ca3af;
  }
  .nf-page-btns { display: flex; align-items: center; gap: 0.35rem; }
  .nf-page-btn {
    min-width: 30px; height: 30px; border-radius: 7px;
    border: 1.5px solid #e5e7eb; background: #fff;
    font-size: 0.8rem; font-weight: 600; color: #6b7280;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    padding: 0 0.4rem; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .nf-page-btn:hover { border-color: #1d4ed8; color: #1d4ed8; }
  .nf-page-btn.active { background: #1d4ed8; border-color: #1d4ed8; color: #fff; }
  .nf-page-btn.text { border: none; background: none; }
  .nf-page-btn.text:hover { background: #f3f4f6; }

  /* BOTTOM STATS */
  .nf-bottom-stats { display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 1rem; }

  .nf-stat-card {
    background: #fff; border: 1px solid #eef0f5; border-radius: 14px; padding: 1.3rem 1.5rem;
  }
  .nf-stat-card.dark { background: #1a1f2e; border-color: #1a1f2e; }

  .nf-stat-overline { font-size: 0.67rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #9ca3af; margin-bottom: 0.5rem; }
  .nf-stat-card.dark .nf-stat-overline { color: #6b7280; }

  .nf-stat-value { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.75rem; color: #111827; line-height: 1; }
  .nf-stat-card.dark .nf-stat-value { color: #fff; }

  .nf-stat-growth { font-size: 0.75rem; color: #16a34a; margin-top: 0.4rem; display: flex; align-items: center; gap: 0.2rem; font-weight: 500; }

  .nf-resource-value { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.75rem; color: #111827; margin-bottom: 0.6rem; }
  .nf-resource-bar { height: 6px; background: #e5e7eb; border-radius: 99px; overflow: hidden; }
  .nf-resource-fill { height: 100%; background: #1d4ed8; border-radius: 99px; transition: width 0.6s ease; }

  .nf-critical-num { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 2rem; color: #fff; margin-bottom: 0.3rem; }
  .nf-review-link { font-size: 0.82rem; color: #93c5fd; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 0.25rem; }
  .nf-review-link:hover { color: #bfdbfe; }
`;
const navItems = [
  { icon: "dashboard", label: "Dashboard" },
  { icon: "groups", label: "Clients" },
  { icon: "folder", label: "Projects" },
  { icon: "description", label: "Documents" },
  { icon: "chat", label: "Communication" },
];

const avatarColors = ["#1d4ed8", "#7c3aed", "#0891b2", "#059669"];



const statusLabel = { "in-progress": "In Progress", "completed": "Completed", "started": "Started" };

export default function NexaFlowProjects() {
  const [activeNav, setActiveNav] = useState("Projects");
  const [filter, setFilter]       = useState("");
  const [status, setStatus]       = useState("all");
  const [client, setClient]       = useState("all");
  const [page, setPage]           = useState(1);
  const [projects, setProjects] = useState([]);
  const [updatingProjectId, setUpdatingProjectId] = useState(null);
  const navigate = useNavigate();
  const getAllowedNextStatuses = (currentStatus) => {
  switch (currentStatus) {
    case "started": return ["in-progress"];
    case "in-progress": return ["completed"];
    case "completed": return [];
    default: return [];
  }
};
  const requestDeveloperApproval = (project, newStatus) => {
  return new Promise((resolve, reject) => {
    const developerName = window.prompt(
      `Developer approval required for changing project "${project.project_name}" from ${project.status} to ${newStatus}.\nEnter your name / approval code:`
    );
    if (developerName && developerName.trim() !== "") {
      resolve(developerName.trim());
    } else {
      reject("Approval cancelled or no name provided.");
    }
  });
};

  const updateProjectStatus = async (projectId, newStatus, approver) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/dashboard/update-project-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId, status: newStatus, approved_by: approver }),
      });
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        throw new Error(data.message || "Update failed");
      }
    } catch (err) {
      throw err;
    }
  };

  const handleStatusClick = async (project) => {
  const currentStatus = project.status;
  const allowedNext = getAllowedNextStatuses(currentStatus);

  if (allowedNext.length === 0) {
    alert(`Project is already ${currentStatus} – no further status changes allowed.`);
    return;
  }

  // For simplicity, we take the first allowed next status.
  // You could extend this to a dropdown selection.
  const newStatus = allowedNext[0];

  setUpdatingProjectId(project.project_id || project.project_name);
  try {
    const approver = await requestDeveloperApproval(project, newStatus);
    await updateProjectStatus(project.project_id, newStatus, approver);
    alert(`Status updated to ${newStatus} (approved by ${approver}).`);
    await fetchProjects(); // refresh list
  } catch (err) {
    alert(err.message || "Status change cancelled or failed.");
  } finally {
    setUpdatingProjectId(null);
  }
};

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/dashboard/get-projects");
      const data = await res.json();

      if (res.ok) {
        console.log("from frontend",data.data)
        setProjects(data.data.data);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const filtered = projects.filter((p) => {
  const matchName =
    p.client_name?.toLowerCase().includes(filter.toLowerCase()) ||
    p.project_name?.toLowerCase().includes(filter.toLowerCase());

  const matchStatus = status === "all" || p.status === status;
  const matchClient = client === "all" || p.client_name?.startsWith(client);

  return matchName && matchStatus && matchClient;
});

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
              <input placeholder="Global search..." />
            </div>
            <div className="nf-topbar-actions">
              <div className="nf-icon-btn">❓</div>
              <div className="nf-icon-btn">🔔</div>
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
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.1rem" }}>
              <div>
                <div className="nf-overline">Overview</div>
                <div className="nf-page-title">Active Projects</div>
                <div className="nf-page-sub" style={{ marginBottom: 0 }}>
                  Manage client deliverables, monitor budgets, and track project milestones through our high-trust architectural dashboard.
                </div>
              </div>
              <button className="nf-export-btn" style={{ marginTop: "0.5rem" }}>
                ⬇ Export CSV
              </button>
            </div>

            {/* FILTERS */}
            <div className="nf-filter-row">
              <div className="nf-filter-search">
                <span className="nf-filter-search-icon">🔍</span>
                <input
                  placeholder="Filter by project name..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>

              <div className="nf-filter-group">
                <div className="nf-select-wrap">
                  <label className="nf-select-label">Status</label>
                  <select className="nf-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="all">All Statuses</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="started">Started</option>
                  </select>
                  <span className="nf-select-chevron">▼</span>
                </div>

                <div className="nf-select-wrap">
                  <label className="nf-select-label">Client</label>
                  <select className="nf-select" value={client} onChange={(e) => setClient(e.target.value)}>
                    <option value="all">All Clients</option>
                    <option value="SC">Stellar Corp</option>
                    <option value="NS">Nebula Systems</option>
                    <option value="AL">Apex Logic</option>
                    <option value="HE">Helix Energetics</option>
                  </select>
                  <span className="nf-select-chevron">▼</span>
                </div>

                <div className="nf-filter-icon-btn" title="Advanced filters">⚙</div>
              </div>
            </div>

            {/* TABLE */}
            <div className="nf-table-card">
              <table className="nf-table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Project Name</th>
                    <th>Budget</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: "2rem" }}>
                        No projects match your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p,index) => (
                      <tr key={index}>
                        <td>
                          <div className="nf-client-cell">
                            <div className="nf-client-avatar" style={{ background: "#1d4ed8" }}>
                              {p.client_name?.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="nf-client-name">{p.client_name}</span>
                          </div>
                        </td>

                        <td>{p.project_name}</td>

                        <td>
                          <span className="nf-budget">₹{p.budget}</span>
                        </td>

                        <td>
                          <span className="nf-deadline">{p.deadline}</span>
                        </td>

                        {/* <td>
                          <span
                            className={`nf-status-pill ${project.status.toLowerCase().replace(" ", "-")}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleStatusClick(project)}
                            title="Click to change status (requires developer approval)"
                          >
                            {project.status}
                          </span>
                        </td> */}

                        <td>
                          <button className="nf-actions-btn">⋮</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="nf-pagination-row">
                <span>Showing 1 to {filtered.length} of 24 projects</span>
                <div className="nf-page-btns">
                  <button className="nf-page-btn text" onClick={() => setPage(Math.max(1, page - 1))}>Previous</button>
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      className={`nf-page-btn${page === n ? " active" : ""}`}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button className="nf-page-btn text" onClick={() => setPage(Math.min(3, page + 1))}>Next</button>
                </div>
              </div>
            </div>

            {/* BOTTOM STATS */}
            <div className="nf-bottom-stats">
              {/* Total Pipeline */}
              <div className="nf-stat-card">
                <div className="nf-stat-overline">Total Pipeline</div>
                <div className="nf-stat-value">$248,300</div>
                <div className="nf-stat-growth">↗ 12% from last quarter</div>
              </div>

              {/* Resource Load */}
              <div className="nf-stat-card">
                <div className="nf-stat-overline">Resource Load</div>
                <div className="nf-resource-value">84%</div>
                <div className="nf-resource-bar">
                  <div className="nf-resource-fill" style={{ width: "84%" }} />
                </div>
              </div>

              {/* Critical Tasks */}
              <div className="nf-stat-card dark">
                <div className="nf-stat-overline">Critical Tasks</div>
                <div className="nf-critical-num">07</div>
                <div className="nf-review-link">Review Alerts →</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
