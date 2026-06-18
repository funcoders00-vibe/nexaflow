import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .nf-app {
    display: flex; min-height: 100vh;
    background: #f8fafc;
    font-family: 'Inter', sans-serif;
    color: #0f172a;
  }

  /* ── SIDEBAR ── */
  .nf-sidebar {
    width: 240px;
    min-width: 240px;
    background: #0f172a; /* Slate-900 background */
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    padding-bottom: 1.5rem;
    color: #cbd5e1;
    z-index: 10;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .nf-brand {
    padding: 1.5rem 1.5rem 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 1.5rem;
  }

  .nf-brand-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 1.1rem;
    box-shadow: 0 4px 12px rgba(37,99,235,0.25);
  }

  .nf-brand-text { line-height: 1.1; }
  .nf-brand-name {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    font-size: 1.1rem;
    color: #fff;
    letter-spacing: -0.01em;
  }
  .nf-brand-sub {
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    color: #64748b;
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
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 0.3rem;
    border: none; background: none; width: 100%; text-align: left;
    font-family: 'Inter', sans-serif;
  }

  .nf-nav-item:hover { 
    background: rgba(255, 255, 255, 0.04); 
    color: #fff; 
    transform: translateX(4px);
  }
  
  .nf-nav-item.active { 
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%); 
    color: #3b82f6; 
    font-weight: 700; 
    border-left: 3px solid #3b82f6;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  .nf-nav-item.active .nf-nav-icon { color: #3b82f6; }

  .nf-nav-icon { font-size: 1.2rem; width: 20px; text-align: center; color: #64748b; transition: color 0.2s; }

  .nf-sidebar-bottom {
    padding: 0 0.8rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 1.2rem;
  }

  .nf-create-btn {
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    margin-bottom: 0.8rem;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(37,99,235,0.2);
  }
  .nf-create-btn:hover { 
    background: linear-gradient(135deg, #3b82f6, #2563eb); 
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(37,99,235,0.3);
  }
  .nf-create-btn:active { transform: translateY(0); }

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
    background: #fff; border-bottom: 1px solid #e2e8f0;
    padding: 0.7rem 1.8rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .nf-search { flex: 1; max-width: 320px; position: relative; }
  .nf-search input {
    width: 100%; padding: 0.5rem 0.9rem 0.5rem 2.2rem;
    border: 1.5px solid #e2e8f0; border-radius: 12px;
    background: #f8fafc; font-family: 'Inter', sans-serif;
    font-size: 0.85rem; color: #0f172a; outline: none; transition: all 0.2s;
  }
  .nf-search input:focus { border-color: #2563eb; background: #fff; }
  .nf-search input::placeholder { color: #94a3b8; }
  .nf-search-icon { position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.9rem; pointer-events: none; }

  .nf-topbar-actions { display: flex; align-items: center; gap: 0.85rem; margin-left: auto; }
  .nf-icon-btn {
    width: 33px; height: 33px; border-radius: 50%;
    border: 1.5px solid #e2e8f0; background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #64748b; font-size: 0.95rem; position: relative;
    transition: all 0.2s;
  }
  .nf-icon-btn:hover { border-color: #2563eb; }
  .nf-user { display: flex; align-items: center; gap: 0.55rem; }
  .nf-user-info { text-align: right; }
  .nf-user-name { font-size: 0.82rem; font-weight: 600; color: #0f172a; }
  .nf-user-role { font-size: 0.7rem; color: #64748b; }
  .nf-avatar { width: 33px; height: 33px; border-radius: 50%; background: linear-gradient(135deg,#a5b4fc,#818cf8); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: #fff; }

  /* CONTENT */
  .nf-content { flex: 1; padding: 2rem 2.2rem; overflow-y: auto; }

  .nf-overline { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; color: #2563eb; text-transform: uppercase; margin-bottom: 0.4rem; }
  .nf-page-title { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.8rem; margin-bottom: 0.4rem; color: #0f172a; letter-spacing: -0.02em; }
  .nf-page-sub { font-size: 0.9rem; color: #64748b; line-height: 1.6; max-width: 540px; }

  /* FILTER ROW */
  .nf-filter-row {
    display: flex; align-items: center; gap: 1rem;
    margin: 1.6rem 0 1.2rem; flex-wrap: wrap;
  }

  .nf-filter-search { flex: 1; min-width: 240px; max-width: 380px; position: relative; }
  .nf-filter-search input {
    width: 100%; padding: 0.6rem 0.9rem 0.6rem 2.3rem;
    border: 1.5px solid #e2e8f0; border-radius: 12px;
    background: #fff; font-family: 'Inter', sans-serif;
    font-size: 0.88rem; color: #0f172a; outline: none; transition: all 0.2s;
  }
  .nf-filter-search input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
  .nf-filter-search input::placeholder { color: #94a3b8; }
  .nf-filter-search-icon { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.95rem; pointer-events: none; }

  .nf-filter-group { display: flex; align-items: center; gap: 0.8rem; margin-left: auto; }

  .nf-select-wrap { position: relative; }
  .nf-select-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 0.25rem; }
  .nf-select {
    appearance: none; padding: 0.55rem 2.2rem 0.55rem 0.9rem;
    border: 1.5px solid #e2e8f0; border-radius: 12px;
    background: #fff; font-family: 'Inter', sans-serif;
    font-size: 0.88rem; color: #334155; cursor: pointer; outline: none;
    transition: all 0.2s; min-width: 140px;
  }
  .nf-select:focus { border-color: #2563eb; }
  .nf-select-chevron { position: absolute; right: 0.8rem; bottom: 0.55rem; color: #94a3b8; font-size: 1.1rem; pointer-events: none; }

  .nf-filter-icon-btn {
    width: 38px; height: 38px; border: 1.5px solid #e2e8f0;
    border-radius: 12px; background: #fff; display: flex;
    align-items: center; justify-content: center; cursor: pointer;
    color: #64748b; font-size: 1rem; transition: all 0.2s; align-self: flex-end;
  }
  .nf-filter-icon-btn:hover { border-color: #2563eb; color: #2563eb; }

  .nf-export-btn {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.1rem; border: 1.5px solid #e2e8f0;
    border-radius: 12px; background: #fff;
    font-family: 'Inter', sans-serif; font-size: 0.85rem;
    color: #334155; cursor: pointer; font-weight: 700;
    transition: all 0.2s; white-space: nowrap; align-self: flex-end;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }
  .nf-export-btn:hover { border-color: #2563eb; color: #2563eb; transform: translateY(-1px); }

  /* TABLE */
  .nf-table-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; margin-bottom: 1.8rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
    animation: listAppear 0.6s ease-out both;
  }

  @keyframes listAppear {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .nf-table { width: 100%; border-collapse: collapse; }
  .nf-table th {
    padding: 1rem 1.3rem; font-size: 0.72rem; letter-spacing: 0.08em;
    text-transform: uppercase; color: #64748b; font-weight: 700; text-align: left;
    background: #f8fafc; border-bottom: 1px solid #e2e8f0;
  }
  .nf-table td {
    padding: 1.1rem 1.3rem; font-size: 0.9rem;
    border-bottom: 1px solid #f1f5f9; vertical-align: middle;
  }
  .nf-table tbody tr:last-child td { border-bottom: none; }
  .nf-table tbody tr { transition: all 0.15s; }
  .nf-table tbody tr:hover td { background: #f8fafc; }

  .nf-client-cell { display: flex; align-items: center; gap: 0.8rem; }
  .nf-client-avatar {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; font-weight: 700; color: #fff; flex-shrink: 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .nf-client-name { font-weight: 600; font-size: 0.9rem; line-height: 1.3; color: #0f172a; }

  .nf-budget { font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 800; color: #0f172a; letter-spacing: -0.01em; }
  .nf-deadline { font-size: 0.88rem; color: #334155; }

  .nf-status-pill {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.3rem 0.85rem; border-radius: 30px;
    font-size: 0.78rem; font-weight: 700; white-space: nowrap;
    transition: all 0.2s;
  }
  .nf-status-pill.in-progress  { background: #eff6ff; color: #2563eb; }
  .nf-status-pill.completed    { background: #dcfce7; color: #15803d; }
  .nf-status-pill.started      { background: #fffbeb; color: #d97706; }
  
  .nf-status-pill:hover:not([style*="cursor: not-allowed"]) {
    transform: scale(1.04);
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  }

  .nf-status-chevron { font-size: 0.9rem; opacity: 0.7; display: inline-block; vertical-align: middle; margin-left: 0.2rem; }

  .nf-actions-btn {
    width: 32px; height: 32px; border-radius: 8px;
    border: none; background: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #94a3b8; font-size: 1.1rem; transition: all 0.15s;
  }
  .nf-actions-btn:hover { background: #f1f5f9; color: #334155; }

  /* PAGINATION */
  .nf-pagination-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.3rem;
    border-top: 1px solid #f1f5f9;
    font-size: 0.82rem; color: #64748b;
  }
  .nf-page-btns { display: flex; align-items: center; gap: 0.4rem; }
  .nf-page-btn {
    min-width: 32px; height: 32px; border-radius: 8px;
    border: 1.5px solid #e2e8f0; background: #fff;
    font-size: 0.85rem; font-weight: 700; color: #64748b;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    padding: 0 0.5rem; transition: all 0.2s; font-family: 'Inter', sans-serif;
  }
  .nf-page-btn:hover { border-color: #2563eb; color: #2563eb; }
  .nf-page-btn.active { background: #2563eb; border-color: #2563eb; color: #fff; box-shadow: 0 4px 10px rgba(37,99,235,0.2); }
  .nf-page-btn.text { border: none; background: none; font-weight: 600; }
  .nf-page-btn.text:hover { background: #f1f5f9; color: #0f172a; }

  /* BOTTOM STATS */
  .nf-bottom-stats { display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 1.5rem; }

  .nf-stat-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem 1.6rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  }
  .nf-stat-card.dark { background: #0f172a; border-color: #0f172a; box-shadow: 0 10px 20px rgba(15,23,42,0.15); }

  .nf-stat-overline { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; margin-bottom: 0.6rem; }
  .nf-stat-card.dark .nf-stat-overline { color: #94a3b8; }

  .nf-stat-value { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.9rem; color: #0f172a; line-height: 1; letter-spacing: -0.02em; }
  .nf-stat-card.dark .nf-stat-value { color: #fff; }

  .nf-stat-growth { font-size: 0.8rem; color: #16a34a; margin-top: 0.5rem; display: flex; align-items: center; gap: 0.25rem; font-weight: 600; }

  .nf-resource-value { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.9rem; color: #0f172a; margin-bottom: 0.7rem; letter-spacing: -0.02em; }
  .nf-resource-bar { height: 7px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
  .nf-resource-fill { height: 100%; background: linear-gradient(90deg, #2563eb, #60a5fa); border-radius: 99px; transition: width 1.2s ease; }

  .nf-critical-num { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 2.2rem; color: #fff; margin-bottom: 0.4rem; letter-spacing: -0.02em; }
  .nf-review-link { font-size: 0.85rem; color: #60a5fa; cursor: pointer; font-weight: 700; display: flex; align-items: center; gap: 0.25rem; transition: all 0.2s; }
  .nf-review-link:hover { color: #93c5fd; transform: translateX(2px); }

  /* SUCCESS & PROMPT MODAL STYLES */
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: modalOverlayFade 0.3s ease;
  }
  .modal-card {
    background: #fff;
    border-radius: 24px;
    padding: 2.2rem;
    max-width: 460px;
    width: 90%;
    text-align: center;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border: 1px solid #f1f5f9;
    animation: modalDialogScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @keyframes modalOverlayFade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes modalDialogScale {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .modal-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: inline-block;
  }
  .modal-title {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    font-size: 1.4rem;
    color: #0f172a;
    margin-bottom: 0.6rem;
  }
  .modal-desc {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  .modal-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    background: #f8fafc;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    color: #0f172a;
    outline: none;
    margin-bottom: 1.4rem;
    transition: all 0.2s;
  }
  .modal-input:focus {
    border-color: #2563eb;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
  .modal-actions {
    display: flex;
    gap: 0.8rem;
    justify-content: center;
  }
  .modal-btn {
    padding: 0.75rem 1.6rem;
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 0.88rem;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  .modal-btn.primary {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #fff;
    box-shadow: 0 4px 12px rgba(37,99,235,0.2);
  }
  .modal-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(37,99,235,0.3);
  }
  .modal-btn.secondary {
    background: #f1f5f9;
    color: #475569;
  }
  .modal-btn.secondary:hover {
    background: #e2e8f0;
  }
`;

const navItems = [
  { icon: "dashboard", label: "Dashboard" },
  { icon: "groups", label: "Clients" },
  { icon: "folder", label: "Projects" },
  { icon: "assignment", label: "Tasks" },
  { icon: "payments", label: "Finances" },
  { icon: "description", label: "Documents" },
  { icon: "chat", label: "Communication" }
];

// ─── Status transition map (matches exact DB values) ───────────────────────
const VALID_TRANSITIONS = {
  "Started": "In Progress",
  "In Progress": "Completed",
  "Completed": null,
};

// ─── Helper: DB status value → CSS class ───────────────────────────────────
const statusClass = (s) => {
  if (s === "In Progress") return "in-progress";
  if (s === "Completed")   return "completed";
  return "started";
};

export default function NexaFlowProjects() {
  const [activeNav, setActiveNav]           = useState("Projects");
  const [filter, setFilter]                 = useState("");
  const [statusFilter, setStatusFilter]     = useState("all"); // "all" | "Started" | "In Progress" | "Completed"
  const [clientFilter, setClientFilter]     = useState("all"); // "all" | exact client_name
  const [page, setPage]                     = useState(1);
  const [projects, setProjects]             = useState([]);
  const [clientNames, setClientNames]       = useState([]);   // dynamic list built from API data
  const [updatingProjectId, setUpdatingProjectId] = useState(null);
  const navigate = useNavigate();

  // Custom alert/confirm modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedProjectForStatus, setSelectedProjectForStatus] = useState(null);
  const [approverName, setApproverName] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("success"); // "success" | "error" | "warning"

  // ── Fetch projects ────────────────────────────────────────────────────────
  const fetchProjects = async () => {
    try {
      const res  = await fetch("https://nexaflow-js2m.onrender.com/api/dashboard/get-projects", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(data.data);
        // Build unique client name list dynamically from real data
        const unique = [...new Set(data.data.map((p) => p.client_name).filter(Boolean))];
        setClientNames(unique);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  // ── Status update helpers ─────────────────────────────────────────────────
  const updateProjectStatus = async (projectId, newStatus, approver) => {
    const res = await fetch("https://nexaflow-js2m.onrender.com/api/dashboard/update-project-status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ project_id: projectId, status: newStatus, approved_by: approver }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed");
    return data;
  };

  const handleStatusClick = (project) => {
    const newStatus = VALID_TRANSITIONS[project.status];
    if (!newStatus) {
      setNoticeType("warning");
      setNoticeMessage("Project is already Completed – no further changes allowed.");
      return;
    }
    setSelectedProjectForStatus(project);
    setApproverName("");
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!approverName.trim()) {
      setNoticeType("error");
      setNoticeMessage("Approver name/code is required to advance project status.");
      return;
    }

    const project = selectedProjectForStatus;
    const newStatus = VALID_TRANSITIONS[project.status];

    setShowStatusModal(false);
    setUpdatingProjectId(project.project_id);

    try {
      await updateProjectStatus(project.project_id, newStatus, approverName.trim());
      setNoticeType("success");
      setNoticeMessage(`Status updated to "${newStatus}" (approved by ${approverName.trim()}).`);
      await fetchProjects();
    } catch (err) {
      setNoticeType("error");
      setNoticeMessage(`${err.message || "Status update failed."}`);
    } finally {
      setUpdatingProjectId(null);
      setSelectedProjectForStatus(null);
    }
  };

  // ── Filtering ─────────────────────────────────────────────────────────────
  // FIX 1: statusFilter now holds the exact DB value ("Started" / "In Progress" / "Completed")
  //         so the comparison p.status === statusFilter works correctly.
  // FIX 2: clientFilter holds the full client_name string, compared with strict equality.
  const filtered = projects.filter((p) => {
    const matchName =
      p.client_name?.toLowerCase().includes(filter.toLowerCase()) ||
      p.project_name?.toLowerCase().includes(filter.toLowerCase());

    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchClient = clientFilter === "all" || p.client_name === clientFilter;

    return matchName && matchStatus && matchClient;
  });

  // ── Export CSV ────────────────────────────────────────────────────────────
  // FIX 3: implement CSV export from the currently filtered rows
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = ["Client Name", "Project Name", "Budget (₹)", "Deadline", "Status"];
    const rows = filtered.map((p) => [
      `"${p.client_name ?? ""}"`,
      `"${p.project_name ?? ""}"`,
      p.budget ?? "",
      p.deadline ?? "",
      `"${p.status ?? ""}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href     = url;
    link.download = `nexaflow_projects_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ── Pagination (simple client-side, 10 per page) ──────────────────────────
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalPipelineVal = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const activeProjectsCount = projects.filter(p => p.status === "In Progress" || p.status === "Started").length;
  const resourceLoadVal = projects.length ? Math.round((activeProjectsCount / projects.length) * 100) : 0;
  
  const todayDate = new Date();
  const criticalProjectsCount = projects.filter(p => {
    if (!p.deadline || p.status === "Completed") return false;
    const diffTime = new Date(p.deadline) - todayDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays < 14;
  }).length;

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
          {/* TOPBAR */}
          {/* <header className="nf-topbar">
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
          </header> */}

          {/* CONTENT */}
          <main className="nf-content">
            {/* Page Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.1rem" }}>
              <div>
                <div className="nf-overline">Overview</div>
                <div className="nf-page-title">Active Projects</div>
                <div className="nf-page-sub" style={{ marginBottom: 0 }}>
                  Manage client deliverables, monitor budgets, and track project milestones through our high-trust architectural dashboard.
                </div>
              </div>
              {/* FIX 3: Export CSV wired up */}
              <button className="nf-export-btn" style={{ marginTop: "0.5rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }} onClick={handleExportCSV}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>download</span>
                Export CSV
              </button>
            </div>

            {/* FILTERS */}
            <div className="nf-filter-row">
              <div className="nf-filter-search">
                <span className="material-symbols-outlined nf-filter-search-icon">search</span>
                <input
                  placeholder="Filter by project or client name..."
                  value={filter}
                  onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                />
              </div>

              <div className="nf-filter-group">
                {/* FIX 1: option values now match exact DB status strings */}
                <div className="nf-select-wrap">
                  <label className="nf-select-label">Status</label>
                  <select
                    className="nf-select"
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Started">Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <span className="material-symbols-outlined nf-select-chevron">keyboard_arrow_down</span>
                </div>

                {/* FIX 2: client options built from real API data (full client_name) */}
                <div className="nf-select-wrap">
                  <label className="nf-select-label">Client</label>
                  <select
                    className="nf-select"
                    value={clientFilter}
                    onChange={(e) => { setClientFilter(e.target.value); setPage(1); }}
                  >
                    <option value="all">All Clients</option>
                    {clientNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined nf-select-chevron">keyboard_arrow_down</span>
                </div>

                <div className="nf-filter-icon-btn" title="Advanced filters" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>settings</span>
                </div>
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
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: "2rem" }}>
                        No projects match your filters.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((p) => (
                      <tr key={p.project_id}>
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

                        <td>
                          {updatingProjectId === p.project_id ? (
                            <span style={{ fontSize: "0.78rem", color: "#9ca3af" }}>Updating…</span>
                          ) : (
                            <span
                              className={`nf-status-pill ${statusClass(p.status)}`}
                              style={{
                                cursor: p.status === "Completed" ? "not-allowed" : "pointer",
                                opacity: p.status === "Completed" ? 0.7 : 1,
                              }}
                              onClick={() => p.status !== "Completed" && handleStatusClick(p)}
                              title={
                                p.status === "Completed"
                                  ? "Project is complete – no further changes"
                                  : `Click to advance to "${VALID_TRANSITIONS[p.status]}"`
                              }
                            >
                              {p.status}
                              {p.status !== "Completed" && (
                                <span className="material-symbols-outlined nf-status-chevron">keyboard_arrow_down</span>
                              )}
                            </span>
                          )}
                        </td>

                        <td>
                          <button className="nf-actions-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>more_vert</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="nf-pagination-row">
                <span>
                  Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} projects
                </span>
                <div className="nf-page-btns">
                  <button
                    className="nf-page-btn text"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      className={`nf-page-btn${page === n ? " active" : ""}`}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    className="nf-page-btn text"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* BOTTOM STATS */}
            <div className="nf-bottom-stats">
              <div className="nf-stat-card">
                <div className="nf-stat-overline">Total Pipeline</div>
                <div className="nf-stat-value">₹{totalPipelineVal.toLocaleString("en-IN")}</div>
                <div className="nf-stat-growth" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#16a34a' }}>trending_up</span>
                  Active Budgets
                </div>
              </div>
              <div className="nf-stat-card">
                <div className="nf-stat-overline">Active Pipelines</div>
                <div className="nf-resource-value">{resourceLoadVal}%</div>
                <div className="nf-resource-bar">
                  <div className="nf-resource-fill" style={{ width: `${resourceLoadVal}%` }} />
                </div>
              </div>
              <div className="nf-stat-card dark">
                <div className="nf-stat-overline">Near Deadline (14d)</div>
                <div className="nf-critical-num">{String(criticalProjectsCount).padStart(2, '0')}</div>
                <div className="nf-review-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  Critical Projects
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_forward</span>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Status Confirmation Modal */}
        {showStatusModal && selectedProjectForStatus && (
          <div className="modal-overlay">
            <div className="modal-card">
              <span className="material-symbols-outlined modal-icon" style={{ fontSize: '3rem', color: '#3b82f6' }}>sync</span>
              <h3 className="modal-title">Advance Project Status</h3>
              <p className="modal-desc">
                Are you sure you want to move <strong>{selectedProjectForStatus.project_name}</strong> from <strong>{selectedProjectForStatus.status}</strong> to <strong>{VALID_TRANSITIONS[selectedProjectForStatus.status]}</strong>?
              </p>
              <input
                className="modal-input"
                placeholder="Enter approver name or code..."
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
              />
              <div className="modal-actions">
                <button className="modal-btn secondary" onClick={() => setShowStatusModal(false)}>
                  Cancel
                </button>
                <button className="modal-btn primary" onClick={confirmStatusChange}>
                  Approve & Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notice/Alert Modal */}
        {noticeMessage && (
          <div className="modal-overlay">
            <div className="modal-card">
              <span className="material-symbols-outlined modal-icon" style={{
                fontSize: '3rem',
                color: noticeType === "success" ? "#10b981" : noticeType === "warning" ? "#f59e0b" : "#ef4444"
              }}>
                {noticeType === "success" ? "check_circle" : noticeType === "warning" ? "warning" : "cancel"}
              </span>
              <h3 className="modal-title">
                {noticeType === "success" ? "Success" : noticeType === "warning" ? "Notice" : "Error"}
              </h3>
              <p className="modal-desc" style={{ color: noticeType === "error" ? "#ef4444" : "inherit" }}>
                {noticeMessage}
              </p>
              <button className="modal-btn primary" onClick={() => setNoticeMessage("")}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}