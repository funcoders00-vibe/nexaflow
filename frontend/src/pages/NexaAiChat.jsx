import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const combinedStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── GLOBAL LAYOUT ── */
  .nf-app {
    display: flex;
    min-height: 100vh;
    background: #090d16;
    font-family: 'Inter', sans-serif;
    color: #f8fafc;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .nf-body { display: flex; flex: 1; overflow: hidden; }

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
    background: linear-gradient(135deg, #2563eb, #06b6d4);
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
    color: #94a3b8;
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
    background: rgba(6, 182, 212, 0.08); 
    color: #fff; 
    transform: translateX(4px);
  }
  
  .nf-nav-item.active { 
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%); 
    color: #06b6d4; 
    font-weight: 700; 
    border-left: 3px solid #06b6d4;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  .nf-nav-item.active .nf-nav-icon { color: #06b6d4; }

  .nf-nav-icon { font-size: 1.2rem; width: 20px; text-align: center; color: #64748b; }

  .nf-sidebar-bottom {
    padding: 0 0.8rem;
    border-top: 1px solid rgba(6, 182, 212, 0.15);
    padding-top: 1.2rem;
  }

  .nf-create-btn {
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(135deg, #2563eb, #06b6d4);
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

  /* ── MAIN LAYOUT ── */
  .nf-main { flex: 1; display: flex; overflow: hidden; position: relative; }

  /* ── AMBIENT ORBS ── */
  .nf-orb {
    position: absolute;
    width: 350px; height: 350px;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.25;
    z-index: 1;
    pointer-events: none;
  }
  .nf-orb-cyan { top: -50px; right: 10%; background: #06b6d4; }
  .nf-orb-blue { bottom: -100px; left: 10%; background: #3b82f6; }

  /* ── NEXA AI SESSION SIDEBAR ── */
  .nexa-session-sidebar {
    width: 280px;
    min-width: 280px;
    background: rgba(10, 15, 30, 0.7);
    border-right: 1px solid rgba(6, 182, 212, 0.12);
    display: flex;
    flex-direction: column;
    z-index: 2;
    backdrop-filter: blur(8px);
  }

  .nexa-session-header {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(6, 182, 212, 0.1);
  }

  .nexa-session-header h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #fff;
  }

  .nexa-new-chat-btn {
    background: rgba(6, 182, 212, 0.1);
    color: #06b6d4;
    border: 1px solid rgba(6, 182, 212, 0.2);
    border-radius: 8px;
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .nexa-new-chat-btn:hover {
    background: #06b6d4;
    color: #fff;
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
  }

  .nexa-session-list {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* Custom Scrollbar for Session List */
  .nexa-session-list::-webkit-scrollbar { width: 5px; }
  .nexa-session-list::-webkit-scrollbar-track { background: transparent; }
  .nexa-session-list::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.15); border-radius: 10px; }

  .nexa-session-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.03);
    cursor: pointer;
    transition: all 0.2s ease;
    color: #cbd5e1;
    position: relative;
    group: true;
  }
  .nexa-session-item:hover {
    background: rgba(6, 182, 212, 0.05);
    border-color: rgba(6, 182, 212, 0.2);
    color: #fff;
  }
  .nexa-session-item.active {
    background: rgba(6, 182, 212, 0.12);
    border-color: rgba(6, 182, 212, 0.3);
    color: #06b6d4;
    font-weight: 600;
  }

  .nexa-session-title-wrapper {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    overflow: hidden;
    flex: 1;
  }

  .nexa-session-title {
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nexa-delete-session {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    font-size: 1.1rem;
    opacity: 0.5;
    transition: all 0.2s ease;
    display: flex; align-items: center;
  }
  .nexa-session-item:hover .nexa-delete-session { opacity: 1; }
  .nexa-delete-session:hover { color: #ef4444; }

  .nexa-knowledge-card {
    margin: 1rem;
    padding: 1rem;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(9, 13, 22, 0.9));
    border: 1px solid rgba(6, 182, 212, 0.2);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .nexa-knowledge-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #94a3b8;
  }
  .nexa-pulse-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 8px #22c55e;
  }
  .nexa-pulse-dot.syncing {
    background: #eab308;
    box-shadow: 0 0 8px #eab308;
    animation: pulse 1.2s infinite;
  }

  .nexa-sync-btn {
    width: 100%;
    padding: 0.5rem;
    border-radius: 8px;
    background: rgba(6, 182, 212, 0.1);
    color: #06b6d4;
    border: 1px solid rgba(6, 182, 212, 0.3);
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 0.4rem;
    transition: all 0.2s ease;
  }
  .nexa-sync-btn:hover:not(:disabled) {
    background: #06b6d4;
    color: #fff;
    box-shadow: 0 0 12px rgba(6, 182, 212, 0.25);
  }
  .nexa-sync-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── CHAT PANEL ── */
  .nexa-chat-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 2;
  }

  .nexa-chat-header {
    padding: 1.2rem 2rem;
    background: rgba(9, 13, 22, 0.4);
    border-bottom: 1px solid rgba(6, 182, 212, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nexa-chat-header-info h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 1.15rem;
    font-weight: 800;
    color: #fff;
  }
  .nexa-chat-header-info p {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .nexa-chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .nexa-chat-messages::-webkit-scrollbar { width: 6px; }
  .nexa-chat-messages::-webkit-scrollbar-track { background: transparent; }
  .nexa-chat-messages::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }

  .nexa-message-row {
    display: flex;
    width: 100%;
  }
  .nexa-message-row.user { justify-content: flex-end; }
  .nexa-message-row.assistant { justify-content: flex-start; }

  .nexa-bubble {
    max-width: 75%;
    padding: 1rem 1.25rem;
    border-radius: 16px;
    font-size: 0.95rem;
    line-height: 1.6;
  }
  .nexa-bubble.user {
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.1));
    border: 1px solid rgba(6, 182, 212, 0.3);
    color: #fff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 15px rgba(6, 182, 212, 0.05);
  }
  .nexa-bubble.assistant {
    background: rgba(30, 41, 59, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.05);
    color: #e2e8f0;
    border-bottom-left-radius: 4px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  /* Source references style */
  .nexa-sources-container {
    margin-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    padding-top: 0.6rem;
  }
  .nexa-sources-title {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 0.4rem;
    display: flex; align-items: center; gap: 0.3rem;
  }
  .nexa-sources-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .nexa-source-pill {
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    background: rgba(6, 182, 212, 0.08);
    border: 1px solid rgba(6, 182, 212, 0.2);
    color: #06b6d4;
    display: flex; align-items: center; gap: 0.3rem;
  }

  /* Markdown custom tables inside chat response */
  .nf-md-table-wrapper {
    margin: 0.8rem 0;
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .nf-md-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    text-align: left;
  }
  .nf-md-table tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  .nf-md-table tr:first-child {
    background: rgba(255, 255, 255, 0.03);
    font-weight: 700;
  }
  .nf-md-table td {
    padding: 0.5rem 0.8rem;
  }
  
  .nf-md-list {
    padding-left: 1.25rem;
    margin: 0.5rem 0;
  }
  .nf-md-list li {
    margin-bottom: 0.3rem;
  }

  /* ── QUICK PROMPTS ── */
  .nexa-welcome-layout {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
  }
  .nexa-welcome-icon {
    font-size: 3rem;
    color: #06b6d4;
    margin-bottom: 1rem;
    animation: float 3s ease-in-out infinite;
  }
  .nexa-welcome-title {
    font-family: 'Outfit', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    color: #fff;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #fff, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .nexa-welcome-desc {
    font-size: 0.9rem;
    color: #94a3b8;
    max-width: 480px;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .nexa-quick-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    max-width: 600px;
    width: 100%;
  }
  .nexa-quick-card {
    padding: 1.25rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.04);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }
  .nexa-quick-card:hover {
    background: rgba(6, 182, 212, 0.05);
    border-color: rgba(6, 182, 212, 0.25);
    transform: translateY(-2px);
  }
  .nexa-quick-card h4 {
    font-size: 0.85rem;
    font-weight: 700;
    color: #06b6d4;
    margin-bottom: 0.3rem;
  }
  .nexa-quick-card p {
    font-size: 0.75rem;
    color: #94a3b8;
    line-height: 1.4;
  }

  /* ── INPUT BOX ── */
  .nexa-chat-input {
    padding: 1.5rem 2rem 2rem;
    background: linear-gradient(180deg, transparent, rgba(9, 13, 22, 0.9));
  }

  .nexa-input-wrapper {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(6, 182, 212, 0.15);
    border-radius: 16px;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(12px);
    transition: all 0.2s ease;
  }
  .nexa-input-wrapper:focus-within {
    border-color: rgba(6, 182, 212, 0.4);
    box-shadow: 0 0 15px rgba(6, 182, 212, 0.1);
  }

  .nexa-textarea {
    flex: 1;
    background: none;
    border: none;
    color: #fff;
    resize: none;
    height: 44px;
    padding: 0.6rem 0;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    outline: none;
    line-height: 1.4;
  }
  .nexa-textarea::-webkit-scrollbar { width: 0px; }

  .nexa-send-btn {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #2563eb, #06b6d4);
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(6, 182, 212, 0.25);
  }
  .nexa-send-btn:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
  }
  .nexa-send-btn:disabled {
    background: rgba(255, 255, 255, 0.05);
    color: #64748b;
    box-shadow: none;
    cursor: not-allowed;
  }

  /* ── ANIMATIONS & LOADING ── */
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.6; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  .typing {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.5rem;
  }
  .typing span {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #94a3b8;
    animation: typing-dot 1.4s infinite;
  }
  .typing span:nth-child(2) { animation-delay: 0.2s; }
  .typing span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes typing-dot {
    0%, 100% { transform: translateY(0); opacity: 0.3; }
    50% { transform: translateY(-4px); opacity: 1; }
  }

  .nf-rotate {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
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

export default function NexaAiChat() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [activeSessionUuid, setActiveSessionUuid] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("Synchronized"); // Synchronized, Syncing, Failed
  const chatEndRef = useRef(null);

  // 1. Auth Guard and Initial Fetch
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchSessions();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  // 2. Fetch Sessions
  const fetchSessions = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/dashboard/ai/sessions", {
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.status === "success") {
        setSessions(data.data);
        if (data.data.length > 0) {
          // Select the first session automatically
          selectSession(data.data[0].session_uuid);
        }
      }
    } catch (err) {
      console.error("Fetch sessions failed:", err);
    }
  };

  // 3. Select Session
  const selectSession = async (uuid) => {
    setActiveSessionUuid(uuid);
    setMessages([]);
    try {
      const res = await fetch(`http://localhost:8000/api/dashboard/ai/sessions/${uuid}/messages`, {
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.status === "success") {
        setMessages(data.data);
      }
    } catch (err) {
      console.error("Load session messages failed:", err);
    }
  };

  // 4. Create New Session
  const startNewSession = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/dashboard/ai/sessions", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ title: "New Conversation" })
      });
      const data = await res.json();
      if (data.status === "success") {
        const newSess = {
          session_uuid: data.data.session_uuid,
          title: data.data.title,
          created_at: new Date().toISOString()
        };
        setSessions((prev) => [newSess, ...prev]);
        setActiveSessionUuid(newSess.session_uuid);
        setMessages([]);
      }
    } catch (err) {
      console.error("Create session failed:", err);
    }
  };

  // 5. Delete Session
  const deleteSession = async (e, uuid) => {
    e.stopPropagation(); // Avoid selecting deleted session
    try {
      const res = await fetch(`http://localhost:8000/api/dashboard/ai/sessions/${uuid}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.status === "success") {
        setSessions((prev) => prev.filter((s) => s.session_uuid !== uuid));
        if (activeSessionUuid === uuid) {
          const remaining = sessions.filter((s) => s.session_uuid !== uuid);
          if (remaining.length > 0) {
            selectSession(remaining[0].session_uuid);
          } else {
            setActiveSessionUuid(null);
            setMessages([]);
          }
        }
      }
    } catch (err) {
      console.error("Delete session failed:", err);
    }
  };

  // 6. Send Chat Message
  const sendMessage = async (customText) => {
    const text = customText !== undefined ? customText : message;
    if (!text.trim()) return;

    let sessionUuid = activeSessionUuid;
    
    // Auto-start new session if none exists
    if (!sessionUuid) {
      await startNewSession();
      // Re-fetch sessions to catch the new active one
      await fetchSessions();
      // Wait briefly for state update or use local mock sync
      return;
    }

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    if (customText === undefined) setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/api/dashboard/ai/sessions/${sessionUuid}/chat`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      if (data.status === "success") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.data.response,
            sources: data.data.sources
          }
        ]);
        
        // Update session title in sidebar list if changed
        if (data.data.session_title) {
          setSessions((prev) =>
            prev.map((s) =>
              s.session_uuid === sessionUuid
                ? { ...s, title: data.data.session_title }
                : s
            )
          );
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error: " + (data.message || "Failed to generate response") }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "AI Connection timed out. Please verify your NVIDIA API key." }
      ]);
    }
    setLoading(false);
  };

  // 7. Trigger Knowledge Base Sync
  const triggerKnowledgeSync = async () => {
    setSyncing(true);
    setSyncStatus("Syncing");
    try {
      const res = await fetch("http://localhost:8000/api/dashboard/ai/sync", {
        method: "POST",
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.status === "success") {
        setSyncStatus("Synchronized");
      } else {
        setSyncStatus("Failed");
      }
    } catch (err) {
      console.error(err);
      setSyncStatus("Failed");
    }
    setSyncing(false);
  };

  // 8. Markdown Parser Helper
  const renderMarkdown = (text) => {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
      
    // Parse tables
    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = '';
    let newLines = [];
    
    for (let line of lines) {
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableHtml = '<div class="nf-md-table-wrapper"><table class="nf-md-table">';
        }
        if (line.includes('---')) {
          continue; 
        }
        const cells = line.split('|').slice(1, -1);
        tableHtml += '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
      } else {
        if (inTable) {
          inTable = false;
          tableHtml += '</table></div>';
          newLines.push(tableHtml);
          tableHtml = '';
        }
        newLines.push(line);
      }
    }
    if (inTable) {
      tableHtml += '</table></div>';
      newLines.push(tableHtml);
    }
    
    html = newLines.join('\n');

    // Headings
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    // Lists
    html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)+/gs, (match) => `<ul class="nf-md-list">${match}</ul>`);
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Line breaks
    html = html.split('\n').map(l => {
      if (l.trim().startsWith('<h') || l.trim().startsWith('<ul') || l.trim().startsWith('<li') || l.trim().startsWith('<div') || l.trim().startsWith('<tr') || l.trim().startsWith('<td')) {
        return l;
      }
      return l + '<br />';
    }).join('\n');
    
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const quickPrompts = [
    { title: "Financial Check", desc: "Show project budgets and recorded payments", prompt: "Summarize financial revenue logs and active project budgets." },
    { title: "Team Status", desc: "Who is our top performing developer?", prompt: "Which employee is the top performer and what is the average team productivity score?" },
    { title: "Task Tracking", desc: "List task completion status", prompt: "Summarize our active tasks statuses and completion rate." },
    { title: "Risk Factors", desc: "Are there any projects due shortly?", prompt: "Check active projects due within 14 days and flag high risk factors." }
  ];

  return (
    <>
      <style>{combinedStyles}</style>
      <div className="nf-app">
        <div className="nf-orb nf-orb-cyan" />
        <div className="nf-orb nf-orb-blue" />

        <div className="nf-body">
          {/* SIDEBAR NAVIGATION */}
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
                  className={`nf-nav-item${label === "NexaAI" ? " active" : ""}`}
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
              >
                + Onboard Client
              </button>
            </div>
          </aside>

          {/* NEXA CHAT THREADS SIDEBAR */}
          <div className="nexa-session-sidebar">
            <div className="nexa-session-header">
              <h3>Conversations</h3>
              <button className="nexa-new-chat-btn" onClick={startNewSession} title="New Conversation">
                <span className="material-symbols-outlined">add_comment</span>
              </button>
            </div>
            <div className="nexa-session-list">
              {sessions.map((s) => (
                <div
                  key={s.session_uuid}
                  className={`nexa-session-item${activeSessionUuid === s.session_uuid ? " active" : ""}`}
                  onClick={() => selectSession(s.session_uuid)}
                >
                  <div className="nexa-session-title-wrapper">
                    <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>chat_bubble</span>
                    <span className="nexa-session-title">{s.title}</span>
                  </div>
                  <button className="nexa-delete-session" onClick={(e) => deleteSession(e, s.session_uuid)}>
                    <span className="material-symbols-outlined">delete_outline</span>
                  </button>
                </div>
              ))}
              {sessions.length === 0 && (
                <div style={{ padding: "2rem 1rem", textAlign: "center", color: "#64748b", fontSize: "0.8rem" }}>
                  No active conversations. Start a chat!
                </div>
              )}
            </div>
            <div className="nexa-knowledge-card">
              <div className="nexa-knowledge-status">
                <span className={`nexa-pulse-dot${syncing ? " syncing" : ""}`} />
                <span>RAG Database: {syncStatus}</span>
              </div>
              <button className="nexa-sync-btn" onClick={triggerKnowledgeSync} disabled={syncing}>
                <span className={`material-symbols-outlined${syncing ? " nf-rotate" : ""}`}>
                  sync
                </span>
                <span>{syncing ? "Syncing..." : "Sync Knowledge"}</span>
              </button>
            </div>
          </div>

          {/* CHAT DISPLAY PANEL */}
          <div className="nexa-chat-panel">
            <div className="nexa-chat-header">
              <div className="nexa-chat-header-info">
                <h2>Nexa AI Copilot</h2>
                <p>Equipped with semantic retrieval-augmented generation and session memory</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <span className="material-symbols-outlined" style={{ color: "#06b6d4", fontSize: "1.3rem" }}>
                  neurology
                </span>
              </div>
            </div>

            <div className="nexa-chat-messages">
              {messages.length === 0 && (
                <div className="nexa-welcome-layout">
                  <div className="nexa-welcome-icon">
                    <span className="material-symbols-outlined" style={{ fontSize: "3rem" }}>smart_toy</span>
                  </div>
                  <h3 className="nexa-welcome-title">Ask Nexa AI Operational Assistant</h3>
                  <p className="nexa-welcome-desc">
                    Ask me anything about team productivity, project workflows, budgets, pending invoices, client details, or tasks.
                  </p>
                  <div className="nexa-quick-grid">
                    {quickPrompts.map((item, idx) => (
                      <div
                        key={idx}
                        className="nexa-quick-card"
                        onClick={() => sendMessage(item.prompt)}
                      >
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, index) => (
                <div key={index} className={`nexa-message-row ${msg.role}`}>
                  <div className={`nexa-bubble ${msg.role}`}>
                    {renderMarkdown(msg.content)}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="nexa-sources-container">
                        <div className="nexa-sources-title">
                          <span className="material-symbols-outlined" style={{ fontSize: "0.85rem" }}>find_in_page</span>
                          <span>Context Sources Used:</span>
                        </div>
                        <div className="nexa-sources-list">
                          {msg.sources.map((s, sidx) => (
                            <div key={sidx} className="nexa-source-pill">
                              <span className="material-symbols-outlined" style={{ fontSize: "0.75rem" }}>
                                {s.type === "Employee" && "badge"}
                                {s.type === "Client" && "groups"}
                                {s.type === "Project" && "folder"}
                                {s.type === "Task" && "assignment"}
                                {s.type === "Finance" && "payments"}
                              </span>
                              <span>{s.type}: {s.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="nexa-message-row assistant">
                  <div className="nexa-bubble assistant">
                    <div className="typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="nexa-chat-input">
              <div className="nexa-input-wrapper">
                <textarea
                  className="nexa-textarea"
                  placeholder={activeSessionUuid ? "Ask Nexa AI anything... (Shift+Enter for newline)" : "Start a new conversation..."}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!activeSessionUuid || loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button
                  className="nexa-send-btn"
                  onClick={() => sendMessage()}
                  disabled={loading || !message.trim() || !activeSessionUuid}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}