import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const styles = `
  .nf-kanban-container {
    display: flex;
    gap: 1.5rem;
    margin-top: 1.5rem;
    height: calc(100vh - 240px);
    overflow: hidden;
  }
  .nf-kanban-column {
    flex: 1;
    background: rgba(15, 23, 42, 0.3);
    border: 1px solid rgba(6, 182, 212, 0.1);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    min-width: 280px;
    height: 100%;
  }
  .nf-kanban-column-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(6, 182, 212, 0.2);
  }
  .nf-column-title {
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .nf-column-count {
    background: rgba(6, 182, 212, 0.2);
    color: var(--accent-cyan);
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 700;
  }
  .nf-task-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-right: 0.2rem;
  }
  .nf-task-card {
    background: rgba(15, 23, 42, 0.55);
    border: 1px solid rgba(6, 182, 212, 0.12);
    border-radius: 12px;
    padding: 1rem;
    cursor: grab;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .nf-task-card:hover {
    border-color: var(--accent-cyan);
    box-shadow: 0 0 12px rgba(6, 182, 212, 0.15);
  }
  .nf-task-priority {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 0.2rem 0.5rem;
    border-radius: 8px;
    display: inline-block;
    margin-bottom: 0.5rem;
  }
  .nf-task-priority.High { background: rgba(239, 68, 68, 0.15); color: #f87171; }
  .nf-task-priority.Medium { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
  .nf-task-priority.Low { background: rgba(16, 185, 129, 0.15); color: #34d399; }
  
  .nf-task-name {
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text-primary);
    margin-bottom: 0.4rem;
  }
  .nf-task-desc {
    font-size: 0.8rem;
    color: var(--text-secondary);
    line-height: 1.4;
    margin-bottom: 0.8rem;
  }
  .nf-task-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.72rem;
    color: var(--text-muted);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 0.6rem;
  }
  .nf-task-assignee {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  .nf-assignee-avatar {
    width: 20px; height: 20px;
    border-radius: 50%;
    background: var(--accent-blue);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 0.6rem; font-weight: 700;
  }
  .nf-task-actions {
    display: flex;
    gap: 0.4rem;
    margin-top: 0.6rem;
    justify-content: flex-end;
  }
  .nf-task-action-btn {
    background: none; border: none; color: var(--text-muted);
    cursor: pointer; padding: 0.2rem; display: flex; align-items: center;
    transition: color 0.15s;
  }
  .nf-task-action-btn:hover { color: var(--accent-cyan); }
  .nf-task-action-btn.delete:hover { color: var(--danger); }
  
  .nf-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(9, 13, 22, 0.85);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    z-index: 100;
  }
  .nf-modal {
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid var(--accent-cyan);
    border-radius: 20px;
    width: 100%; max-width: 480px;
    padding: 2rem;
    box-shadow: 0 0 30px rgba(6, 182, 212, 0.2);
  }
`;

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

