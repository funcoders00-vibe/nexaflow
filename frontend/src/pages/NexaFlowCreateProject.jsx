import { useState } from "react";
import { useNavigate } from "react-router-dom";
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .nf-app {
    display: flex;
    min-height: 100vh;
    background: #f8fafc;
    font-family: 'Inter', sans-serif;
    color: #0f172a;
    flex-direction: column;
  }

  .nf-body { display: flex; flex: 1; }

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
  .nf-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  /* TOPBAR */
  .nf-topbar {
    background: #fff; border-bottom: 1px solid #e2e8f0;
    padding: 0.7rem 1.8rem;
    display: flex; align-items: center; gap: 1rem;
  }

  .nf-search { flex: 1; max-width: 460px; position: relative; }
  .nf-search input {
    width: 100%; padding: 0.55rem 0.9rem 0.55rem 2.2rem;
    border: 1.5px solid #e2e8f0; border-radius: 12px;
    background: #f8fafc; font-family: 'Inter', sans-serif;
    font-size: 0.85rem; color: #0f172a; outline: none; transition: all 0.2s;
  }
  .nf-search input:focus { border-color: #2563eb; background: #fff; }
  .nf-search input::placeholder { color: #94a3b8; }
  .nf-search-icon { position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.9rem; pointer-events: none; }

  .nf-topbar-actions { display: flex; align-items: center; gap: 0.85rem; margin-left: auto; }

  .nf-icon-btn {
    width: 34px; height: 34px; border-radius: 50%;
    border: 1.5px solid #e2e8f0; background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #64748b; font-size: 0.95rem;
    position: relative; transition: all 0.2s;
  }
  .nf-icon-btn:hover { border-color: #2563eb; }
  .nf-notif-dot { position: absolute; top: 3px; right: 3px; width: 7px; height: 7px; background: #ef4444; border-radius: 50%; border: 1.5px solid #fff; }

  .nf-user { display: flex; align-items: center; gap: 0.55rem; }
  .nf-user-info { text-align: right; }
  .nf-user-name { font-size: 0.82rem; font-weight: 600; color: #0f172a; }
  .nf-user-role { font-size: 0.7rem; color: #64748b; }
  .nf-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #a5b4fc, #818cf8); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: #fff; }

  /* CONTENT */
  .nf-content { flex: 1; padding: 2rem 2.2rem; overflow-y: auto; }

  .nf-breadcrumb { font-size: 0.78rem; color: #94a3b8; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.4rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
  .nf-breadcrumb-link { color: #64748b; cursor: pointer; transition: color 0.15s; }
  .nf-breadcrumb-link:hover { color: #2563eb; }
  .nf-breadcrumb-current { color: #2563eb; font-weight: 700; }
  .nf-breadcrumb-sep { color: #cbd5e1; }

  .nf-page-title { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.8rem; margin-bottom: 0.4rem; color: #0f172a; letter-spacing: -0.02em; }
  .nf-page-sub { font-size: 0.9rem; color: #64748b; line-height: 1.6; margin-bottom: 2.2rem; max-width: 580px; }

  /* SECTION HEADER */
  .nf-section-header { margin-bottom: 1.4rem; }
  .nf-section-title { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.15rem; margin-bottom: 0.3rem; color: #0f172a; }
  .nf-section-sub { font-size: 0.85rem; color: #64748b; line-height: 1.5; }

  /* CLIENT DETAILS GRID */
  .nf-client-section {
    display: grid; grid-template-columns: 280px 1fr;
    gap: 2.5rem; margin-bottom: 3rem; align-items: start;
    animation: formSectionAppear 0.6s ease-out 0.1s both;
  }

  @keyframes formSectionAppear {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .nf-profile-preview {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 16px;
    padding: 1.3rem 1.5rem; margin-top: 1.2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
  }
  .nf-preview-top { display: flex; align-items: center; gap: 0.7rem; margin-bottom: 0.8rem; }
  .nf-preview-icon { width: 36px; height: 36px; background: #eff6ff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; color: #2563eb; }
  .nf-preview-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; color: #475569; text-transform: uppercase; }
  .nf-preview-bar { height: 6px; background: #f1f5f9; border-radius: 99px; overflow: hidden; margin-bottom: 0.6rem; }
  .nf-preview-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #2563eb, #60a5fa); border-radius: 99px; }
  .nf-preview-status { font-size: 0.78rem; color: #64748b; font-weight: 500; }

  .nf-form-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 1.8rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  }

  .nf-form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem 1.4rem; }

  .nf-field { margin-bottom: 0; }
  .nf-field-full { grid-column: 1 / -1; }

  .nf-label {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: #475569; margin-bottom: 0.5rem; display: block;
  }

  .nf-input {
    width: 100%; padding: 0.75rem 0.95rem;
    border: 1.5px solid #e2e8f0; border-radius: 12px;
    background: #f8fafc; font-family: 'Inter', sans-serif;
    font-size: 0.9rem; color: #0f172a; outline: none; transition: all 0.2s;
  }
  .nf-input:focus { border-color: #2563eb; background: #fff; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
  .nf-input::placeholder { color: #94a3b8; }
  .nf-input.has-icon { padding-right: 2.5rem; }

  .nf-input-wrap { position: relative; }
  .nf-input-suffix {
    position: absolute; right: 0.95rem; top: 50%; transform: translateY(-50%);
    color: #94a3b8; font-size: 0.95rem;
  }

  .nf-error-msg {
    font-size: 0.78rem; color: #ef4444; margin-top: 0.45rem;
    display: flex; align-items: center; gap: 0.35rem;
    font-weight: 500;
  }

  /* PROJECT SCOPE SECTION */
  .nf-scope-section {
    display: grid; grid-template-columns: 1fr 360px;
    gap: 2.5rem; margin-bottom: 2rem; align-items: start;
    animation: formSectionAppear 0.6s ease-out 0.2s both;
  }

  .nf-scope-fields { }

  .nf-textarea {
    width: 100%; padding: 0.8rem 0.95rem;
    border: 1.5px solid #e2e8f0; border-radius: 12px;
    background: #f8fafc; font-family: 'Inter', sans-serif;
    font-size: 0.9rem; color: #0f172a; outline: none;
    transition: all 0.2s;
    resize: vertical; min-height: 120px; line-height: 1.6;
  }
  .nf-textarea:focus { border-color: #2563eb; background: #fff; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
  .nf-textarea::placeholder { color: #94a3b8; }

  .nf-budget-deadline { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-top: 1.2rem; }

  .nf-input-prefix-wrap { position: relative; }
  .nf-input-prefix {
    position: absolute; left: 0.95rem; top: 50%; transform: translateY(-50%);
    color: #94a3b8; font-size: 0.95rem; font-weight: 600;
  }
  .nf-input.padded-left { padding-left: 1.8rem; }
  .nf-calendar-icon {
    position: absolute; right: 0.95rem; top: 50%; transform: translateY(-50%);
    color: #94a3b8; font-size: 1rem; pointer-events: none;
  }

  /* SCOPE RIGHT PANEL */
  .nf-scope-right { }
  .nf-scope-title { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.15rem; margin-bottom: 0.5rem; color: #0f172a; }
  .nf-scope-desc { font-size: 0.88rem; color: #64748b; line-height: 1.6; margin-bottom: 1.2rem; }

  .nf-system-tip {
    background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 12px;
    padding: 0.9rem 1.1rem; margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.6rem;
    box-shadow: 0 2px 4px rgba(124, 58, 237, 0.03);
  }
  .nf-tip-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; color: #7c3aed; text-transform: uppercase; }

  .nf-insight-card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 16px;
    padding: 1.2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  }
  .nf-insight-top { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.8rem; }
  .nf-insight-icon { width: 32px; height: 32px; background: #eff6ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; color: #2563eb; }
  .nf-insight-title { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 0.95rem; color: #0f172a; }
  .nf-insight-body { font-size: 0.82rem; color: #64748b; line-height: 1.65; margin-bottom: 0.8rem; }
  .nf-insight-body strong { color: #334155; font-weight: 600; }
  .nf-learn-more { display: flex; align-items: center; gap: 0.3rem; font-size: 0.82rem; font-weight: 700; color: #2563eb; cursor: pointer; background: none; border: none; padding: 0; transition: all 0.2s; }
  .nf-learn-more:hover { color: #1d4ed8; transform: translateX(2px); }

  /* FOOTER BAR */
  .nf-footer-bar {
    background: #0f172a; padding: 1.2rem 2.2rem;
    display: flex; align-items: center; justify-content: space-between;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    z-index: 5;
  }
  .nf-footer-security { display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; color: #94a3b8; }
  .nf-footer-actions { display: flex; align-items: center; gap: 1.2rem; }
  .nf-discard-btn {
    background: none; border: none; color: #94a3b8; font-size: 0.9rem;
    font-family: 'Inter', sans-serif; cursor: pointer; font-weight: 600;
    transition: color 0.15s;
  }
  .nf-discard-btn:hover { color: #fff; }
  .nf-submit-btn {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 0.75rem 1.6rem; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff;
    border: none; border-radius: 12px; font-family: 'Inter', sans-serif;
    font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  }
  .nf-submit-btn:hover { 
    background: linear-gradient(135deg, #3b82f6, #2563eb); 
    transform: translateY(-2px); 
    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.35); 
  }
  .nf-submit-btn:active { transform: translateY(0); }

  /* SUCCESS & ERROR MODAL STYLES */
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
    padding: 2.5rem;
    max-width: 440px;
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
  .modal-rocket {
    font-size: 3.5rem;
    margin-bottom: 1.2rem;
    display: inline-block;
    animation: rocketLaunch 1.5s infinite alternate ease-in-out;
  }
  @keyframes rocketLaunch {
    0% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-12px) rotate(5deg) scale(1.05); }
    100% { transform: translateY(0) rotate(0deg); }
  }
  .modal-title {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    font-size: 1.5rem;
    color: #0f172a;
    margin-bottom: 0.6rem;
  }
  .modal-desc {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 1.6rem;
  }
  .modal-btn {
    padding: 0.75rem 2rem;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(37,99,235,0.2);
    transition: all 0.2s;
  }
  .modal-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(37,99,235,0.3);
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

export default function NexaFlowCreateProject() {
  const [activeNav, setActiveNav] = useState("Clients");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    clientName: "",
    contactPerson: "",
    email: "",
    phone: "",
    projectName: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const [emailError, setEmailError] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const filledFieldsCount = Object.values(form).filter(Boolean).length;
  const progressPercent = Math.round((filledFieldsCount / 8) * 100);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (key === "email") setEmailError(!e.target.value.includes("@") || !e.target.value.includes("."));
  };
  const handleSubmit = async () => {
    try {
      const response = await fetch("https://nexaflow-js2m.onrender.com/api/dashboard/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          client: {
            client_name: form.clientName,
            contact_person: form.contactPerson,
            email: form.email,
            phone: form.phone,
          },
          project: {
            project_name: form.projectName,
            description: form.description,
            budget: Number(form.budget),
            deadline: form.deadline,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Server error. Please try again.");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="nf-app">
        <div className="nf-body">
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
                onClick={() => navigate("/create-project")}
              >
                + Create Project
              </button>
            </div>
          </aside>

          {/* MAIN */}
          <div className="nf-main">
            {/* TOPBAR */}
            {/* <header className="nf-topbar">
              <div className="nf-search">
                <span className="nf-search-icon">🔍</span>
                <input placeholder="Search workflow, clients, files..." />
              </div>
              <div className="nf-topbar-actions">
                <div className="nf-icon-btn">
                  🔔
                  <span className="nf-notif-dot" />
                </div>
                <div className="nf-icon-btn">❓</div>
                <div className="nf-user">
                  <div className="nf-user-info">
                    <div className="nf-user-name">Alex Sterling</div>
                    <div className="nf-user-role">Administrator</div>
                  </div>
                  <div className="nf-avatar">AS</div>
                </div>
              </div>
            </header> */}

            {/* CONTENT */}
            <main className="nf-content">
              {/* Breadcrumb */}
              <div className="nf-breadcrumb">
                <span className="nf-breadcrumb-link">Clients</span>
                <span className="nf-breadcrumb-sep">›</span>
                <span className="nf-breadcrumb-current">New Project Integration</span>
              </div>

              <div className="nf-page-title">Create New Project</div>
              <div className="nf-page-sub">
                Onboard a new client and initialize their first automation project in a single streamlined workflow.
              </div>

              {/* ── CLIENT DETAILS ── */}
              <div className="nf-client-section">
                <div>
                  <div className="nf-section-header">
                    <div className="nf-section-title">Client Details</div>
                    <div className="nf-section-sub">
                      Fundamental identification and communication contact points for the organization.
                    </div>
                  </div>
                  <div className="nf-profile-preview">
                    <div className="nf-preview-top">
                      <div className="nf-preview-icon">📋</div>
                      <div className="nf-preview-label">Profile Preview</div>
                    </div>
                    <div className="nf-preview-bar">
                      <div className="nf-preview-fill" style={{ width: `${progressPercent}%`, transition: 'width 0.4s ease' }} />
                    </div>
                    <div className="nf-preview-status">Verification Status: {progressPercent === 100 ? "Ready to Launch" : `${progressPercent}% Completed`}</div>
                  </div>
                </div>

                <div className="nf-form-card">
                  <div className="nf-form-grid-2">
                    {/* Client Name */}
                    <div className="nf-field">
                      <label className="nf-label">Client Name</label>
                      <div className="nf-input-wrap">
                        <input
                          className="nf-input has-icon"
                          placeholder="e.g. Acme Corp Industries"
                          value={form.clientName}
                          onChange={set("clientName")}
                        />
                        <span className="nf-input-suffix">🛡</span>
                      </div>
                    </div>

                    {/* Contact Person */}
                    <div className="nf-field">
                      <label className="nf-label">Contact Person</label>
                      <input
                        className="nf-input"
                        placeholder="Johnathan Doe"
                        value={form.contactPerson}
                        onChange={set("contactPerson")}
                      />
                    </div>

                    {/* Email */}
                    <div className="nf-field">
                      <label className="nf-label">Email Address</label>
                      <input
                        className="nf-input"
                        placeholder="contact@acmecorp.com"
                        value={form.email}
                        onChange={set("email")}
                        type="email"
                      />
                      {emailError && form.email === "" && (
                        <div className="nf-error-msg">⚠ Please provide a valid business email</div>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="nf-field">
                      <label className="nf-label">Phone Number</label>
                      <input
                        className="nf-input"
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={set("phone")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── PROJECT SCOPE ── */}
              <div className="nf-scope-section">
                {/* Left: fields */}
                <div className="nf-scope-fields">
                  <div className="nf-field" style={{ marginBottom: "1rem" }}>
                    <label className="nf-label">Project Name</label>
                    <input
                      className="nf-input"
                      placeholder="Global Logistics Automation"
                      value={form.projectName}
                      onChange={set("projectName")}
                    />
                  </div>

                  <div className="nf-field" style={{ marginBottom: 0 }}>
                    <label className="nf-label">Project Description</label>
                    <textarea
                      className="nf-textarea"
                      placeholder="Briefly describe the main objectives and expected outcomes of the automation project..."
                      value={form.description}
                      onChange={set("description")}
                      rows={4}
                    />
                  </div>

                  <div className="nf-budget-deadline">
                    <div className="nf-field">
                      <label className="nf-label">Budget Allocation ($)</label>
                      <div className="nf-input-prefix-wrap">
                        <span className="nf-input-prefix">$</span>
                        <input
                          className="nf-input padded-left"
                          placeholder="0.00"
                          value={form.budget}
                          onChange={set("budget")}
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="nf-field">
                      <label className="nf-label">Project Deadline</label>
                      <div className="nf-input-prefix-wrap">
                        <input
                          className="nf-input has-icon"
                          placeholder="mm/dd/yyyy"
                          value={form.deadline}
                          onChange={set("deadline")}
                          type="date"
                        />
                        <span className="nf-calendar-icon">📅</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: scope info */}
                <div className="nf-scope-right">
                  <div className="nf-scope-title">Project Scope</div>
                  <div className="nf-scope-desc">
                    Define the deliverables, financial parameters, and delivery timeline for the initial engagement.
                  </div>

                  <div className="nf-system-tip">
                    <span>💡</span>
                    <span className="nf-tip-label">System Tip</span>
                  </div>

                  <div className="nf-insight-card">
                    <div className="nf-insight-top">
                      <div className="nf-insight-icon"><span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>auto_awesome</span></div>
                      <div className="nf-insight-title">Automation Insights</div>
                    </div>
                    <div className="nf-insight-body">
                      New projects are automatically assigned a baseline workflow configuration based on client industry.
                      You can customize these later in the <strong>Project Settings</strong>.
                    </div>
                    <button className="nf-learn-more" style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                      <span>Learn More</span>
                      <span className="material-symbols-outlined" style={{ fontSize: "0.95rem" }}>arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* FOOTER BAR */}
        <footer className="nf-footer-bar">
          <div className="nf-footer-security" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "1.1rem", color: "#4ade80" }}>security</span>
            <span>Your data is secured with AES-256 bank-level encryption.</span>
          </div>
          <div className="nf-footer-actions">
            <button className="nf-discard-btn">Discard Draft</button>
            <button className="nf-submit-btn" onClick={handleSubmit} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <span>Create Project</span>
              <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>rocket_launch</span>
            </button>
          </div>
        </footer>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <span className="modal-rocket">
                <span className="material-symbols-outlined" style={{ fontSize: "3.5rem", color: "var(--blue)" }}>rocket_launch</span>
              </span>
              <h3 className="modal-title">Project Created!</h3>
              <p className="modal-desc">
                Your automation pipeline has been successfully configured. We are redirecting you to your active project catalog.
              </p>
              <button className="modal-btn" onClick={() => navigate("/projects")}>
                View Project Catalog
              </button>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {errorMessage && (
          <div className="modal-overlay">
            <div className="modal-card">
              <span className="material-symbols-outlined" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem", color: "#ef4444" }}>warning</span>
              <h3 className="modal-title">Creation Failed</h3>
              <p className="modal-desc" style={{ color: '#ef4444' }}>
                {errorMessage}
              </p>
              <button className="modal-btn" style={{ background: '#475569' }} onClick={() => setErrorMessage("")}>
                Close & Modify
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
