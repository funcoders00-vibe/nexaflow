import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue: #2563eb;
    --blue-hover: #1d4ed8;
    --blue-light: rgba(37, 99, 235, 0.05);
    --blue-mid: rgba(37, 99, 235, 0.15);
    --green: #10b981;
    --green-light: #ecfdf5;
    --red: #ef4444;
    --red-light: #fef2f2;
    --amber: #f59e0b;
    --amber-light: #fffbeb;
    --purple: #818cf8;
    --purple-light: rgba(129, 140, 248, 0.05);
    --cyan: #06b6d4;
    --slate-50: #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-300: #cbd5e1;
    --slate-400: #94a3b8;
    --slate-500: #64748b;
    --slate-700: #334155;
    --slate-900: #0f172a;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }

  .nf-app {
    display: flex;
    min-height: 100vh;
    background: #f8fafc;
    font-family: 'Inter', sans-serif;
    color: var(--slate-900);
  }

  /* ── SIDEBAR ── */
  .nf-sidebar {
    width: 240px;
    min-width: 240px;
    background: var(--slate-900);
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
  .nf-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

  /* ── CONTENT ── */
  .nf-content { 
    flex: 1; 
    padding: 2rem 2.2rem; 
    overflow-y: auto;
    animation: fadeIn 0.4s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .nf-page-header { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    margin-bottom: 1.8rem; 
  }
  .nf-page-title { 
    font-family: 'Inter', sans-serif; 
    font-weight: 800; 
    font-size: 1.8rem; 
    letter-spacing: -0.02em;
    color: var(--slate-900);
    margin-bottom: 0.3rem;
  }
  .nf-page-sub { font-size: 0.9rem; color: var(--slate-500); }
  
  .nf-header-btns { display: flex; gap: 0.8rem; align-items: center; }
  .nf-export-btn { 
    display: flex; 
    align-items: center; 
    gap: 0.4rem; 
    padding: 0.6rem 1.1rem; 
    border: 1.5px solid var(--slate-200); 
    border-radius: 10px; 
    background: #fff; 
    font-family: 'Inter', sans-serif; 
    font-size: 0.85rem; 
    color: var(--slate-700); 
    cursor: pointer; 
    font-weight: 600; 
    transition: all 0.2s; 
    box-shadow: var(--shadow-sm);
  }
  .nf-export-btn:hover { 
    border-color: var(--blue); 
    color: var(--blue); 
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  .nf-export-btn:active { transform: translateY(0); }

  /* ── MAIN GRID ── */
  .nf-comm-grid { 
    display: grid; 
    grid-template-columns: 1fr 360px; 
    gap: 1.8rem; 
    align-items: start; 
  }

  /* ── EMAIL COMPOSER ── */
  .nf-composer-card { 
    background: #fff; 
    border: 1px solid var(--slate-200); 
    border-radius: 16px; 
    overflow: hidden; 
    box-shadow: var(--shadow-md); 
  }
  .nf-composer-header { 
    padding: 1.2rem 1.5rem; 
    border-bottom: 1px solid var(--slate-100); 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
  }
  .nf-composer-title { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.1rem; color: var(--slate-900); }
  .nf-composer-body { padding: 1.5rem; }
  
  .nf-form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.2rem; }
  .nf-form-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--slate-400); }
  
  .nf-form-input, .nf-form-select, .nf-form-textarea { 
    width: 100%; 
    padding: 0.7rem 0.9rem; 
    border: 1.5px solid var(--slate-200); 
    border-radius: 10px; 
    font-family: 'Inter', sans-serif; 
    font-size: 0.9rem; 
    color: var(--slate-700); 
    outline: none; 
    transition: all 0.2s; 
    background: #fff; 
  }
  .nf-form-input:focus, .nf-form-select:focus, .nf-form-textarea:focus { 
    border-color: var(--blue); 
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  .nf-form-input::placeholder, .nf-form-textarea::placeholder { color: var(--slate-300); }
  .nf-form-textarea { resize: vertical; min-height: 140px; line-height: 1.6; }
  .nf-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  /* Auto-fill indicator */
  .nf-autofilled { 
    border-color: rgba(37, 99, 235, 0.3) !important; 
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(37, 99, 235, 0.01) 100%) !important; 
  }
  .nf-autofill-note { 
    font-size: 0.72rem; 
    color: var(--blue); 
    font-weight: 700; 
    display: flex; 
    align-items: center; 
    gap: 0.3rem; 
    margin-top: 0.3rem; 
    animation: pulseGlow 1.5s infinite ease-in-out;
  }
  @keyframes pulseGlow {
    0%, 100% { opacity: 0.75; }
    50% { opacity: 1; }
  }

  /* ── ATTACHMENT PANEL ── */
  .nf-attachment-zone { 
    border: 2px dashed var(--slate-300); 
    border-radius: 12px; 
    padding: 1.4rem; 
    text-align: center; 
    cursor: pointer; 
    transition: all 0.25s ease; 
    margin-bottom: 1rem; 
    background: var(--slate-50);
  }
  .nf-attachment-zone:hover { 
    border-color: var(--blue); 
    background: var(--blue-light); 
  }
  .nf-attachment-zone.is-dragging {
    border-color: var(--blue);
    background: rgba(37, 99, 235, 0.08);
    animation: zonePulse 1s infinite alternate;
  }
  @keyframes zonePulse {
    from { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.15); }
    to { box-shadow: 0 0 12px 2px rgba(37, 99, 235, 0.25); }
  }
  .nf-attachment-zone-icon { font-size: 1.8rem; margin-bottom: 0.4rem; color: var(--slate-400); transition: color 0.2s; }
  .nf-attachment-zone:hover .nf-attachment-zone-icon, .nf-attachment-zone.is-dragging .nf-attachment-zone-icon { color: var(--blue); }
  .nf-attachment-zone-label { font-size: 0.85rem; color: var(--slate-500); }
  .nf-attachment-zone-label strong { color: var(--blue); }
  
  .nf-attachment-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
  .nf-att-chip { 
    display: flex; 
    align-items: center; 
    gap: 0.4rem; 
    padding: 0.4rem 0.8rem; 
    background: #fff; 
    border: 1px solid var(--slate-200); 
    border-radius: 8px; 
    font-size: 0.8rem; 
    color: var(--slate-700); 
    box-shadow: var(--shadow-sm);
    animation: popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  .nf-att-chip-icon { font-size: 0.95rem; display: inline-flex; align-items: center; }
  .nf-att-chip-remove { color: var(--slate-400); cursor: pointer; font-size: 0.85rem; transition: color 0.15s; margin-left: 0.3rem; }
  .nf-att-chip-remove:hover { color: var(--red); }

  /* ── TEMPLATE CHIPS ── */
  .nf-template-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
  .nf-template-chip { 
    padding: 0.45rem 0.9rem; 
    border: 1.5px solid var(--slate-200); 
    border-radius: 10px; 
    font-size: 0.8rem; 
    font-weight: 600; 
    color: var(--slate-600); 
    cursor: pointer; 
    background: #fff; 
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
    box-shadow: var(--shadow-sm);
  }
  .nf-template-chip:hover { 
    border-color: var(--blue); 
    color: var(--blue); 
    background: var(--blue-light); 
    transform: translateY(-2px);
  }
  .nf-template-chip:active {
    transform: scale(0.95);
  }
  .nf-template-chip.active-tpl { 
    border-color: var(--blue); 
    color: var(--blue); 
    background: var(--blue-light); 
    box-shadow: 0 0 0 1px var(--blue);
  }

  /* ── COMPOSER ACTIONS ── */
  .nf-composer-actions { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    padding-top: 1.2rem; 
    border-top: 1px solid var(--slate-100); 
    margin-top: 0.8rem; 
  }
  .nf-composer-left-actions { display: flex; align-items: center; gap: 0.6rem; }
  
  .nf-send-later-toggle { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--slate-500); cursor: pointer; user-select: none; font-weight: 600; }
  .nf-toggle { width: 34px; height: 20px; border-radius: 99px; background: var(--slate-200); position: relative; transition: background 0.2s; flex-shrink: 0; }
  .nf-toggle.on { background: var(--blue); }
  .nf-toggle::after { content: ''; position: absolute; width: 14px; height: 14px; border-radius: 50%; background: #fff; top: 3px; left: 3px; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
  .nf-toggle.on::after { left: 17px; }
  
  .nf-send-btn { 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
    padding: 0.65rem 1.3rem; 
    background: linear-gradient(135deg, var(--blue), var(--blue-hover)); 
    color: #fff; 
    border: none; 
    border-radius: 10px; 
    font-family: 'Inter', sans-serif; 
    font-weight: 700; 
    font-size: 0.85rem; 
    cursor: pointer; 
    transition: all 0.2s ease; 
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }
  .nf-send-btn:hover:not(:disabled) { 
    background: linear-gradient(135deg, #3b82f6, var(--blue)); 
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
  }
  .nf-send-btn:active:not(:disabled) { transform: translateY(0); }
  .nf-send-btn:disabled { background: var(--slate-300); cursor: not-allowed; box-shadow: none; }

  /* ── RIGHT COLUMN ── */
  .nf-right-col { display: flex; flex-direction: column; gap: 1.2rem; }

  /* ── ANALYTICS CARDS ── */
  .nf-analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
  .nf-analytics-card { 
    border-radius: 16px; 
    padding: 1.1rem; 
    border: 1px solid var(--slate-200); 
    box-shadow: var(--shadow-sm);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .nf-analytics-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }
  .nf-analytics-card.blue { background: var(--blue-light); border-color: rgba(37,99,235,0.15); }
  .nf-analytics-card.red  { background: var(--red-light); border-color: rgba(239,68,68,0.15); }
  .nf-analytics-card.gray { background: #fff; }
  .nf-analytics-card.purple { background: var(--purple-light); border-color: rgba(129, 140, 248, 0.15); }
  .nf-an-icon { font-size: 1.3rem; margin-bottom: 0.5rem; display: inline-flex; align-items: center; }
  .nf-an-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--slate-500); margin-bottom: 0.4rem; }
  .nf-an-val { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.6rem; color: var(--slate-900); line-height: 1; margin-bottom: 0.3rem; }
  .nf-an-sub { font-size: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.2rem; }
  .nf-an-sub.green { color: #059669; }
  .nf-an-sub.red   { color: var(--red); }
  .nf-an-sub.gray  { color: var(--slate-400); }
  .nf-an-sub.purple { color: #6366f1; }

  /* ── TIMELINE ── */
  .nf-timeline-card { 
    background: #fff; 
    border: 1px solid var(--slate-200); 
    border-radius: 16px; 
    overflow: hidden; 
    box-shadow: var(--shadow-md); 
  }
  .nf-timeline-header { 
    padding: 1.1rem 1.4rem; 
    border-bottom: 1px solid var(--slate-100); 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
  }
  .nf-timeline-title { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 0.95rem; color: var(--slate-900); display: inline-flex; align-items: center; gap: 0.4rem; }
  .nf-timeline-body { padding: 0.8rem 0; max-height: 380px; overflow-y: auto; }
  
  .nf-tl-item { 
    display: flex; 
    gap: 1rem; 
    padding: 0.8rem 1.4rem; 
    border-bottom: 1px solid var(--slate-50); 
    transition: background 0.2s;
    animation: timelineEntry 0.4s ease-out both;
  }
  .nf-tl-item:nth-child(1) { animation-delay: 0.05s; }
  .nf-tl-item:nth-child(2) { animation-delay: 0.1s; }
  .nf-tl-item:nth-child(3) { animation-delay: 0.15s; }
  .nf-tl-item:nth-child(4) { animation-delay: 0.2s; }
  .nf-tl-item:nth-child(5) { animation-delay: 0.25s; }

  @keyframes timelineEntry {
    from { opacity: 0; transform: translateX(12px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .nf-tl-item:last-child { border-bottom: none; }
  .nf-tl-item:hover { background: var(--slate-50); }
  
  .nf-tl-icon-col { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .nf-tl-dot { 
    width: 34px; height: 34px; 
    border-radius: 50%; 
    display: flex; align-items: center; justify-content: center; 
    font-size: 0.85rem; flex-shrink: 0; 
  }
  .nf-tl-dot.sent   { background: var(--blue-light); color: var(--blue); border: 2px solid var(--blue-mid); }
  .nf-tl-dot.failed { background: var(--red-light); color: var(--red); border: 2px solid #fecaca; }
  
  .nf-tl-line { width: 2px; flex: 1; background: var(--slate-100); margin-top: 6px; min-height: 14px; }
  .nf-tl-content { flex: 1; min-width: 0; }
  .nf-tl-client { font-size: 0.85rem; font-weight: 700; color: var(--slate-900); margin-bottom: 0.15rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .nf-tl-subject { font-size: 0.78rem; color: var(--slate-500); margin-bottom: 0.4rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  
  .nf-tl-meta { display: flex; align-items: center; gap: 0.6rem; }
  .nf-tl-type-badge { display: inline-block; padding: 0.2rem 0.55rem; border-radius: 6px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
  .nf-tl-type-badge.agreement { background: var(--blue-light); color: var(--blue); }
  .nf-tl-type-badge.invoice   { background: rgba(129, 140, 248, 0.1); color: #6366f1; }
  .nf-tl-type-badge.welcome   { background: var(--green-light); color: var(--green); }
  .nf-tl-type-badge.reminder  { background: #fff7ed; color: #d97706; }
  
  .nf-tl-time { font-size: 0.72rem; color: var(--slate-400); }
  .nf-tl-status { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.72rem; font-weight: 700; margin-left: auto; text-transform: uppercase; letter-spacing: 0.02em; }
  .nf-tl-status.sent   { color: #059669; }
  .nf-tl-status.failed { color: var(--red); }
  .nf-tl-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .nf-tl-status-dot.sent   { background: #059669; }
  .nf-tl-status-dot.failed { background: var(--red); }

  /* ── FILTER ── */
  .nf-filters { 
    background: #fff; 
    border: 1px solid var(--slate-200); 
    border-radius: 16px; 
    padding: 1.1rem 1.4rem; 
    display: flex; 
    align-items: flex-end; 
    gap: 1.2rem; 
    flex-wrap: wrap; 
    margin-bottom: 1.2rem; 
    box-shadow: var(--shadow-sm);
  }
  .nf-filter-group { display: flex; flex-direction: column; gap: 0.4rem; min-width: 140px; }
  .nf-filter-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--slate-400); }
  
  .nf-select-wrap { position: relative; }
  .nf-select { 
    appearance: none; 
    padding: 0.55rem 2rem 0.55rem 0.9rem; 
    border: 1.5px solid var(--slate-200); 
    border-radius: 10px; 
    background: #fff; 
    font-family: 'Inter', sans-serif; 
    font-size: 0.88rem; 
    color: var(--slate-700); 
    cursor: pointer; 
    outline: none; 
    transition: all 0.2s; 
    width: 100%; 
  }
  .nf-select:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
  .nf-chevron { position: absolute; right: 0.8rem; top: 50%; transform: translateY(-50%); color: var(--slate-400); font-size: 0.7rem; pointer-events: none; }
  
  .nf-reset-btn { 
    background: none; 
    border: none; 
    color: var(--blue); 
    font-size: 0.88rem; 
    font-weight: 700; 
    cursor: pointer; 
    font-family: 'Inter', sans-serif; 
    padding: 0.55rem 0.2rem; 
    margin-left: auto; 
    align-self: flex-end; 
    transition: color 0.15s;
  }
  .nf-reset-btn:hover { color: var(--blue-hover); }

  /* ── TABLE CARD ── */
  .nf-table-card { 
    background: #fff; 
    border: 1px solid var(--slate-200); 
    border-radius: 16px; 
    overflow: hidden; 
    box-shadow: var(--shadow-md); 
  }
  .nf-table { width: 100%; border-collapse: collapse; }
  .nf-table th { 
    padding: 0.9rem 1.2rem; 
    font-size: 0.72rem; 
    letter-spacing: 0.08em; 
    text-transform: uppercase; 
    color: var(--slate-400); 
    font-weight: 700; 
    text-align: left; 
    background: var(--slate-50); 
    border-bottom: 1.5px solid var(--slate-200); 
  }
  .nf-table td { 
    padding: 1.1rem 1.2rem; 
    font-size: 0.88rem; 
    border-bottom: 1px solid var(--slate-100); 
    vertical-align: middle; 
  }
  .nf-table tbody tr:last-child td { border-bottom: none; }
  .nf-table tbody tr:hover td { background: var(--slate-50); }
  
  .nf-client-cell { display: flex; align-items: center; gap: 0.75rem; }
  .nf-client-avatar { 
    width: 36px; height: 36px; 
    border-radius: 10px; 
    display: flex; align-items: center; justify-content: center; 
    font-size: 0.8rem; font-weight: 700; color: #fff; 
    flex-shrink: 0; 
    box-shadow: var(--shadow-sm);
  }
  .nf-client-name { font-weight: 700; font-size: 0.9rem; color: var(--slate-900); }
  .nf-client-email { font-size: 0.78rem; color: var(--slate-400); }
  
  .nf-type-pill { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 7px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
  .nf-type-pill.agreement { background: var(--blue-light); color: var(--blue); }
  .nf-type-pill.invoice   { background: rgba(129, 140, 248, 0.1); color: #6366f1; }
  .nf-type-pill.welcome   { background: var(--green-light); color: var(--green); }
  .nf-type-pill.reminder  { background: #fff7ed; color: #d97706; }
  
  .nf-date-primary { font-size: 0.88rem; color: var(--slate-700); font-weight: 600; }
  .nf-date-time    { font-size: 0.78rem; color: var(--slate-400); }
  
  .nf-status-pill { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.75rem; border-radius: 99px; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; }
  .nf-status-pill.sent   { background: var(--green-light); color: #059669; }
  .nf-status-pill.failed { background: var(--red-light); color: var(--red); }
  
  .nf-action-icon-btn { 
    width: 32px; height: 32px; 
    border-radius: 8px; 
    border: none; background: none; 
    cursor: pointer; 
    display: flex; align-items: center; justify-content: center; 
    color: var(--slate-400); font-size: 1rem; 
    transition: all 0.2s; 
  }
  .nf-action-icon-btn:hover { background: var(--slate-100); color: var(--slate-700); }
  
  .nf-pagination-row { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    padding: 1rem 1.2rem; 
    border-top: 1.5px solid var(--slate-100); 
    font-size: 0.85rem; 
    color: var(--slate-500); 
    font-weight: 600;
  }
  .nf-page-btns { display: flex; align-items: center; gap: 0.4rem; }
  .nf-page-btn { 
    width: 32px; height: 32px; 
    border-radius: 8px; 
    border: 1.5px solid var(--slate-200); 
    background: #fff; 
    font-size: 0.85rem; 
    font-weight: 700; 
    color: var(--slate-600); 
    cursor: pointer; 
    display: flex; align-items: center; justify-content: center; 
    transition: all 0.2s; 
    font-family: 'Inter', sans-serif; 
  }
  .nf-page-btn:hover { border-color: var(--blue); color: var(--blue); }
  .nf-page-btn.active { background: var(--blue); border-color: var(--blue); color: #fff; box-shadow: 0 2px 6px rgba(37,99,235,0.25); }
  .nf-page-btn.arrow { border: none; background: none; color: var(--slate-400); }
  .nf-page-btn.arrow:hover { background: var(--slate-100); color: var(--slate-700); }

  /* ── SKELETON & TOAST ── */
  .nf-skeleton { 
    background: linear-gradient(90deg, var(--slate-100) 25%, #e2e8f0 50%, var(--slate-100) 75%); 
    background-size: 200% 100%; 
    animation: shimmer 1.4s infinite; 
    border-radius: 8px; 
  }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  
  .nf-toast { 
    position: fixed; 
    bottom: 2rem; 
    right: 2rem; 
    padding: 0.8rem 1.4rem; 
    border-radius: 12px; 
    font-size: 0.88rem; 
    font-weight: 600; 
    z-index: 9999; 
    animation: slideup 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
    box-shadow: var(--shadow-lg); 
    color: #fff; 
  }
  .nf-toast.success { background: #059669; }
  .nf-toast.error { background: var(--red); }
  
  @keyframes slideup { 
    from { transform: translateY(24px) scale(0.95); opacity: 0; } 
    to { transform: translateY(0) scale(1); opacity: 1; } 
  }

  /* ── EMPTY STATE ── */
  .nf-empty { text-align: center; padding: 3rem 1.5rem; color: var(--slate-400); }
  .nf-empty-icon { font-size: 2.5rem; margin-bottom: 0.6rem; }
  .nf-empty-text { font-size: 0.95rem; font-weight: 600; }
  .nf-empty-text strong { color: var(--blue); }
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

const avatarColors = ["#6366f1","#7c3aed","#0891b2","#1d4ed8","#8b5cf6","#059669","#d97706","#dc2626"];
const typeLabel    = { agreement: "Agreement", invoice: "Invoice", welcome: "Welcome", reminder: "Reminder" };
const PAGE_SIZE    = 8;

const EMAIL_TEMPLATES = {
  welcome: {
    subjectFn: (client, project) => `Welcome aboard, ${client} — ${project}`,
    bodyFn:    (client, project) =>
      `Dear ${client},\n\nWe are thrilled to officially welcome you! Your project "${project}" is now underway.\n\nTimeline: [deadline]\nNext Steps:\n1. Kickoff call scheduling\n2. Requirements finalization\n3. Development sprint begins\n\nWarm regards,\nZeptrix Team`,
  },
  agreement: {
    subjectFn: (client, project) => `Service Agreement — ${project}`,
    bodyFn:    (client, project) =>
      `Dear ${client},\n\nPlease find attached the Service Agreement for "${project}". Kindly review and confirm your e-signature at your earliest convenience.\n\nRegards,\nZeptrix Team`,
  },
  invoice: {
    subjectFn: (client, project) => `Invoice — ${project}`,
    bodyFn:    (client, project) =>
      `Dear ${client},\n\nPlease find enclosed the invoice for "${project}". Payment is due within 30 days.\n\nThank you for your business.\nZeptrix Team`,
  },
  reminder: {
    subjectFn: (client, project) => `Reminder — Action Required: ${project}`,
    bodyFn:    (client, project) =>
      `Dear ${client},\n\nThis is a gentle reminder regarding your pending action for "${project}".\n\nPlease let us know if you have any questions.\n\nBest regards,\nZeptrix Team`,
  },
};

export default function NexaFlowCommunication() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Communication");

  // Data
  const [logs,     setLogs]     = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState(null);

  // Filter
  const [emailType,    setEmailType]    = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page,         setPage]         = useState(1);

  // Composer state
  const [sending,     setSending]     = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [sendLater,   setSendLater]   = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [form, setForm] = useState({
    project_id:   "",
    email_type:   "welcome",
    client_email: "",
    team_email:   "zeptrixinfo@gmail.com",
    subject:      "",
    body:         "",
  });
  const [projectAutofilled, setProjectAutofilled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchLogs = async () => {
    try {
      const res  = await fetch("https://nexaflow-js2m.onrender.com/api/dashboard/get-emails", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) setLogs(data.data ?? []);
    } catch {}
  };

  const fetchProjects = async () => {
    try {
      const res  = await fetch("https://nexaflow-js2m.onrender.com/api/dashboard/get-projects", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) setProjects(data.data ?? []);
    } catch {}
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchLogs(), fetchProjects()]);
      setLoading(false);
    })();
  }, []);

  // Auto-fill when project selected
  const handleProjectChange = (projectId) => {
    const proj = projects.find((p) => String(p.project_id) === String(projectId));
    const tpl  = EMAIL_TEMPLATES[form.email_type] ?? EMAIL_TEMPLATES.welcome;
    const client  = proj?.client_name ?? "";
    const project = proj?.project_name ?? "";
    setForm((f) => ({
      ...f,
      project_id:   projectId,
      client_email: proj?.client_email ?? "",
      subject:      proj ? tpl.subjectFn(client, project) : f.subject,
      body:         proj ? tpl.bodyFn(client, project) : f.body,
    }));
    setProjectAutofilled(!!proj);
  };

  // Apply email template
  const applyTemplate = (type) => {
    setActiveTemplate(type);
    const proj = projects.find((p) => String(p.project_id) === String(form.project_id));
    const tpl  = EMAIL_TEMPLATES[type];
    const client  = proj?.client_name ?? "{{clientName}}";
    const project = proj?.project_name ?? "{{projectName}}";
    setForm((f) => ({
      ...f,
      email_type: type,
      subject:    tpl.subjectFn(client, project),
      body:       tpl.bodyFn(client, project),
    }));
  };

  // Add document attachment
  const addAttachment = (name, icon) => {
    if (!attachments.find(a => a.name === name)) {
      setAttachments(prev => [...prev, { name, icon }]);
    }
  };
  const removeAttachment = (index) => {
  setAttachments((prev) => prev.filter((_, i) => i !== index));
};

  const handleSendEmail = async () => {
    if (!form.project_id || !form.client_email || !form.subject || !form.body) {
      showToast("Please fill all required fields.", "error"); return;
    }
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("project_id", form.project_id);
      formData.append("email_type", form.email_type);
      formData.append("client_email", form.client_email);
      formData.append("team_email", form.team_email);
      formData.append("subject", form.subject);
      formData.append("body", form.body);
      attachments.forEach((att) => {
        if (att.file) {
          formData.append("attachments", att.file);
        }
      });
      const res = await fetch(
        "https://nexaflow-js2m.onrender.com/api/dashboard/send-email",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: formData,
        }
      );
      const data = await res.json();
      if (res.ok) {
        showToast("✅ Email sent to client and team!");
        setForm({ project_id: "", email_type: "welcome", client_email: "", team_email: "team@nexaflow.io", subject: "", body: "" });
        setAttachments([]); setProjectAutofilled(false); setActiveTemplate("");
        await fetchLogs();
      } else {
        showToast(data.message || "Failed to send email", "error");
      }
    } catch { showToast("Could not reach server", "error"); }
    finally { setSending(false); }
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) { showToast("No data to export.", "error"); return; }
    const headers = ["Client","Email","Type","Date","Status"];
    const rows = filtered.map((l) => [`"${l.client_name ?? ""}"`  ,`"${l.client_email ?? ""}"`,`"${l.email_type ?? ""}"`,`"${l.sent_at ?? ""}"`,`"${l.status ?? ""}"`]);
    const csv  = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `nexaflow_emails_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filtered   = logs.filter(l => (emailType === "all" || l.email_type === emailType) && (statusFilter === "all" || l.status === statusFilter));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sentCount   = logs.filter(l => l.status === "sent").length;
  const failedCount = logs.filter(l => l.status === "failed").length;
  const delivRate   = logs.length ? ((sentCount / logs.length) * 100).toFixed(1) : "0.0";
  const welcomeCount = logs.filter(l => l.email_type === "welcome").length;

  const formatDate = (dt) => { if (!dt) return "—"; const d = new Date(dt); return isNaN(d) ? dt : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); };
  const formatTime = (dt) => { if (!dt) return ""; const d = new Date(dt); return isNaN(d) ? "" : d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); };

  const reset = () => { setEmailType("all"); setStatusFilter("all"); setPage(1); };

  return (
    <>
      <style>{styles}</style>
      {toast && <div className={`nf-toast ${toast.type}`}>{toast.msg}</div>}

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
              <button key={label} className={`nf-nav-item${activeNav === label ? " active" : ""}`}
                onClick={() => {
                  setActiveNav(label);
                  if (label === "Clients")       navigate("/client");
                  if (label === "Dashboard")     navigate("/dashboard");
                  if (label === "Projects")      navigate("/projects");
                  if (label === "Tasks")         navigate("/tasks");
                  if (label === "Finances")      navigate("/finances");
                  if (label === "Documents")     navigate("/documents");
                  if (label === "Communication") navigate("/communication");
                }}>
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

        <div className="nf-main">
          {/* TOPBAR */}
          {/* <header className="nf-topbar">
            <div className="nf-search">
              <span className="nf-search-icon">🔍</span>
              <input placeholder="Search communication logs..." />
            </div>
            <div className="nf-topbar-actions">
              <div className="nf-icon-btn">🔔</div>
              <div className="nf-icon-btn">❓</div>
              <div className="nf-user">
                <span className="nf-user-name">Alex Rivera</span>
                <div className="nf-avatar">AR</div>
              </div>
            </div>
          </header> */}

          <main className="nf-content">
            {/* PAGE HEADER */}
            <div className="nf-page-header">
              <div>
                <div className="nf-page-title">Client Communication</div>
                <div className="nf-page-sub">Compose, send, and track all client emails from one place.</div>
              </div>
              <div className="nf-header-btns">
                <button className="nf-export-btn" onClick={handleExportCSV}>
                  <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>download</span> Export CSV
                </button>
              </div>
            </div>

            {/* MAIN GRID: Composer + Right Column */}
            <div className="nf-comm-grid">
              {/* ─── EMAIL COMPOSER ─── */}
              <div>
                <div className="nf-composer-card">
                  <div className="nf-composer-header">
                    <div className="nf-composer-title">
                      <span className="material-symbols-outlined" style={{ fontSize: "1.15rem", verticalAlign: "middle", marginRight: "0.25rem" }}>mail</span> Compose Email
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Sent to client + team simultaneously</div>
                  </div>

                  <div className="nf-composer-body">
                    {/* PROJECT SELECTOR */}
                    <div className="nf-form-group">
                      <label className="nf-form-label">Select Project *</label>
                      <select className={`nf-form-select${projectAutofilled ? " nf-autofilled" : ""}`}
                        value={form.project_id} onChange={(e) => handleProjectChange(e.target.value)}>
                        <option value="">— Search & select project —</option>
                        {projects.map((p) => (
                          <option key={p.project_id} value={p.project_id}>{p.project_name} — {p.client_name}</option>
                        ))}
                      </select>
                      {projectAutofilled && <div className="nf-autofill-note"><span className="material-symbols-outlined" style={{ fontSize: "0.9rem" }}>check_circle</span> Client details auto-filled</div>}
                    </div>

                    {/* EMAIL TEMPLATES */}
                    <div className="nf-form-group">
                      <label className="nf-form-label">Quick Templates</label>
                      <div className="nf-template-row">
                        {Object.entries({
                          welcome: { label: "Welcome", icon: "handshake" },
                          agreement: { label: "Agreement", icon: "description" },
                          invoice: { label: "Invoice", icon: "receipt_long" },
                          reminder: { label: "Reminder", icon: "notifications_active" }
                        }).map(([key, item]) => (
                          <button key={key} className={`nf-template-chip${activeTemplate === key ? " active-tpl" : ""}`} onClick={() => applyTemplate(key)} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "0.95rem" }}>{item.icon}</span>
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="nf-form-row">
                      <div className="nf-form-group">
                        <label className="nf-form-label">Email Type *</label>
                        <select className="nf-form-select" value={form.email_type} onChange={(e) => setForm((f) => ({ ...f, email_type: e.target.value }))}>
                          <option value="welcome">Welcome</option>
                          <option value="agreement">Agreement</option>
                          <option value="invoice">Invoice</option>
                          <option value="reminder">Reminder</option>
                        </select>
                      </div>
                      <div className="nf-form-group">
                        <label className="nf-form-label">Client Email *</label>
                        <input className={`nf-form-input${projectAutofilled && form.client_email ? " nf-autofilled" : ""}`}
                          type="email" placeholder="client@example.com"
                          value={form.client_email} onChange={(e) => setForm((f) => ({ ...f, client_email: e.target.value }))} />
                      </div>
                    </div>

                    <div className="nf-form-group">
                      <label className="nf-form-label">Team Email *</label>
                      <input className="nf-form-input" type="email" placeholder="zeptrixinfo@gmail.com"
                        value={form.team_email} onChange={(e) => setForm((f) => ({ ...f, team_email: e.target.value }))} />
                    </div>

                    <div className="nf-form-group">
                      <label className="nf-form-label">Subject *</label>
                      <input className={`nf-form-input${projectAutofilled && form.subject ? " nf-autofilled" : ""}`}
                        placeholder="Email subject..." value={form.subject}
                        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
                    </div>

                    <div className="nf-form-group">
                      <label className="nf-form-label">Message Body *</label>
                      <textarea className={`nf-form-textarea${projectAutofilled && form.body ? " nf-autofilled" : ""}`}
                        placeholder="Write your message here..." value={form.body}
                        onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} />
                    </div>

                    {/* ATTACHMENTS */}
                    <div className="nf-form-group">
                      <label className="nf-form-label">Attachments</label>
                      {attachments.length > 0 && (
                        <div className="nf-attachment-chips">
                          {attachments.map((a, index) => (
                            <div key={a.name} className="nf-att-chip">
                              <span className="nf-att-chip-icon"><span className="material-symbols-outlined" style={{ fontSize: "1rem", marginRight: "0.2rem" }}>{a.icon}</span></span>
                              <span>{a.name}</span>
                              <span className="nf-att-chip-remove" onClick={() => removeAttachment(index)}>✕</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div
                        className={`nf-attachment-zone${isDragging ? " is-dragging" : ""}`}
                        onClick={() => document.getElementById("fileInput").click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            const files = Array.from(e.dataTransfer.files);
                            setAttachments((prev) => [
                              ...prev,
                              ...files.map((file) => ({
                                file,
                                name: file.name,
                                icon: "📎",
                              })),
                            ]);
                          }
                        }}
                      >
                        <input
                          id="fileInput"
                          type="file"
                          multiple
                          hidden
                          onChange={(e) => {
                            const files = Array.from(e.target.files);

                            setAttachments((prev) => [
                              ...prev,
                              ...files.map((file) => ({
                                file,
                                name: file.name,
                                icon: "📎",
                              })),
                            ]);
                          }}
                        />

                        <span className="material-symbols-outlined nf-attachment-zone-icon" style={{ fontSize: "2rem" }}>attach_file</span>

                        <div className="nf-attachment-zone-label">
                          <strong>Drag & drop</strong> or click to upload a file
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                        {[["Agreement PDF","description"],["Invoice PDF","receipt_long"],["Welcome PDF","handshake"],["Reminder PDF","notifications_active"]].map(([name, icon]) => (
                          <button key={name} style={{ padding:"0.25rem 0.55rem", border:"1px solid var(--gray-200)", borderRadius:"7px", background:"#fff", fontSize:"0.72rem", cursor:"pointer", color:"var(--gray-700)", fontFamily:"'Inter',sans-serif", display:"inline-flex", alignItems:"center", gap:"0.25rem" }}
                            onClick={() => addAttachment(name, icon)}>
                            <span className="material-symbols-outlined" style={{ fontSize: "0.85rem" }}>add</span>
                            <span className="material-symbols-outlined" style={{ fontSize: "0.85rem" }}>{icon}</span>
                            <span>{name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SCHEDULED SEND */}
                    <div className="nf-form-group">
                      <label className="nf-send-later-toggle" onClick={() => setSendLater(v => !v)}>
                        <div className={`nf-toggle${sendLater ? " on" : ""}`} />
                        Schedule for later
                      </label>
                      {sendLater && (
                        <input className="nf-form-input" type="datetime-local" style={{ marginTop: "0.5rem" }}
                          value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} />
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="nf-composer-actions">
                      <div className="nf-composer-left-actions">
                        <button style={{ padding:"0.4rem 0.7rem", border:"1.5px solid var(--gray-200)", borderRadius:"8px", background:"#fff", fontSize:"0.77rem", cursor:"pointer", color:"var(--gray-500)", fontFamily:"'Inter',sans-serif", display:"inline-flex", alignItems:"center", gap:"0.25rem" }}
                          onClick={() => showToast("Draft saved!", "info")}><span className="material-symbols-outlined" style={{ fontSize: "0.95rem" }}>save</span> Save Draft</button>
                      </div>
                      <button className="nf-send-btn" onClick={handleSendEmail} disabled={sending}>
                        {sending ? "Sending…" : sendLater ? <><span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>schedule</span> Schedule</> : <><span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>send</span> Send Email</>}
                      </button>
                    </div>
                  </div>
                </div>

                {/* FILTER + TABLE */}
                <div style={{ marginTop: "1.2rem" }}>
                  <div style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:"0.95rem", marginBottom:"0.7rem" }}>Email Logs</div>

                  <div className="nf-filters">
                    <div className="nf-filter-group">
                      <label className="nf-filter-label">Email Type</label>
                      <div className="nf-select-wrap">
                        <select className="nf-select" value={emailType} onChange={(e) => { setEmailType(e.target.value); setPage(1); }}>
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
                      <label className="nf-filter-label">Status</label>
                      <div className="nf-select-wrap">
                        <select className="nf-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                          <option value="all">All Statuses</option>
                          <option value="sent">Sent</option>
                          <option value="failed">Failed</option>
                        </select>
                        <span className="nf-chevron">▼</span>
                      </div>
                    </div>
                    <button className="nf-reset-btn" onClick={reset}>Reset Filters</button>
                  </div>

                  <div className="nf-table-card">
                    <table className="nf-table">
                      <thead>
                        <tr><th>Client</th><th>Email Type</th><th>Date &amp; Time</th><th>Status</th><th>Action</th></tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          Array.from({ length: 4 }).map((_, i) => (
                            <tr key={i}>{Array.from({ length: 5 }).map((_, j) => (<td key={j}><div className="nf-skeleton" style={{ height: "1rem", width: j === 0 ? "120px" : "80px" }} /></td>))}</tr>
                          ))
                        ) : paginated.length === 0 ? (
                          <tr>
                            <td colSpan={5}>
                              <div className="nf-empty">
                                <div className="nf-empty-icon">
                                  <span className="material-symbols-outlined" style={{ fontSize: "3rem", color: "var(--slate-300)" }}>mail_outline</span>
                                </div>
                                <div className="nf-empty-text">No email logs found. Compose your first email above.</div>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          paginated.map((log, i) => {
                            const initials = (log.client_name ?? "?").substring(0, 2).toUpperCase();
                            const color    = avatarColors[i % avatarColors.length];
                            return (
                              <tr key={log.email_id ?? i}>
                                <td>
                                  <div className="nf-client-cell">
                                    <div className="nf-client-avatar" style={{ background: color }}>{initials}</div>
                                    <div>
                                      <div className="nf-client-name">{log.client_name ?? "—"}</div>
                                      <div className="nf-client-email">{log.client_email ?? ""}</div>
                                    </div>
                                  </div>
                                </td>
                                <td><span className={`nf-type-pill ${log.email_type ?? "welcome"}`}>{typeLabel[log.email_type] ?? log.email_type ?? "—"}</span></td>
                                <td>
                                  <div className="nf-date-primary">{formatDate(log.sent_at)}</div>
                                  <div className="nf-date-time">{formatTime(log.sent_at)}</div>
                                </td>
                                <td>
                                  <span className={`nf-status-pill ${log.status}`}>
                                    <span className={`nf-status-dot ${log.status}`} />
                                    {log.status === "sent" ? "Sent" : "Failed"}
                                  </span>
                                </td>
                                <td>
                                  <button className="nf-action-icon-btn" title={log.status === "failed" ? "Retry" : "View"}>
                                    {log.status === "failed" ? <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>refresh</span> : <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>visibility</span>}
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                    <div className="nf-pagination-row">
                      <span>Showing {filtered.length === 0 ? 0 : (page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length} logs</span>
                      <div className="nf-page-btns">
                        <button className="nf-page-btn arrow" onClick={() => setPage(Math.max(1, page-1))}>‹</button>
                        {Array.from({ length: totalPages }, (_, i) => i+1).map((n) => (
                          <button key={n} className={`nf-page-btn${page===n?" active":""}`} onClick={() => setPage(n)}>{n}</button>
                        ))}
                        <button className="nf-page-btn arrow" onClick={() => setPage(Math.min(totalPages, page+1))}>›</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── RIGHT COLUMN ─── */}
              <div className="nf-right-col">
                {/* ANALYTICS */}
                <div className="nf-analytics-grid">
                  <div className="nf-analytics-card blue">
                    <div className="nf-an-icon"><span className="material-symbols-outlined">trending_up</span></div>
                    <div className="nf-an-label">Delivery Rate</div>
                    <div className="nf-an-val">{loading ? "—" : `${delivRate}%`}</div>
                    <div className="nf-an-sub green"><span className="material-symbols-outlined" style={{ fontSize: "0.85rem" }}>arrow_upward</span> {sentCount} sent</div>
                  </div>
                  <div className="nf-analytics-card red">
                    <div className="nf-an-icon"><span className="material-symbols-outlined">warning</span></div>
                    <div className="nf-an-label">Failed</div>
                    <div className="nf-an-val">{loading ? "—" : failedCount}</div>
                    <div className={`nf-an-sub ${failedCount > 0 ? "red" : "gray"}`}>{failedCount > 0 ? <><span className="material-symbols-outlined" style={{ fontSize: "0.85rem" }}>flash_on</span> Needs action</> : <><span className="material-symbols-outlined" style={{ fontSize: "0.85rem" }}>check</span> All clear</>}</div>
                  </div>
                  <div className="nf-analytics-card gray">
                    <div className="nf-an-icon"><span className="material-symbols-outlined">email</span></div>
                    <div className="nf-an-label">Total Sent</div>
                    <div className="nf-an-val">{loading ? "—" : logs.length}</div>
                    <div className="nf-an-sub gray">All projects</div>
                  </div>
                  <div className="nf-analytics-card purple">
                    <div className="nf-an-icon"><span className="material-symbols-outlined">waving_hand</span></div>
                    <div className="nf-an-label">Welcome</div>
                    <div className="nf-an-val">{loading ? "—" : welcomeCount}</div>
                    <div className="nf-an-sub purple">Onboarding</div>
                  </div>
                </div>

                {/* COMMUNICATION TIMELINE */}
                <div className="nf-timeline-card">
                  <div className="nf-timeline-header">
                    <div className="nf-timeline-title"><span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>schedule</span> Communication Timeline</div>
                    <div style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{logs.length} total</div>
                  </div>
                  <div className="nf-timeline-body">
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="nf-tl-item">
                          <div className="nf-tl-icon-col"><div className="nf-skeleton" style={{ width: 32, height: 32, borderRadius: "50%" }} /></div>
                          <div style={{ flex: 1 }}><div className="nf-skeleton" style={{ height: "0.8rem", width: "80%", marginBottom: "0.4rem" }} /><div className="nf-skeleton" style={{ height: "0.65rem", width: "60%" }} /></div>
                        </div>
                      ))
                    ) : logs.length === 0 ? (
                      <div className="nf-empty"><div className="nf-empty-icon">📭</div><div className="nf-empty-text">No communication history yet.</div></div>
                    ) : (
                      logs.slice(0, 20).map((log, i) => (
                        <div key={log.email_id ?? i} className="nf-tl-item">
                          <div className="nf-tl-icon-col">
                            <div className={`nf-tl-dot ${log.status}`}>
                              <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>
                                {log.email_type === "agreement" ? "description" : log.email_type === "invoice" ? "receipt_long" : log.email_type === "welcome" ? "handshake" : "notifications_active"}
                              </span>
                            </div>
                            {i < Math.min(logs.length - 1, 19) && <div className="nf-tl-line" />}
                          </div>
                          <div className="nf-tl-content">
                            <div className="nf-tl-client">{log.client_name ?? "—"}</div>
                            <div className="nf-tl-subject">{log.subject ?? `${typeLabel[log.email_type] ?? log.email_type} email`}</div>
                            <div className="nf-tl-meta">
                              <span className={`nf-tl-type-badge ${log.email_type ?? "welcome"}`}>{typeLabel[log.email_type] ?? log.email_type}</span>
                              <span className="nf-tl-time">{formatDate(log.sent_at)}</span>
                              <span className={`nf-tl-status ${log.status}`} style={{ marginLeft: "auto" }}>
                                <span className={`nf-tl-status-dot ${log.status}`} />
                                {log.status === "sent" ? "Sent" : "Failed"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* RECENT CLIENTS */}
                <div style={{ background: "#fff", border: "1px solid var(--gray-200)", borderRadius: "14px", padding: "0.9rem 1.1rem" }}>
                  <div style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:"0.82rem", marginBottom:"0.7rem" }}><span className="material-symbols-outlined" style={{ fontSize: "1rem", verticalAlign: "middle" }}>flash_on</span> Recent Clients</div>
                  {logs.length === 0 ? (
                    <div style={{ fontSize:"0.78rem", color:"#9ca3af" }}>No recent clients.</div>
                  ) : (
                    [...new Map(logs.map(l => [l.client_name, l])).values()].slice(0, 4).map((l, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.5rem" }}>
                        <div style={{ width:28, height:28, borderRadius:"50%", background: avatarColors[i % avatarColors.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontWeight:700, color:"#fff", flexShrink:0 }}>
                          {(l.client_name ?? "?").substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize:"0.8rem", fontWeight:600, color:"var(--gray-900)" }}>{l.client_name ?? "—"}</div>
                          <div style={{ fontSize:"0.7rem", color:"var(--gray-400)" }}>{l.client_email ?? ""}</div>
                        </div>
                        <button style={{ marginLeft:"auto", padding:"0.25rem 0.55rem", border:"1px solid var(--blue-mid)", borderRadius:"7px", background:"var(--blue-light)", color:"var(--blue)", fontSize:"0.7rem", fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}
                          onClick={() => setForm(f => ({ ...f, client_email: l.client_email ?? "" }))}>Use</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}