export default function NexaFlowTasks() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");

  // WebSocket reference
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // Connect WebSocket
    const ws = new WebSocket("ws://localhost:8000/api/dashboard/ws/updates");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "task_update") {
        if (selectedProjectId) {
          fetchTasks(selectedProjectId);
        }
      }
    };

    return () => ws.close();
  }, [selectedProjectId]);

  // Initial fetches
  useEffect(() => {
    const initFetch = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch projects
        const projRes = await fetch("http://localhost:8000/api/dashboard/get-projects", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const projData = await projRes.json();
        if (projRes.ok && projData.data) {
          setProjects(projData.data);
          if (projData.data.length > 0) {
            setSelectedProjectId(projData.data[0].project_id);
          }
        }

        // Fetch employees
        const empRes = await fetch("http://localhost:8000/api/dashboard/employees", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const empData = await empRes.json();
        if (empRes.ok && empData.data) {
          setEmployees(empData.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initFetch();
  }, []);

  // Fetch tasks when project selection changes
  const fetchTasks = async (projId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/dashboard/projects/${projId}/tasks`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setTasks(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      fetchTasks(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskName || !selectedProjectId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/dashboard/projects/${selectedProjectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          task_name: newTaskName,
          description: newTaskDesc,
          priority: newTaskPriority,
          deadline: newTaskDeadline,
          assigned_employee_id: newTaskAssignee ? parseInt(newTaskAssignee) : null
        })
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewTaskName("");
        setNewTaskDesc("");
        setNewTaskPriority("Medium");
        setNewTaskDeadline("");
        setNewTaskAssignee("");
        fetchTasks(selectedProjectId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = async (taskId, nextStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/dashboard/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchTasks(selectedProjectId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logTaskTime = async (taskId, currentHours, hoursToAdd) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/dashboard/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ time_spent: parseFloat(currentHours) + parseFloat(hoursToAdd) })
      });
      if (res.ok) {
        fetchTasks(selectedProjectId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/dashboard/tasks/${taskId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTasks(selectedProjectId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingTasks = tasks.filter(t => t.status === "Pending");
  const inProgressTasks = tasks.filter(t => t.status === "In Progress");
  const completedTasks = tasks.filter(t => t.status === "Completed");

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
                className={`nf-nav-item${label === "Tasks" ? " active" : ""}`}
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <h1 className="nf-page-title">Kanban Tasks</h1>
              <p className="nf-page-sub" style={{ marginBottom: 0 }}>Manage project operational tasks and log employee developer time.</p>
            </div>
            
            {/* Project Selector */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <select
                className="nf-input-glass"
                value={selectedProjectId || ""}
                onChange={(e) => setSelectedProjectId(parseInt(e.target.value))}
                style={{ padding: "0.6rem 2rem 0.6rem 1rem", border: "1px solid var(--accent-cyan)" }}
              >
                {projects.map(p => (
                  <option key={p.project_id} value={p.project_id}>{p.project_name}</option>
                ))}
              </select>
              <button className="nf-btn-glow" onClick={() => setShowAddModal(true)}>
                <span className="material-symbols-outlined">add</span> Add Task
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "6rem", gap: "1rem" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", color: "var(--accent-cyan)", animation: "spin 1.5s linear infinite" }}>sync</span>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Loading tasks…</span>
            </div>
          ) : (
            <div className="nf-kanban-container">
              {/* PENDING COLUMN */}
              <div className="nf-kanban-column">
                <div className="nf-kanban-column-header">
                  <span className="nf-column-title">Pending</span>
                  <span className="nf-column-count">{pendingTasks.length}</span>
                </div>
                <div className="nf-task-list">
                  {pendingTasks.map(t => (
                    <div className="nf-task-card" key={t.task_id}>
                      <span className={`nf-task-priority ${t.priority}`}>{t.priority}</span>
                      <div className="nf-task-name">{t.task_name}</div>
                      <div className="nf-task-desc">{t.description}</div>
                      <div className="nf-task-meta">
                        <div className="nf-task-assignee">
                          <div className="nf-assignee-avatar">{t.assigned_employee_name?.substring(0, 2).toUpperCase() || "—"}</div>
                          <span>{t.assigned_employee_name || "Unassigned"}</span>
                        </div>
                        <span>{t.deadline || "No due date"}</span>
                      </div>
                      <div className="nf-task-actions">
                        <button className="nf-task-action-btn" title="Start Task" onClick={() => updateTaskStatus(t.task_id, "In Progress")}>
                          <span className="material-symbols-outlined">play_arrow</span>
                        </button>
                        <button className="nf-task-action-btn delete" title="Delete Task" onClick={() => handleDeleteTask(t.task_id)}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* IN PROGRESS COLUMN */}
              <div className="nf-kanban-column">
                <div className="nf-kanban-column-header">
                  <span className="nf-column-title">In Progress</span>
                  <span className="nf-column-count">{inProgressTasks.length}</span>
                </div>
                <div className="nf-task-list">
                  {inProgressTasks.map(t => (
                    <div className="nf-task-card" key={t.task_id}>
                      <span className={`nf-task-priority ${t.priority}`}>{t.priority}</span>
                      <div className="nf-task-name">{t.task_name}</div>
                      <div className="nf-task-desc">{t.description}</div>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.8rem" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Time Spent: {t.time_spent} hrs</span>
                        <input
                          type="number"
                          placeholder="+ hrs"
                          className="nf-input-glass"
                          style={{ width: "60px", padding: "0.2rem 0.4rem", fontSize: "0.75rem" }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.target.value) {
                              logTaskTime(t.task_id, t.time_spent, e.target.value);
                              e.target.value = "";
                            }
                          }}
                        />
                      </div>
                      <div className="nf-task-meta">
                        <div className="nf-task-assignee">
                          <div className="nf-assignee-avatar" style={{ background: "var(--accent-cyan)" }}>{t.assigned_employee_name?.substring(0, 2).toUpperCase() || "—"}</div>
                          <span>{t.assigned_employee_name || "Unassigned"}</span>
                        </div>
                        <span>{t.deadline || "No due date"}</span>
                      </div>
                      <div className="nf-task-actions">
                        <button className="nf-task-action-btn" title="Complete Task" onClick={() => updateTaskStatus(t.task_id, "Completed")}>
                          <span className="material-symbols-outlined">check_circle</span>
                        </button>
                        <button className="nf-task-action-btn" title="Move Back to Pending" onClick={() => updateTaskStatus(t.task_id, "Pending")}>
                          <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <button className="nf-task-action-btn delete" title="Delete Task" onClick={() => handleDeleteTask(t.task_id)}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMPLETED COLUMN */}
              <div className="nf-kanban-column">
                <div className="nf-kanban-column-header">
                  <span className="nf-column-title">Completed</span>
                  <span className="nf-column-count">{completedTasks.length}</span>
                </div>
                <div className="nf-task-list">
                  {completedTasks.map(t => (
                    <div className="nf-task-card" key={t.task_id} style={{ opacity: 0.8 }}>
                      <span className={`nf-task-priority ${t.priority}`}>{t.priority}</span>
                      <div className="nf-task-name">{t.task_name}</div>
                      <div className="nf-task-desc">{t.description}</div>
                      <div className="nf-task-meta">
                        <div className="nf-task-assignee">
                          <div className="nf-assignee-avatar" style={{ background: "var(--success)" }}>{t.assigned_employee_name?.substring(0, 2).toUpperCase() || "—"}</div>
                          <span>{t.assigned_employee_name}</span>
                        </div>
                        <span style={{ color: "var(--success)" }}>Completed ({t.time_spent}h)</span>
                      </div>
                      <div className="nf-task-actions">
                        <button className="nf-task-action-btn" title="Reopen Task" onClick={() => updateTaskStatus(t.task_id, "In Progress")}>
                          <span className="material-symbols-outlined">undo</span>
                        </button>
                        <button className="nf-task-action-btn delete" title="Delete Task" onClick={() => handleDeleteTask(t.task_id)}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          </div>{/* end nf-content */}
        </div>
      </div>

      {/* ADD TASK MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="nf-modal-overlay">
            <motion.div
              className="nf-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 style={{ fontFamily: "Outfit, sans-serif", marginBottom: "1.5rem", color: "var(--text-primary)" }}>Create New Task</h2>
              <form onSubmit={handleCreateTask} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>Task Name</label>
                  <input
                    type="text"
                    required
                    className="nf-input-glass"
                    style={{ width: "100%" }}
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="e.g. Design Database Schemas"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>Description</label>
                  <textarea
                    className="nf-input-glass"
                    style={{ width: "100%", height: "80px", resize: "none" }}
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="Describe the task criteria..."
                  />
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>Priority</label>
                    <select
                      className="nf-input-glass"
                      style={{ width: "100%" }}
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>Deadline</label>
                    <input
                      type="date"
                      required
                      className="nf-input-glass"
                      style={{ width: "100%" }}
                      value={newTaskDeadline}
                      onChange={(e) => setNewTaskDeadline(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>Assign Employee</label>
                  <select
                    className="nf-input-glass"
                    style={{ width: "100%" }}
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" className="nf-btn-glow" style={{ flex: 1, justifyContent: "center" }}>Create Task</button>
                  <button
                    type="button"
                    className="nf-input-glass"
                    style={{ flex: 1 }}
                    onClick={() => setShowAddModal(false)}
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
