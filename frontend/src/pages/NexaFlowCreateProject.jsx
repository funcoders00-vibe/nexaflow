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
    flex-direction: column;
  }

  .nf-body { display: flex; flex: 1; }

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
  .nf-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  /* TOPBAR */
  .nf-topbar {
    background: #fff; border-bottom: 1px solid #e9ebf0;
    padding: 0.7rem 1.8rem;
    display: flex; align-items: center; gap: 1rem;
  }

  .nf-search { flex: 1; max-width: 460px; position: relative; }
  .nf-search input {
    width: 100%; padding: 0.48rem 0.9rem 0.48rem 2.2rem;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    background: #f7f8fb; font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; color: #374151; outline: none; transition: border-color 0.15s;
  }
  .nf-search input:focus { border-color: #1d4ed8; background: #fff; }
  .nf-search input::placeholder { color: #b0b7c3; }
  .nf-search-icon { position: absolute; left: 0.7rem; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 0.82rem; pointer-events: none; }

  .nf-topbar-actions { display: flex; align-items: center; gap: 0.85rem; margin-left: auto; }

  .nf-icon-btn {
    width: 33px; height: 33px; border-radius: 50%;
    border: 1.5px solid #e5e7eb; background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6b7280; font-size: 0.88rem;
    position: relative; transition: border-color 0.15s;
  }
  .nf-icon-btn:hover { border-color: #1d4ed8; }
  .nf-notif-dot { position: absolute; top: 3px; right: 3px; width: 7px; height: 7px; background: #ef4444; border-radius: 50%; border: 1.5px solid #fff; }

  .nf-user { display: flex; align-items: center; gap: 0.55rem; }
  .nf-user-info { text-align: right; }
  .nf-user-name { font-size: 0.82rem; font-weight: 600; color: #111827; }
  .nf-user-role { font-size: 0.7rem; color: #9ca3af; }
  .nf-avatar { width: 33px; height: 33px; border-radius: 50%; background: linear-gradient(135deg, #a5b4fc, #818cf8); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: #fff; }

  /* CONTENT */
  .nf-content { flex: 1; padding: 1.6rem 2rem 2rem; overflow-y: auto; }

  .nf-breadcrumb { font-size: 0.78rem; color: #9ca3af; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.35rem; }
  .nf-breadcrumb-link { color: #6b7280; cursor: pointer; }
  .nf-breadcrumb-link:hover { color: #1d4ed8; }
  .nf-breadcrumb-current { color: #1d4ed8; font-weight: 500; }
  .nf-breadcrumb-sep { color: #d1d5db; }

  .nf-page-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.7rem; margin-bottom: 0.3rem; }
  .nf-page-sub { font-size: 0.86rem; color: #6b7280; line-height: 1.55; margin-bottom: 1.8rem; max-width: 520px; }

  /* SECTION HEADER */
  .nf-section-header { margin-bottom: 1.2rem; }
  .nf-section-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.05rem; margin-bottom: 0.25rem; }
  .nf-section-sub { font-size: 0.8rem; color: #6b7280; line-height: 1.5; }

  /* CLIENT DETAILS GRID */
  .nf-client-section {
    display: grid; grid-template-columns: 260px 1fr;
    gap: 2rem; margin-bottom: 2.5rem; align-items: start;
  }

  .nf-profile-preview {
    background: #f7f8fb; border: 1px solid #e9ebf0; border-radius: 12px;
    padding: 1.1rem 1.3rem; margin-top: 1rem;
  }
  .nf-preview-top { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.6rem; }
  .nf-preview-icon { width: 34px; height: 34px; background: #eff3ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
  .nf-preview-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; color: #374151; text-transform: uppercase; }
  .nf-preview-bar { height: 4px; background: #e5e7eb; border-radius: 99px; overflow: hidden; margin-bottom: 0.55rem; }
  .nf-preview-fill { height: 100%; width: 45%; background: linear-gradient(90deg, #1d4ed8, #60a5fa); border-radius: 99px; }
  .nf-preview-status { font-size: 0.74rem; color: #9ca3af; }

  .nf-form-card {
    background: #fff; border: 1px solid #e9ebf0; border-radius: 14px; padding: 1.6rem;
  }

  .nf-form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 1.2rem; }

  .nf-field { margin-bottom: 0; }
  .nf-field-full { grid-column: 1 / -1; }

  .nf-label {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.09em;
    text-transform: uppercase; color: #374151; margin-bottom: 0.4rem; display: block;
  }

  .nf-input {
    width: 100%; padding: 0.65rem 0.85rem;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    background: #f7f8fb; font-family: 'DM Sans', sans-serif;
    font-size: 0.86rem; color: #374151; outline: none; transition: border-color 0.15s, background 0.15s;
  }
  .nf-input:focus { border-color: #1d4ed8; background: #fff; }
  .nf-input::placeholder { color: #b0b7c3; }
  .nf-input.has-icon { padding-right: 2.4rem; }

  .nf-input-wrap { position: relative; }
  .nf-input-suffix {
    position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%);
    color: #9ca3af; font-size: 0.85rem;
  }

  .nf-error-msg {
    font-size: 0.74rem; color: #ef4444; margin-top: 0.35rem;
    display: flex; align-items: center; gap: 0.3rem;
  }

  /* PROJECT SCOPE SECTION */
  .nf-scope-section {
    display: grid; grid-template-columns: 1fr 340px;
    gap: 2rem; margin-bottom: 2rem; align-items: start;
  }

  .nf-scope-fields { }

  .nf-textarea {
    width: 100%; padding: 0.7rem 0.85rem;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    background: #f7f8fb; font-family: 'DM Sans', sans-serif;
    font-size: 0.86rem; color: #374151; outline: none;
    transition: border-color 0.15s, background 0.15s;
    resize: vertical; min-height: 100px; line-height: 1.55;
  }
  .nf-textarea:focus { border-color: #1d4ed8; background: #fff; }
  .nf-textarea::placeholder { color: #b0b7c3; }

  .nf-budget-deadline { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }

  .nf-input-prefix-wrap { position: relative; }
  .nf-input-prefix {
    position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%);
    color: #9ca3af; font-size: 0.86rem; font-weight: 500;
  }
  .nf-input.padded-left { padding-left: 1.6rem; }
  .nf-calendar-icon {
    position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%);
    color: #9ca3af; font-size: 0.9rem;
  }

  /* SCOPE RIGHT PANEL */
  .nf-scope-right { }
  .nf-scope-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; margin-bottom: 0.4rem; }
  .nf-scope-desc { font-size: 0.81rem; color: #6b7280; line-height: 1.6; margin-bottom: 1rem; }

  .nf-system-tip {
    background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 12px;
    padding: 0.8rem 1rem; margin-bottom: 0.8rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .nf-tip-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; color: #7c3aed; text-transform: uppercase; }

  .nf-insight-card {
    background: #fff; border: 1px solid #e9ebf0; border-radius: 12px;
    padding: 1rem 1.1rem;
  }
  .nf-insight-top { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.6rem; }
  .nf-insight-icon { width: 30px; height: 30px; background: #eff3ff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
  .nf-insight-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.88rem; }
  .nf-insight-body { font-size: 0.78rem; color: #6b7280; line-height: 1.6; margin-bottom: 0.7rem; }
  .nf-insight-body strong { color: #374151; font-weight: 600; }
  .nf-learn-more { display: flex; align-items: center; gap: 0.3rem; font-size: 0.78rem; font-weight: 600; color: #1d4ed8; cursor: pointer; background: none; border: none; padding: 0; }
  .nf-learn-more:hover { text-decoration: underline; }

  /* FOOTER BAR */
  .nf-footer-bar {
    background: #1a1f2e; padding: 1rem 2rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nf-footer-security { display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem; color: #9ca3af; }
  .nf-footer-actions { display: flex; align-items: center; gap: 1rem; }
  .nf-discard-btn {
    background: none; border: none; color: #9ca3af; font-size: 0.85rem;
    font-family: 'DM Sans', sans-serif; cursor: pointer; font-weight: 500;
    transition: color 0.15s;
  }
  .nf-discard-btn:hover { color: #fff; }
  .nf-submit-btn {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.65rem 1.4rem; background: #1d4ed8; color: #fff;
    border: none; border-radius: 10px; font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: background 0.15s;
  }
  .nf-submit-btn:hover { background: #1a44c2; }
`;

const navItems = [
  { icon: "dashboard", label: "Dashboard" },
  { icon: "groups", label: "Clients" },
  { icon: "folder", label: "Projects" },
  { icon: "description", label: "Documents" },
  { icon: "chat", label: "Communication" },
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

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (key === "email") setEmailError(!e.target.value.includes("@") || !e.target.value.includes("."));
  };
  const handleSubmit = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/dashboard/create-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      alert("Project Created Successfully 🚀");

      // redirect to projects page
      navigate("/projects");
    } else {
      alert(data.message || "Something went wrong");
    }
  } catch (error) {
    console.error(error);
    alert("Server error");
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
            </header>

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
                      <div className="nf-preview-fill" />
                    </div>
                    <div className="nf-preview-status">Verification Status: Pending Input</div>
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
                      <div className="nf-insight-icon">✦</div>
                      <div className="nf-insight-title">Automation Insights</div>
                    </div>
                    <div className="nf-insight-body">
                      New projects are automatically assigned a baseline workflow configuration based on client industry.
                      You can customize these later in the <strong>Project Settings</strong>.
                    </div>
                    <button className="nf-learn-more">Learn More →</button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* FOOTER BAR */}
        <footer className="nf-footer-bar">
          <div className="nf-footer-security">
            <span>🛡</span>
            <span>Your data is secured with AES-256 bank-level encryption.</span>
          </div>
          <div className="nf-footer-actions">
            <button className="nf-discard-btn">Discard Draft</button>
            <button className="nf-submit-btn" onClick={handleSubmit}>
            Create Project <span>🚀</span>
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}
