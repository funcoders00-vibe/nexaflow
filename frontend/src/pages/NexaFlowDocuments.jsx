import { useState, useEffect, useRef } from "react";
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
    --amber: #f59e0b;
    --amber-light: #fffbeb;
    --slate-50: #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-300: #cbd5e1;
    --slate-400: #94a3b8;
    --slate-500: #64748b;
    --slate-700: #334155;
    --slate-900: #0f172a;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
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

  .nf-breadcrumb { 
    display: flex; 
    align-items: center; 
    gap: 0.4rem; 
    font-size: 0.75rem; 
    color: var(--slate-400); 
    margin-bottom: 0.8rem; 
    text-transform: uppercase; 
    letter-spacing: 0.08em; 
    font-weight: 700; 
  }
  .nf-breadcrumb-active { color: var(--blue) !important; }
  .nf-breadcrumb-sep { color: var(--slate-300); }

  /* ── HEADER ROW ── */
  .nf-header-row { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    margin-bottom: 1.8rem; 
  }
  .nf-doc-title { 
    font-family: 'Inter', sans-serif; 
    font-weight: 800; 
    font-size: 1.8rem; 
    color: var(--slate-900); 
    margin-bottom: 0.4rem; 
    letter-spacing: -0.02em;
  }
  .nf-doc-meta { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
  .nf-meta-badge { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.4rem; 
    padding: 0.35rem 0.8rem; 
    border-radius: 8px; 
    font-size: 0.8rem; 
    font-weight: 600; 
    box-shadow: var(--shadow-sm);
  }
  .nf-meta-badge.client { background: var(--green-light); color: #047857; border: 1px solid rgba(16, 185, 129, 0.15); }
  .nf-meta-badge.date { background: var(--amber-light); color: #b45309; border: 1px solid rgba(245, 158, 11, 0.15); }
  .nf-meta-badge.budget { background: var(--blue-light); color: var(--blue); border: 1px solid rgba(37, 99, 235, 0.15); }
  
  .nf-doc-actions { display: flex; align-items: center; gap: 0.8rem; }
  .nf-action-btn-top { 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
    padding: 0.6rem 1.1rem; 
    border: 1.5px solid var(--slate-200); 
    border-radius: 10px; 
    background: #fff; 
    font-family: 'Inter', sans-serif; 
    font-size: 0.85rem; 
    color: var(--slate-700); 
    cursor: pointer; 
    font-weight: 600; 
    transition: all 0.2s ease; 
    box-shadow: var(--shadow-sm);
  }
  .nf-action-btn-top:hover { 
    border-color: var(--blue); 
    color: var(--blue); 
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
  .nf-action-btn-top:active { transform: translateY(0); }
  
  .nf-action-btn-top.primary { 
    background: linear-gradient(135deg, var(--blue), var(--blue-hover)); 
    color: #fff; 
    border: none; 
    font-family: 'Inter', sans-serif; 
    font-weight: 700; 
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }
  .nf-action-btn-top.primary:hover { 
    background: linear-gradient(135deg, #3b82f6, var(--blue)); 
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
  }

  /* ── DOC CARDS ── */
  .nf-doc-cards { 
    display: flex; 
    gap: 1rem; 
    margin-bottom: 1.8rem; 
    padding-bottom: 0.5rem; 
  }
  
  .nf-doc-card { 
    background: #fff; 
    border: 1.5px solid var(--slate-200); 
    border-radius: 16px; 
    padding: 1.2rem 1.4rem; 
    flex: 1;
    min-width: 160px; 
    cursor: pointer; 
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
    position: relative; 
    box-shadow: var(--shadow-sm);
    animation: slideUpFade 0.4s ease-out both;
  }
  
  .nf-doc-card:nth-child(1) { animation-delay: 0.05s; }
  .nf-doc-card:nth-child(2) { animation-delay: 0.1s; }
  .nf-doc-card:nth-child(3) { animation-delay: 0.15s; }
  .nf-doc-card:nth-child(4) { animation-delay: 0.2s; }

  @keyframes slideUpFade {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .nf-doc-card:hover { 
    border-color: var(--blue); 
    box-shadow: var(--shadow-lg); 
    transform: translateY(-4px); 
  }
  
  .nf-doc-card.active-card { 
    border-color: var(--blue); 
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.04) 0%, rgba(37, 99, 235, 0.01) 100%); 
    box-shadow: 0 0 0 1px var(--blue), var(--shadow);
  }
  .nf-doc-card-icon { font-size: 1.8rem; margin-bottom: 0.6rem; }
  .nf-doc-card-name { font-size: 0.95rem; font-weight: 700; color: var(--slate-900); margin-bottom: 0.4rem; }
  .nf-doc-card-meta { font-size: 0.75rem; color: var(--slate-500); }

  /* ── TABS ── */
  .nf-tabs { 
    display: flex; 
    border-bottom: 1.5px solid var(--slate-200); 
    margin-bottom: 1.5rem; 
    position: relative;
  }
  .nf-tab { 
    padding: 0.8rem 1.4rem; 
    font-size: 0.9rem; 
    font-weight: 600; 
    color: var(--slate-500); 
    cursor: pointer; 
    border: none; 
    background: none; 
    border-bottom: 3px solid transparent; 
    margin-bottom: -1.5px; 
    transition: all 0.2s ease; 
    font-family: 'Inter', sans-serif; 
  }
  .nf-tab.active { 
    color: var(--blue); 
    border-bottom-color: var(--blue); 
    font-weight: 700; 
  }
  .nf-tab:hover:not(.active) { 
    color: var(--slate-800); 
    transform: translateY(-1px);
  }

  /* ── LAYOUT ── */
  .nf-doc-layout { 
    display: grid; 
    grid-template-columns: 1fr 280px; 
    gap: 1.8rem; 
    align-items: start; 
  }
  
  .nf-doc-preview { 
    border: 1px solid var(--slate-200); 
    border-radius: 16px; 
    overflow: hidden; 
    background: #fff; 
    box-shadow: var(--shadow-lg); 
    transition: all 0.3s ease;
  }
  .nf-doc-preview:hover {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.12);
  }

  /* ── EDITABLE FIELDS ── */
  .ef { 
    border: none; 
    outline: none; 
    background: transparent; 
    font-family: inherit; 
    color: inherit; 
    width: 100%; 
    resize: none; 
    transition: all 0.15s ease;
    border-radius: 4px;
    padding: 0.1rem 0.25rem;
  }
  .ef:hover { 
    background: rgba(37, 99, 235, 0.04); 
  }
  .ef:focus { 
    background: rgba(37, 99, 235, 0.08); 
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
  }

  /* ══ LETTER STYLE ══ */
  .lt-header {
    background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
    padding: 1.6rem 2.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }
  .lt-header::after { content: ''; position: absolute; top: -30px; right: -30px; width: 140px; height: 140px; border-radius: 50%; background: rgba(255,255,255,0.04); }
  .lt-header::before { content: ''; position: absolute; bottom: -20px; right: 80px; width: 90px; height: 90px; border-radius: 50%; background: rgba(255,255,255,0.03); }
  .lt-logo-block { display: flex; align-items: center; gap: 0.8rem; }
  .lt-logo-circle { 
    width: 48px; height: 48px; 
    border-radius: 12px; 
    background: rgba(255,255,255,0.12); 
    border: 1.5px solid rgba(255,255,255,0.25); 
    display: flex; align-items: center; justify-content: center; 
    overflow: hidden; flex-shrink: 0; 
  }
  .lt-logo-circle img { width: 100%; height: 100%; object-fit: contain; }
  .lt-logo-fallback { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.3rem; color: #fff; }
  .lt-company-name-hdr { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.15rem; color: #fff; line-height: 1.1; }
  .lt-company-tag-hdr { font-size: 0.65rem; color: rgba(255,255,255,0.6); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 0.25rem; font-weight: 600; }
  .lt-contact-block { text-align: right; }
  .lt-contact-line { font-size: 0.72rem; color: rgba(255,255,255,0.7); line-height: 1.7; }
  .lt-contact-line input.ef { font-size: 0.72rem; color: rgba(255,255,255,0.7); text-align: right; }
  .lt-contact-line input.ef:hover { background: rgba(255,255,255,0.08); }
  .lt-contact-line input.ef:focus { background: rgba(255,255,255,0.12); box-shadow: 0 0 0 2px rgba(255,255,255,0.2); }

  .lt-body { padding: 2.2rem 2.5rem; }
  .lt-title-wrap { text-align: center; margin-bottom: 2rem; padding-bottom: 1.2rem; border-bottom: 2px solid var(--slate-100); }
  .lt-doc-title { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.4rem; color: var(--slate-900); }
  .lt-doc-title input.ef { text-align: center; font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.4rem; color: var(--slate-900); }
  .lt-ref-line { font-size: 0.78rem; color: var(--slate-400); margin-top: 0.35rem; font-weight: 600; }
  .lt-ref-line input.ef { font-size: 0.78rem; color: var(--slate-400); text-align: center; }
  
  .lt-date-line { font-size: 0.88rem; color: var(--slate-700); margin-bottom: 1.4rem; font-weight: 600; }
  .lt-date-line input.ef { font-size: 0.88rem; color: var(--slate-700); font-weight: 600; }
  
  .lt-address-block { margin-bottom: 1.4rem; background: var(--slate-50); padding: 1rem; border-radius: 10px; border: 1px solid var(--slate-100); }
  .lt-addr-name { font-weight: 700; font-size: 0.9rem; color: var(--slate-900); margin-bottom: 0.25rem; }
  .lt-addr-name input.ef { font-weight: 700; font-size: 0.9rem; color: var(--slate-900); }
  .lt-addr-line { font-size: 0.85rem; color: var(--slate-600); line-height: 1.6; }
  .lt-addr-line input.ef, .lt-addr-line textarea.ef { font-size: 0.85rem; color: var(--slate-600); line-height: 1.6; }
  
  .lt-subject-line { font-size: 0.88rem; color: var(--slate-900); margin-bottom: 1.4rem; padding-bottom: 0.5rem; border-bottom: 1px dashed var(--slate-200); }
  .lt-subject-line strong { font-weight: 700; color: var(--slate-900); }
  .lt-subject-line input.ef { font-size: 0.88rem; color: var(--slate-900); font-weight: 700; }
  
  .lt-salutation { font-size: 0.9rem; color: var(--slate-900); font-weight: 600; margin-bottom: 1rem; }
  .lt-salutation input.ef { font-size: 0.9rem; color: var(--slate-900); font-weight: 600; }
  
  .lt-para { font-size: 0.88rem; color: var(--slate-700); line-height: 1.7; margin-bottom: 1.2rem; }
  .lt-para textarea.ef { font-size: 0.88rem; color: var(--slate-700); line-height: 1.7; }
  
  .lt-section-h { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1rem; color: var(--slate-900); margin: 1.6rem 0 0.8rem; border-left: 3px solid var(--blue); padding-left: 0.6rem; }
  .lt-section-h input.ef { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1rem; color: var(--slate-900); }
  
  .lt-bullets { margin-bottom: 1.2rem; }
  .lt-bullet-item { display: flex; align-items: flex-start; gap: 0.65rem; font-size: 0.88rem; color: var(--slate-700); line-height: 1.65; margin-bottom: 0.6rem; }
  .lt-bullet-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); flex-shrink: 0; margin-top: 0.55rem; }
  .lt-bullet-item input.ef { font-size: 0.88rem; color: var(--slate-700); }
  
  .lt-fin-table { width: 100%; border-collapse: collapse; margin: 0.8rem 0 1.4rem; font-size: 0.88rem; }
  .lt-fin-table th { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--slate-400); text-align: left; padding: 0.6rem 0.8rem; border-bottom: 2px solid var(--slate-200); }
  .lt-fin-table th:last-child { text-align: right; }
  .lt-fin-table td { padding: 0.7rem 0.8rem; border-bottom: 1px solid var(--slate-100); color: var(--slate-700); }
  .lt-fin-table td:last-child { text-align: right; font-weight: 600; }
  .lt-fin-table tr.total-row td { border-top: 2px solid var(--slate-300); font-weight: 800; color: var(--slate-900); border-bottom: none; }
  .lt-fin-table td input.ef { font-size: 0.88rem; color: var(--slate-700); font-weight: inherit; }
  
  .lt-closing { font-size: 0.88rem; color: var(--slate-700); margin-bottom: 0.6rem; }
  .lt-closing input.ef { font-size: 0.88rem; color: var(--slate-700); }
  .lt-sign-company { font-weight: 700; font-size: 0.9rem; color: var(--slate-900); margin-top: 0.4rem; }

  /* ── SIGNATURE BLOCK ── */
  .lt-sig-section { margin-top: 2rem; padding-top: 1.5rem; border-top: 1.5px solid var(--slate-100); }
  .lt-sig-heading { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 0.9rem; color: var(--slate-900); margin-bottom: 1.2rem; letter-spacing: 0.02em; }
  .lt-sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
  .lt-sig-col { display: flex; flex-direction: column; }
  .lt-sig-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--slate-400); margin-bottom: 0.8rem; }
  .lt-sig-space { height: 72px; border-bottom: 1.5px solid var(--slate-300); margin-bottom: 0.5rem; position: relative; }
  .lt-sig-name-line { font-size: 0.82rem; color: var(--slate-700); font-weight: 600; }
  .lt-sig-name-line input.ef { font-size: 0.82rem; color: var(--slate-700); font-weight: 600; }
  .lt-sig-title-line { font-size: 0.75rem; color: var(--slate-400); margin-top: 0.1rem; }
  .lt-sig-title-line input.ef { font-size: 0.75rem; color: var(--slate-400); }
  .lt-sig-date-line { font-size: 0.75rem; color: var(--slate-400); margin-top: 0.3rem; }

  /* ── INFO ROW ── */
  .lt-info-row { display: flex; gap: 0.6rem; margin-bottom: 0.8rem; align-items: baseline; }
  .lt-info-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--slate-400); white-space: nowrap; min-width: 70px; }
  .lt-info-value { font-size: 0.88rem; color: var(--slate-700); flex: 1; }
  .lt-info-value input.ef { font-size: 0.88rem; color: var(--slate-700); }

  /* ── REMINDER TYPE BADGE ── */
  .lt-reminder-badge { 
    display: inline-flex; 
    align-items: center; 
    gap: 0.4rem; 
    padding: 0.35rem 0.85rem; 
    border-radius: 8px; 
    font-size: 0.8rem; 
    font-weight: 700; 
    background: var(--amber-light); 
    color: #d97706; 
    border: 1px solid rgba(245, 158, 11, 0.2); 
    margin-bottom: 1.2rem; 
  }

  /* ── RIGHT PANEL ── */
  .nf-right-panel { display: flex; flex-direction: column; gap: 1rem; }
  .nf-panel-card { 
    background: #fff; 
    border: 1px solid var(--slate-200); 
    border-radius: 16px; 
    padding: 1.2rem; 
    box-shadow: var(--shadow-sm);
  }
  .nf-panel-title { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: var(--slate-500); margin-bottom: 0.8rem; }
  
  .nf-panel-action-btn { 
    display: flex; 
    align-items: center; 
    gap: 0.6rem; 
    width: 100%; 
    padding: 0.75rem 0.9rem; 
    border: 1.5px solid var(--slate-200); 
    border-radius: 10px; 
    background: #fff; 
    font-family: 'Inter', sans-serif; 
    font-size: 0.85rem; 
    color: var(--slate-700); 
    cursor: pointer; 
    font-weight: 600; 
    text-align: left; 
    transition: all 0.2s ease; 
    margin-bottom: 0.6rem; 
  }
  .nf-panel-action-btn:last-child { margin-bottom: 0; }
  .nf-panel-action-btn:hover { 
    border-color: var(--blue); 
    color: var(--blue); 
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
  .nf-panel-action-btn:active { transform: translateY(0); }
  .nf-panel-action-btn.active-gen { 
    border-color: var(--blue); 
    background: var(--blue-light); 
    color: var(--blue); 
    box-shadow: 0 0 0 1px var(--blue);
  }
  
  .nf-inv-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
  .nf-draft-badge { background: var(--amber-light); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.15); font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 6px; letter-spacing: 0.06em; text-transform: uppercase; }
  .nf-done-badge { background: var(--green-light); color: #059669; border: 1px solid rgba(16, 185, 129, 0.15); font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 6px; letter-spacing: 0.06em; text-transform: uppercase; }
  
  .nf-inv-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; }
  .nf-inv-label { font-size: 0.8rem; color: var(--slate-500); }
  .nf-inv-val { font-size: 0.8rem; color: var(--slate-700); font-weight: 600; }
  .nf-inv-divider { border: none; border-top: 1px solid var(--slate-200); margin: 0.6rem 0; }
  .nf-inv-total-label { font-size: 0.85rem; font-weight: 700; color: var(--slate-900); }
  .nf-inv-total-val { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.1rem; color: var(--blue); }
  
  .nf-sig-status-row { display: flex; flex-direction: column; gap: 0.6rem; }
  .nf-sig-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; }
  .nf-sig-key { color: var(--slate-500); }
  .nf-sig-val { font-weight: 700; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em; }
  .nf-sig-val.ok { color: #059669; }
  .nf-sig-val.err { color: var(--red); }
  .nf-sig-val.wait { color: var(--slate-400); }
  
  .nf-ai-card { 
    background: linear-gradient(135deg, rgba(79, 70, 229, 0.06) 0%, rgba(37, 99, 235, 0.03) 100%); 
    border: 1px solid rgba(79, 70, 229, 0.15); 
    border-radius: 16px; 
    padding: 1.1rem; 
  }
  .nf-ai-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #4f46e5; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.4rem; }
  .nf-ai-text { font-size: 0.82rem; color: var(--slate-700); line-height: 1.6; font-style: italic; margin-bottom: 0.8rem; }
  .nf-ai-text strong { font-style: normal; color: var(--slate-900); }
  
  .nf-apply-btn { 
    width: 100%; 
    padding: 0.6rem; 
    background: linear-gradient(135deg, #4f46e5, #4338ca); 
    color: #fff; 
    border: none; 
    border-radius: 10px; 
    font-family: 'Inter', sans-serif; 
    font-size: 0.8rem; 
    font-weight: 700; 
    cursor: pointer; 
    text-transform: uppercase; 
    letter-spacing: 0.06em; 
    transition: all 0.2s;
    box-shadow: 0 4px 10px rgba(79, 70, 229, 0.25);
  }
  .nf-apply-btn:hover {
    background: linear-gradient(135deg, #6366f1, #4f46e5); 
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(79, 70, 229, 0.35);
  }
  .nf-apply-btn:active { transform: translateY(0); }

  /* ── TOAST ── */
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

  .edit-hint { 
    font-size: 0.72rem; 
    color: var(--blue); 
    background: var(--blue-light); 
    border: 1px solid var(--blue-mid); 
    border-radius: 6px; 
    padding: 0.25rem 0.6rem; 
    font-weight: 700; 
    letter-spacing: 0.04em; 
    display: inline-flex; 
    align-items: center; 
    gap: 0.3rem; 
  }

  /* ── NEXT STEPS TABLE ── */
  .lt-steps-table { width: 100%; border-collapse: collapse; margin: 0.8rem 0 1.4rem; font-size: 0.88rem; }
  .lt-steps-table th { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--slate-400); text-align: left; padding: 0.6rem 0.8rem; border-bottom: 2px solid var(--slate-200); }
  .lt-steps-table td { padding: 0.7rem 0.8rem; border-bottom: 1px solid var(--slate-100); color: var(--slate-700); font-size: 0.88rem; }
  .lt-steps-table td input.ef { font-size: 0.88rem; color: var(--slate-700); }
  .lt-step-num { 
    width: 28px; height: 28px; 
    border-radius: 50%; 
    background: linear-gradient(135deg, var(--blue), var(--blue-hover)); 
    color: #fff; 
    display: inline-flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 0.78rem; 
    font-weight: 700; 
    flex-shrink: 0; 
    box-shadow: 0 2px 6px rgba(37,99,235,0.2);
  }

  @media print {
    @page {
      size: auto;
      margin: 0;
    }

    /* Force browsers to keep background colors/gradients/images when printing */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }

    /* kill the grey app background everywhere */
    .nf-app, .nf-main {
      background: white !important;
      display: block !important;
      min-height: 0 !important;
    }

    /* remove the padding that was creating the white/grey margin gap */
    .nf-content {
      padding: 0 !important;
      margin: 0 !important;
    }

    .nf-sidebar,.nf-topbar,.nf-right-panel,.nf-tabs,.nf-breadcrumb,.nf-workflow,.nf-doc-cards,.nf-doc-actions,.nf-email-actions,.nf-placeholder-chips,.edit-hint,.nf-header-row,.print-hide { display:none!important; }

    .nf-doc-layout {
      grid-template-columns: 1fr !important;
      gap: 0 !important;
      display: block !important;
    }

    /* let the letter fill the full page width, no rounded corners/border/shadow cutting it short */
    .nf-doc-preview {
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
    }

    /* give the letter body its own print-safe inner margin instead of relying on nf-content padding */
    .lt-body {
      padding: 1.6cm 1.8cm !important;
    }

    .ef { background:transparent!important; box-shadow:none!important; }

    /* explicitly re-affirm the header gradient survives print */
    .lt-header {
      background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%) !important;
      width: 100% !important;
    }
    .lt-company-name-hdr,
    .lt-company-tag-hdr,
    .lt-contact-line,
    .lt-contact-line span { color: #fff !important; }
    .lt-contact-line input.ef { color: rgba(255,255,255,0.7) !important; }

    /* preserve badge colors */
    .nf-meta-badge.client { background: var(--green-light) !important; color: #047857 !important; }
    .nf-meta-badge.date { background: var(--amber-light) !important; color: #b45309 !important; }
    .nf-meta-badge.budget { background: var(--blue-light) !important; color: var(--blue) !important; }
    .lt-reminder-badge { background: var(--amber-light) !important; color: #d97706 !important; }
    .nf-draft-badge { background: var(--amber-light) !important; color: #d97706 !important; }
    .nf-done-badge { background: var(--green-light) !important; color: #059669 !important; }

    /* preserve blue accents in the letter body */
    .lt-section-h { border-left-color: var(--blue) !important; }
    .lt-bullet-dot { background: var(--blue) !important; }
    .lt-step-num {
      background: linear-gradient(135deg, var(--blue), var(--blue-hover)) !important;
      color: #fff !important;
    }
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

const WORKFLOW_STEPS = ["Draft", "Generated", "Reviewed", "Sent", "Approved"];

const COMPANY = {
  name: "Zeptrix",
  full: "Zeptrix IT Solutions Private Limited",
  tag:  "IT Solutions Private Limited",
  addr: "chennai",
  email: "zeptrixinfo@gmail.com",
  phone: "+91 8778785566",
  web:   "www.zeptrix.in",
  logoUrl: "http://127.0.0.1:8000/static/zeptrix_logo.png",
};

function AutoTextarea({ value, onChange, className, style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) { ref.current.style.height = "auto"; ref.current.style.height = ref.current.scrollHeight + "px"; }
  }, [value]);
  return <textarea ref={ref} className={className} style={{ overflow: "hidden", ...style }} value={value} onChange={onChange} />;
}

function EI({ value, onChange, style, className = "" }) {
  return <input className={`ef ${className}`} style={style} value={value} onChange={e => onChange(e.target.value)} />;
}
function EA({ value, onChange, style, className = "" }) {
  return <AutoTextarea className={`ef ${className}`} style={style} value={value} onChange={e => onChange(e.target.value)} />;
}

function CompanyLogo({ size = 42, style = {} }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState(false);
  return (
    <div className="lt-logo-circle" style={{ width: size, height: size, ...style }}>
      {!error && <img src={COMPANY.logoUrl} alt="logo" onLoad={() => setLoaded(true)} onError={() => setError(true)} style={{ display: loaded ? "block" : "none", width: "100%", height: "100%", objectFit: "contain" }} />}
      {(!loaded || error) && <span className="lt-logo-fallback" style={{ fontSize: size * 0.42 }}>Z</span>}
    </div>
  );
}

function LetterHeader({ contactLines }) {
  return (
    <div className="lt-header">
      <div className="lt-logo-block">
        <CompanyLogo />
        <div>
          <div className="lt-company-name-hdr">{COMPANY.name}</div>
          <div className="lt-company-tag-hdr">{COMPANY.tag}</div>
        </div>
      </div>
      <div className="lt-contact-block">
        {contactLines.map((line, i) => (
          <div key={i} className="lt-contact-line" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.25rem" }}>
            {line.icon && <span className="material-symbols-outlined" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>{line.icon}</span>}
            <span>{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignatureBlock({ clientName }) {
  return (
    <div className="lt-sig-section">
      <div className="lt-sig-heading">Authorised Signatures</div>
      <div className="lt-sig-grid">
        <div className="lt-sig-col">
          <div className="lt-sig-label">For {COMPANY.name}</div>
          <div className="lt-sig-space" />
          <div className="lt-sig-name-line">{COMPANY.full}</div>
          <div className="lt-sig-title-line">Authorised Signatory</div>
          <div className="lt-sig-date-line">Date: _______________</div>
        </div>
        <div className="lt-sig-col">
          <div className="lt-sig-label">Client Acknowledgement</div>
          <div className="lt-sig-space" />
          <div className="lt-sig-name-line">{clientName || "Client Name"}</div>
          <div className="lt-sig-title-line">Authorised Signatory</div>
          <div className="lt-sig-date-line">Date: _______________</div>
        </div>
      </div>
    </div>
  );
}

export default function NexaFlowDocuments() {
  const [activeNav, setActiveNav]         = useState("Documents");
  const [activeTab, setActiveTab]         = useState("agreement");
  const [loading, setLoading]             = useState(true);
  const [toast, setToast]                 = useState(null);
  const [wfStep, setWfStep]               = useState(0);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [sigSaved, setSigSaved]           = useState(false);
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  // ── Agreement state ──
  const [agr, setAgr] = useState({
    title: "Service Agreement Letter to Client",
    refNo: "ZPX-2026-0001",
    date: today,
    clientName: "", clientCompany: "", clientAddr: "", clientCity: "",
    subject: "Service Agreement",
    salutation: "",
    intro: "We are pleased to present you with this Service Agreement, which sets forth the terms and conditions under which we will provide our professional services to you. We greatly appreciate the opportunity to work with you and are committed to delivering the highest quality of service.",
    projectName: "", status: "", deadline: "",
    overview: "",
    deliverable1: "Data Analysis: Comprehensive analysis of your company's operational data to identify trends and actionable insights.",
    deliverable2: "Report Generation: Creation of detailed reports summarizing our findings and recommendations.",
    deliverable3: "Implementation Support: Guidance and support for implementing recommended changes.",
    budget: "0",
    gstNote: "GST @ 18%",
    paymentTerms: "Full payment due within 30 days of invoice date. Late payments attract 2% per month interest.",
    closing: "Sincerely,",
    signerName: "Founder & CEO",
  });

  // ── Invoice state ──
  const [inv, setInv] = useState({
    title: "Tax Invoice",
    refNo: "INV-2026-001",
    date: today,
    clientName: "", clientCompany: "", clientAddr: "",
    subject: "Invoice for Professional Services",
    salutation: "",
    intro: "Please find below the invoice for services rendered as per our agreement. We appreciate your continued trust in our services.",
    serviceDesc: "Project Services",
    gstRate: "18",
    paymentTerms: "Full payment due within 30 days of invoice date. Late payments attract 2% per month interest.",
    closing: "Sincerely,",
  });

  // ── Welcome Letter state ──
  const [wel, setWel] = useState({
    refNo: "WEL-2026-001",
    date: today,
    clientName: "", clientCompany: "", clientAddr: "",
    subject: "Welcome to Zeptrix — Project Kickoff",
    salutation: "",
    intro: "We are absolutely thrilled to welcome you to the Zeptrix family. Your decision to partner with us marks the beginning of what we are confident will be a highly productive and successful collaboration.",
    projectName: "",
    deadline: "",
    status: "",
    step1: "Kickoff call scheduling — our team will reach out within 24 hours to set up the initial meeting.",
    step2: "Requirements finalization — we will work together to lock down all project specifications.",
    step3: "Development sprint begins — our engineers will commence work as per the agreed timeline.",
    commitment: "We are fully committed to delivering exceptional results for your project. Should you have any questions, concerns, or need clarification at any stage, please do not hesitate to reach out to us directly.",
    closing: "Warm regards,",
  });

  // ── Reminder Letter state ──
  const [rem, setRem] = useState({
    refNo: "REM-2026-001",
    date: today,
    clientName: "", clientCompany: "", clientAddr: "",
    reminderType: "Payment Reminder",
    subject: "Gentle Payment Reminder",
    salutation: "",
    intro: "We hope this letter finds you in good health. We are writing to bring to your attention a pending item related to your ongoing project with us.",
    projectName: "",
    dueDate: "",
    dueAmount: "",
    context: "We understand that oversights can happen in the course of busy business operations. We kindly request you to process the pending payment at your earliest convenience to ensure uninterrupted continuation of the project.",
    closing: "Sincerely,",
  });

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await fetch("http://127.0.0.1:8000/api/dashboard/get-projects", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await res.json();
        if (res.ok && data.data?.length) {
          const p    = [...data.data].sort((a, b) => b.project_id - a.project_id)[0];
          const budget = p.budget ?? 0;
          const refA   = `ZPX-${new Date().getFullYear()}-${String(p.project_id).padStart(4, "0")}`;
          const refI   = `INV-${new Date().getFullYear()}-${String(p.project_id).padStart(3, "0")}`;
          const refW   = `WEL-${new Date().getFullYear()}-${String(p.project_id).padStart(3, "0")}`;
          const refR   = `REM-${new Date().getFullYear()}-${String(p.project_id).padStart(3, "0")}`;

          setAgr(prev => ({
            ...prev, refNo: refA,
            clientName: p.client_name ?? "", salutation: `Dear ${p.client_name ?? "Client"},`,
            projectName: p.project_name ?? "", status: p.status ?? "", deadline: p.deadline ?? "",
            budget: String(budget),
            overview: `This Service Agreement is entered into between ${COMPANY.full} ("Service Provider") and ${p.client_name ?? "the Client"} for the delivery of ${p.project_name ?? "the project"}. The engagement covers all work described herein, with a scheduled completion by ${p.deadline ?? "—"}.`,
          }));
          setInv(prev => ({
            ...prev, refNo: refI,
            clientName: p.client_name ?? "", salutation: `Dear ${p.client_name ?? "Client"},`,
            serviceDesc: `Project Services — ${p.project_name ?? ""}`,
          }));
          setWel(prev => ({
            ...prev, refNo: refW,
            clientName: p.client_name ?? "", clientCompany: "",
            salutation: `Dear ${p.client_name ?? "Client"},`,
            subject: `Welcome to Zeptrix — ${p.project_name ?? "Your Project"}`,
            projectName: p.project_name ?? "",
            deadline: p.deadline ?? "",
            status: p.status ?? "",
          }));
          setRem(prev => ({
            ...prev, refNo: refR,
            clientName: p.client_name ?? "", clientCompany: "",
            salutation: `Dear ${p.client_name ?? "Client"},`,
            subject: `Gentle Payment Reminder — ${p.project_name ?? "Your Project"}`,
            projectName: p.project_name ?? "",
            dueDate: p.deadline ?? "",
            dueAmount: String(budget),
          }));
        }
      } catch { showToast("Could not load project data", "error"); }
      finally { setLoading(false); }
    })();
  }, []);

  const budget   = parseFloat(agr.budget) || 0;
  const gstRate  = parseFloat(inv.gstRate) || 18;
  const gstAmt   = +(budget * gstRate / 100).toFixed(2);
  const totalAmt = +(budget + gstAmt).toFixed(2);
  const fmt = n => {
    const val = Number(n);
    return isNaN(val) ? "₹0.00" : `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const a  = field => ({ value: agr[field], onChange: v => setAgr(p => ({ ...p, [field]: v })) });
  const iv = field => ({ value: inv[field], onChange: v => setInv(p => ({ ...p, [field]: v })) });
  const w  = field => ({ value: wel[field], onChange: v => setWel(p => ({ ...p, [field]: v })) });
  const r  = field => ({ value: rem[field], onChange: v => setRem(p => ({ ...p, [field]: v })) });

  const contactLines = [
    { text: COMPANY.addr, icon: "location_on" },
    { text: COMPANY.email, icon: "mail" },
    { text: COMPANY.phone, icon: "call" },
    { text: COMPANY.web, icon: "language" },
  ];

  const handleSaveAgreement = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/dashboard/generate-agreement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ agreement_data: agr }),
      });
      if (res.ok) { setSigSaved(true); setWfStep(2); showToast("✅ Agreement saved!"); }
      else showToast("Failed to save agreement", "error");
    } catch { showToast("Could not reach server", "error"); }
  };

  const handleGenerateInvoice = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/dashboard/generate-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ invoice_number: inv.refNo, base_amount: budget, gst_percentage: gstRate, gst_amount: gstAmt, total_amount: totalAmt }),
      });
      if (res.ok) { setInvoiceGenerated(true); setWfStep(1); showToast("✅ Invoice generated!"); setActiveTab("invoice"); }
      else showToast("Failed to generate invoice", "error");
    } catch { showToast("Could not reach server", "error"); }
  };

  // Tab-aware print
  const handlePrint = () => window.print();

  return (
    <>
      <style>{styles}</style>
      {toast && <div className={`nf-toast ${toast.type}`}>{toast.msg}</div>}

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
              <input placeholder="Search documents, invoices..." />
            </div>
            <div className="nf-topbar-actions">
              <div className="nf-icon-btn">🔔</div>
              <div className="nf-icon-btn">❓</div>
              <div className="nf-user">
                <div><div className="nf-user-name">Alex Rivera</div><div className="nf-user-role">Admin Account</div></div>
                <div className="nf-avatar">AR</div>
              </div>
            </div>
          </header> */}

          <main className="nf-content">
            <div className="nf-breadcrumb">
              <span>Projects</span>
              <span className="nf-breadcrumb-sep">›</span>
              <span className="nf-breadcrumb-active">Documents</span>
            </div>

            {/* WORKFLOW */}
            {/* <div className="nf-workflow">
              {WORKFLOW_STEPS.map((step, idx) => (
                <div key={step} className="nf-wf-step">
                  <div className={`nf-wf-dot ${idx < wfStep ? "done" : idx === wfStep ? "active" : "pending"}`}>{idx < wfStep ? "✓" : idx + 1}</div>
                  <span className={`nf-wf-label ${idx < wfStep ? "done" : idx === wfStep ? "active" : "pending"}`}>{step}</span>
                  {idx < WORKFLOW_STEPS.length - 1 && <span className="nf-wf-arrow">→</span>}
                </div>
              ))}
            </div> */}

            {/* HEADER ROW */}
            <div className="nf-header-row">
              <div>
                {loading
                  ? <div style={{ height: "2rem", width: "280px", background: "#e9ebf0", borderRadius: 6, marginBottom: "0.5rem" }} />
                  : <div className="nf-doc-title">{agr.projectName || "No Project Loaded"}</div>
                }
                <div className="nf-doc-meta">
                  {!loading && agr.clientName && (
                    <>
                      <span className="nf-meta-badge client"><span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>person</span> {agr.clientName}</span>
                      <span className="nf-meta-badge date"><span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>calendar_today</span> Due {agr.deadline}</span>
                      <span className="nf-meta-badge budget"><span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>payments</span> {fmt(budget)}</span>
                    </>
                  )}
                  <span className="edit-hint"><span className="material-symbols-outlined" style={{ fontSize: "0.95rem" }}>edit</span> Click any field to edit</span>
                </div>
              </div>
              <div className="nf-doc-actions">
                <button className="nf-action-btn-top" onClick={handlePrint}><span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>download</span> Download PDF</button>
              </div>
            </div>

            {/* DOC CARDS */}
            <div className="nf-doc-cards">
              {[
                { key: "agreement", icon: "description", name: "Agreement" },
                { key: "invoice",   icon: "receipt_long", name: "Invoice" },
                { key: "welcome",   icon: "handshake", name: "Welcome Letter" },
                { key: "reminder",  icon: "notifications_active", name: "Reminder Letter" },
              ].map(({ key, icon, name }) => (
                <div key={key} className={`nf-doc-card${activeTab === key ? " active-card" : ""}`} onClick={() => setActiveTab(key)}>
                  <div className="nf-doc-card-icon">
                    <span className="material-symbols-outlined" style={{ fontSize: "2rem", color: "var(--blue)" }}>{icon}</span>
                  </div>
                  <div className="nf-doc-card-name">{name}</div>
                  <div className="nf-doc-card-meta">Click to view & edit</div>
                </div>
              ))}
            </div>

            {/* TABS */}
            <div className="nf-tabs">
              {["agreement","invoice","welcome","reminder"].map(tab => (
                <button key={tab} className={`nf-tab${activeTab === tab ? " active" : ""}`} onClick={() => setActiveTab(tab)}>
                  {tab === "agreement" ? "Agreement" : tab === "invoice" ? "Invoice" : tab === "welcome" ? "Welcome Letter" : "Reminder Letter"}
                </button>
              ))}
            </div>

            <div className="nf-doc-layout">
              <div className="nf-doc-preview">

                {/* ══ AGREEMENT ══ */}
                {activeTab === "agreement" && (
                  <>
                    <LetterHeader contactLines={contactLines} />
                    <div className="lt-body">
                      <div className="lt-title-wrap">
                        <div className="lt-doc-title">
                          <EI {...a("title")} style={{ textAlign: "center", fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "var(--gray-900)" }} />
                        </div>
                        <div className="lt-ref-line">
                          <EI {...a("refNo")} style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--gray-400)" }} />
                        </div>
                      </div>
                      <div className="lt-date-line">
                        <EI {...a("date")} style={{ fontSize: "0.82rem", color: "var(--gray-700)", fontWeight: 500 }} />
                      </div>
                      <div className="lt-address-block">
                        <div className="lt-addr-name"><EI {...a("clientName")} style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--gray-900)" }} /></div>
                        <div className="lt-addr-line"><EI {...a("clientCompany")} style={{ fontSize: "0.8rem", color: "#4b5563" }} placeholder="Client Company" /></div>
                        <div className="lt-addr-line"><EA {...a("clientAddr")} style={{ fontSize: "0.8rem", color: "#4b5563", lineHeight: "1.65" }} placeholder="Client Address" /></div>
                      </div>
                      <div className="lt-subject-line">
                        <strong>Subject: </strong>
                        <EI {...a("subject")} style={{ fontSize: "0.82rem", color: "var(--gray-900)", fontWeight: 700 }} />
                      </div>
                      <div className="lt-salutation">
                        <EI {...a("salutation")} style={{ fontSize: "0.85rem", color: "var(--gray-900)", fontWeight: 600 }} />
                      </div>
                      <div className="lt-para">
                        <EA {...a("intro")} style={{ fontSize: "0.82rem", color: "var(--gray-700)", lineHeight: "1.75" }} />
                      </div>
                      <div className="lt-section-h">1. Scope of Services</div>
                      <div className="lt-para">
                        <EA {...a("overview")} style={{ fontSize: "0.82rem", color: "var(--gray-700)", lineHeight: "1.75" }} />
                      </div>
                      <div className="lt-section-h">2. Deliverables</div>
                      <div className="lt-bullets">
                        {["deliverable1","deliverable2","deliverable3"].map(k => (
                          <div key={k} className="lt-bullet-item">
                            <span className="lt-bullet-dot" />
                            <EI {...a(k)} style={{ fontSize: "0.82rem", color: "var(--gray-700)" }} />
                          </div>
                        ))}
                      </div>
                      <div className="lt-section-h">3. Financial Summary</div>
                      <table className="lt-fin-table">
                        <thead><tr><th>Description</th><th>Amount</th></tr></thead>
                        <tbody>
                          <tr>
                            <td>Project Delivery Fee</td>
                            <td><span>₹ </span><EI {...a("budget")} style={{ fontSize: "0.82rem", color: "var(--gray-700)", fontWeight: 600, width: "80px", textAlign: "right" }} /></td>
                          </tr>
                          <tr>
                            <td><EI {...a("gstNote")} style={{ fontSize: "0.82rem", color: "var(--gray-700)" }} /></td>
                            <td>{fmt(gstAmt)}</td>
                          </tr>
                          <tr className="total-row">
                            <td><strong>Total Payable</strong></td>
                            <td><strong>{fmt(totalAmt)}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="lt-section-h">4. Payment Terms</div>
                      <div className="lt-para">
                        <EA {...a("paymentTerms")} style={{ fontSize: "0.82rem", color: "var(--gray-700)", lineHeight: "1.75" }} />
                      </div>
                      <div className="lt-closing"><EI {...a("closing")} style={{ fontSize: "0.82rem", color: "var(--gray-700)" }} /></div>
                      <div className="lt-sign-company" style={{ marginTop: "0.3rem" }}>{COMPANY.name}</div>
                      <SignatureBlock clientName={agr.clientName} />
                    </div>
                  </>
                )}

                {/* ══ INVOICE ══ */}
                {activeTab === "invoice" && (
                  <>
                    <LetterHeader contactLines={contactLines} />
                    <div className="lt-body">
                      <div className="lt-title-wrap">
                        <div className="lt-doc-title">
                          <EI {...iv("title")} style={{ textAlign: "center", fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "var(--gray-900)" }} />
                        </div>
                        <div className="lt-ref-line">
                          <EI {...iv("refNo")} style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--gray-400)" }} />
                          &nbsp;|&nbsp;GST: {COMPANY.gst}
                          &nbsp;|&nbsp;<span className={invoiceGenerated ? "nf-done-badge" : "nf-draft-badge"}>{invoiceGenerated ? "Generated" : "Draft"}</span>
                        </div>
                      </div>
                      <div className="lt-date-line">
                        <EI {...iv("date")} style={{ fontSize: "0.82rem", color: "var(--gray-700)", fontWeight: 500 }} />
                      </div>
                      <div className="lt-address-block">
                        <div className="lt-addr-name"><EI {...iv("clientName")} style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--gray-900)" }} /></div>
                        <div className="lt-addr-line"><EI {...iv("clientCompany")} style={{ fontSize: "0.8rem", color: "#4b5563" }} placeholder="Client Company" /></div>
                        <div className="lt-addr-line"><EA {...iv("clientAddr")} style={{ fontSize: "0.8rem", color: "#4b5563", lineHeight: "1.65" }} placeholder="Client Address" /></div>
                      </div>
                      <div className="lt-subject-line">
                        <strong>Subject: </strong>
                        <EI {...iv("subject")} style={{ fontSize: "0.82rem", color: "var(--gray-900)", fontWeight: 700 }} />
                      </div>
                      <div className="lt-salutation">
                        <EI {...iv("salutation")} style={{ fontSize: "0.85rem", color: "var(--gray-900)", fontWeight: 600 }} />
                      </div>
                      <div className="lt-para">
                        <EA {...iv("intro")} style={{ fontSize: "0.82rem", color: "var(--gray-700)", lineHeight: "1.75" }} />
                      </div>
                      <div className="lt-section-h">Invoice Details</div>
                      <table className="lt-fin-table">
                        <thead><tr><th>Description</th><th>Amount</th></tr></thead>
                        <tbody>
                          <tr>
                            <td><EI {...iv("serviceDesc")} style={{ fontSize: "0.82rem", color: "var(--gray-700)" }} /></td>
                            <td>{fmt(budget)}</td>
                          </tr>
                          <tr>
                            <td>
                              <span>GST (</span>
                              <input className="ef" style={{ width: 28, fontSize: "0.82rem", color: "var(--gray-700)", display: "inline" }} value={inv.gstRate} onChange={e => setInv(p => ({ ...p, gstRate: e.target.value }))} />
                              <span>%)</span>
                            </td>
                            <td>{fmt(gstAmt)}</td>
                          </tr>
                          <tr className="total-row">
                            <td><strong>Total Amount Due</strong></td>
                            <td><strong style={{ color: "var(--blue)", fontSize: "1rem", fontFamily: "'Inter',sans-serif" }}>{fmt(totalAmt)}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="lt-section-h">Payment Terms</div>
                      <div className="lt-para">
                        <EA {...iv("paymentTerms")} style={{ fontSize: "0.82rem", color: "var(--gray-700)", lineHeight: "1.75" }} />
                      </div>
                      <div className="lt-closing"><EI {...iv("closing")} style={{ fontSize: "0.82rem", color: "var(--gray-700)" }} /></div>
                      <div className="lt-sign-company" style={{ marginTop: "0.3rem" }}>{COMPANY.name}</div>
                      <SignatureBlock clientName={inv.clientName} />
                    </div>
                  </>
                )}

                {/* ══ WELCOME LETTER — same company letter format ══ */}
                {activeTab === "welcome" && (
                  <>
                    <LetterHeader contactLines={contactLines} />
                    <div className="lt-body">
                      {/* Title */}
                      <div className="lt-title-wrap">
                        <div className="lt-doc-title" style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "var(--gray-900)" }}>
                          Welcome Letter
                        </div>
                        <div className="lt-ref-line">
                          <EI {...w("refNo")} style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--gray-400)" }} />
                        </div>
                      </div>

                      {/* Date */}
                      <div className="lt-date-line">
                        <EI {...w("date")} style={{ fontSize: "0.82rem", color: "var(--gray-700)", fontWeight: 500 }} />
                      </div>

                      {/* Address */}
                      <div className="lt-address-block">
                        <div className="lt-addr-name"><EI {...w("clientName")} style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--gray-900)" }} placeholder="Client Name" /></div>
                        <div className="lt-addr-line"><EI {...w("clientCompany")} style={{ fontSize: "0.8rem", color: "#4b5563" }} placeholder="Client Company" /></div>
                        <div className="lt-addr-line"><EA {...w("clientAddr")} style={{ fontSize: "0.8rem", color: "#4b5563", lineHeight: "1.65" }} placeholder="Client Address" /></div>
                      </div>

                      {/* Subject */}
                      <div className="lt-subject-line">
                        <strong>Subject: </strong>
                        <EI {...w("subject")} style={{ fontSize: "0.82rem", color: "var(--gray-900)", fontWeight: 700 }} />
                      </div>

                      {/* Salutation */}
                      <div className="lt-salutation">
                        <EI {...w("salutation")} style={{ fontSize: "0.85rem", color: "var(--gray-900)", fontWeight: 600 }} />
                      </div>

                      {/* Intro */}
                      <div className="lt-para">
                        <EA {...w("intro")} style={{ fontSize: "0.82rem", color: "var(--gray-700)", lineHeight: "1.75" }} />
                      </div>

                      {/* Section 1 — Project Details */}
                      <div className="lt-section-h">1. Project Details</div>
                      <table className="lt-fin-table">
                        <thead><tr><th>Field</th><th style={{ textAlign: "left" }}>Details</th></tr></thead>
                        <tbody>
                          <tr>
                            <td style={{ color: "var(--gray-500)", fontWeight: 600 }}>Project Name</td>
                            <td style={{ textAlign: "left" }}><EI {...w("projectName")} style={{ fontSize: "0.82rem", color: "var(--gray-700)" }} placeholder="Project Name" /></td>
                          </tr>
                          <tr>
                            <td style={{ color: "var(--gray-500)", fontWeight: 600 }}>Timeline</td>
                            <td style={{ textAlign: "left" }}><EI {...w("deadline")} style={{ fontSize: "0.82rem", color: "var(--gray-700)" }} placeholder="Deadline" /></td>
                          </tr>
                          <tr>
                            <td style={{ color: "var(--gray-500)", fontWeight: 600 }}>Current Status</td>
                            <td style={{ textAlign: "left" }}><EI {...w("status")} style={{ fontSize: "0.82rem", color: "var(--gray-700)" }} placeholder="Status" /></td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Section 2 — Next Steps */}
                      <div className="lt-section-h">2. Next Steps</div>
                      <div className="lt-bullets">
                        {["step1","step2","step3"].map((k, i) => (
                          <div key={k} className="lt-bullet-item">
                            <span className="lt-step-num">{i + 1}</span>
                            <EI {...w(k)} style={{ fontSize: "0.82rem", color: "var(--gray-700)" }} />
                          </div>
                        ))}
                      </div>

                      {/* Section 3 — Our Commitment */}
                      <div className="lt-section-h">3. Our Commitment to You</div>
                      <div className="lt-para">
                        <EA {...w("commitment")} style={{ fontSize: "0.82rem", color: "var(--gray-700)", lineHeight: "1.75" }} />
                      </div>

                      {/* Closing */}
                      <div className="lt-closing"><EI {...w("closing")} style={{ fontSize: "0.82rem", color: "var(--gray-700)" }} /></div>
                      <div className="lt-sign-company" style={{ marginTop: "0.3rem" }}>{COMPANY.name}</div>

                      {/* Signature block */}
                      <SignatureBlock clientName={wel.clientName} />
                    </div>
                  </>
                )}

                {/* ══ REMINDER LETTER — same company letter format ══ */}
                {activeTab === "reminder" && (
                  <>
                    <LetterHeader contactLines={contactLines} />
                    <div className="lt-body">
                      {/* Title */}
                      <div className="lt-title-wrap">
                        <div className="lt-doc-title" style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "var(--gray-900)" }}>
                          Reminder Letter
                        </div>
                        <div className="lt-ref-line" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                          <EI {...r("refNo")} style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--gray-400)", width: "auto" }} />
                          &nbsp;|&nbsp;
                          {/* Reminder type selector — hidden on print */}
                          <select
                            className="print-hide"
                            style={{ fontSize: "0.7rem", color: "var(--gray-500)", border: "1px solid var(--gray-200)", borderRadius: 5, padding: "0.1rem 0.3rem", background: "#fff", cursor: "pointer" }}
                            value={rem.reminderType}
                            onChange={e => setRem(p => ({ ...p, reminderType: e.target.value }))}
                          >
                            <option>Payment Reminder</option>
                            <option>Deadline Reminder</option>
                            <option>Pending Approval Reminder</option>
                          </select>
                          <span className="lt-reminder-badge" style={{ fontSize: "0.65rem", padding: "0.1rem 0.45rem" }}>{rem.reminderType}</span>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="lt-date-line">
                        <EI {...r("date")} style={{ fontSize: "0.82rem", color: "var(--gray-700)", fontWeight: 500 }} />
                      </div>

                      {/* Address */}
                      <div className="lt-address-block">
                        <div className="lt-addr-name"><EI {...r("clientName")} style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--gray-900)" }} placeholder="Client Name" /></div>
                        <div className="lt-addr-line"><EI {...r("clientCompany")} style={{ fontSize: "0.8rem", color: "#4b5563" }} placeholder="Client Company" /></div>
                        <div className="lt-addr-line"><EA {...r("clientAddr")} style={{ fontSize: "0.8rem", color: "#4b5563", lineHeight: "1.65" }} placeholder="Client Address" /></div>
                      </div>

                      {/* Subject */}
                      <div className="lt-subject-line">
                        <strong>Subject: </strong>
                        <EI {...r("subject")} style={{ fontSize: "0.82rem", color: "var(--gray-900)", fontWeight: 700 }} />
                      </div>

                      {/* Salutation */}
                      <div className="lt-salutation">
                        <EI {...r("salutation")} style={{ fontSize: "0.85rem", color: "var(--gray-900)", fontWeight: 600 }} />
                      </div>

                      {/* Intro */}
                      <div className="lt-para">
                        <EA {...r("intro")} style={{ fontSize: "0.82rem", color: "var(--gray-700)", lineHeight: "1.75" }} />
                      </div>

                      {/* Section 1 — Pending Details */}
                      <div className="lt-section-h">1. Pending Item Summary</div>
                      <table className="lt-fin-table">
                        <thead><tr><th>Field</th><th style={{ textAlign: "left" }}>Details</th></tr></thead>
                        <tbody>
                          <tr>
                            <td style={{ color: "var(--gray-500)", fontWeight: 600 }}>Project</td>
                            <td style={{ textAlign: "left" }}><EI {...r("projectName")} style={{ fontSize: "0.82rem", color: "var(--gray-700)" }} placeholder="Project Name" /></td>
                          </tr>
                          <tr>
                            <td style={{ color: "var(--gray-500)", fontWeight: 600 }}>Due Date</td>
                            <td style={{ textAlign: "left" }}><EI {...r("dueDate")} style={{ fontSize: "0.82rem", color: "var(--gray-700)" }} placeholder="Due Date" /></td>
                          </tr>
                          <tr className="total-row">
                            <td style={{ color: "var(--gray-900)", fontWeight: 700 }}>Amount Due</td>
                            <td style={{ textAlign: "left" }}>
                              <span>₹ </span>
                              <input className="ef" style={{ fontSize: "0.82rem", color: "var(--blue)", fontWeight: 700, width: "120px", fontFamily: "'Inter',sans-serif" }}
                                value={rem.dueAmount} onChange={e => setRem(p => ({ ...p, dueAmount: e.target.value }))} placeholder="0.00" />
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Section 2 — Context */}
                      <div className="lt-section-h">2. Additional Context</div>
                      <div className="lt-para">
                        <EA {...r("context")} style={{ fontSize: "0.82rem", color: "var(--gray-700)", lineHeight: "1.75" }} />
                      </div>

                      {/* Bullet reminders */}
                      <div className="lt-section-h">3. Action Required</div>
                      <div className="lt-bullets">
                        <div className="lt-bullet-item">
                          <span className="lt-bullet-dot" />
                          <span style={{ fontSize: "0.82rem", color: "var(--gray-700)" }}>Process the pending payment at the earliest convenience.</span>
                        </div>
                        <div className="lt-bullet-item">
                          <span className="lt-bullet-dot" />
                          <span style={{ fontSize: "0.82rem", color: "var(--gray-700)" }}>Reach out to us immediately if there are any concerns or disputes.</span>
                        </div>
                        <div className="lt-bullet-item">
                          <span className="lt-bullet-dot" />
                          <span style={{ fontSize: "0.82rem", color: "var(--gray-700)" }}>Retain this letter for your records and reference.</span>
                        </div>
                      </div>

                      {/* Closing */}
                      <div className="lt-closing"><EI {...r("closing")} style={{ fontSize: "0.82rem", color: "var(--gray-700)" }} /></div>
                      <div className="lt-sign-company" style={{ marginTop: "0.3rem" }}>{COMPANY.name}</div>

                      {/* Signature block */}
                      <SignatureBlock clientName={rem.clientName} />
                    </div>
                  </>
                )}

              </div>{/* end nf-doc-preview */}

              {/* RIGHT PANEL */}
              <div className="nf-right-panel">
                <div className="nf-panel-card">
                  <div className="nf-panel-title">Document Actions</div>
                  <button className={`nf-panel-action-btn${activeTab === "agreement" ? " active-gen" : ""}`} onClick={() => setActiveTab("agreement")}>
                    <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>edit</span> View Agreement
                  </button>
                  <button className={`nf-panel-action-btn${activeTab === "invoice" ? " active-gen" : ""}`} onClick={handleGenerateInvoice}>
                    <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>receipt_long</span> Generate Invoice
                  </button>
                  <button className={`nf-panel-action-btn${activeTab === "welcome" ? " active-gen" : ""}`} onClick={() => setActiveTab("welcome")}>
                    <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>handshake</span> Welcome Letter
                  </button>
                  <button className={`nf-panel-action-btn${activeTab === "reminder" ? " active-gen" : ""}`} onClick={() => setActiveTab("reminder")}>
                    <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>notifications_active</span> Reminder Letter
                  </button>
                </div>

                <div className="nf-panel-card">
                  <div className="nf-panel-title">Download Documents</div>
                  {[
                    { key: "agreement", icon: "description", label: "Agreement PDF" },
                    { key: "invoice",   icon: "receipt_long", label: "Invoice PDF" },
                    { key: "welcome",   icon: "handshake", label: "Welcome Letter PDF" },
                    { key: "reminder",  icon: "notifications_active", label: "Reminder Letter PDF" },
                  ].map(({ key, icon, label }) => (
                    <button key={key} className="nf-panel-action-btn" onClick={() => { setActiveTab(key); setTimeout(() => window.print(), 300); }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>{icon}</span>
                      <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>download</span>
                      {label}
                    </button>
                  ))}
                </div>

                <div className="nf-panel-card">
                  <div className="nf-inv-header">
                    <div className="nf-panel-title" style={{ marginBottom: 0 }}>Invoice Summary</div>
                    <span className={invoiceGenerated ? "nf-done-badge" : "nf-draft-badge"}>{invoiceGenerated ? "Done" : "Draft"}</span>
                  </div>
                  <div className="nf-inv-row"><span className="nf-inv-label">Invoice No.</span><span className="nf-inv-val">{inv.refNo}</span></div>
                  <hr className="nf-inv-divider" />
                  <div className="nf-inv-row"><span className="nf-inv-label">Base Amount</span><span className="nf-inv-val">{fmt(budget)}</span></div>
                  <div className="nf-inv-row"><span className="nf-inv-label">GST {gstRate}%</span><span className="nf-inv-val">{fmt(gstAmt)}</span></div>
                  <hr className="nf-inv-divider" />
                  <div className="nf-inv-row"><span className="nf-inv-total-label">Total</span><span className="nf-inv-total-val">{fmt(totalAmt)}</span></div>
                </div>

                <div className="nf-panel-card">
                  <div className="nf-panel-title">Signature Status</div>
                  <div className="nf-sig-status-row">
                    <div className="nf-sig-row"><span className="nf-sig-key">Zeptrix Signature</span><span className="nf-sig-val wait">📝 Physical</span></div>
                    <div className="nf-sig-row"><span className="nf-sig-key">Client Signature</span><span className="nf-sig-val wait">📝 Physical</span></div>
                    <div className="nf-sig-row"><span className="nf-sig-key">Agreement Saved</span><span className={`nf-sig-val ${sigSaved ? "ok" : "wait"}`}>{sigSaved ? <><span className="material-symbols-outlined" style={{ fontSize: "0.95rem", color: "#059669", verticalAlign: "middle" }}>check_circle</span> Saved</> : <><span className="material-symbols-outlined" style={{ fontSize: "0.95rem", color: "#94a3b8", verticalAlign: "middle" }}>hourglass_empty</span> Pending</>}</span></div>
                  </div>
                </div>

                <div className="nf-ai-card">
                  <div className="nf-ai-label"><span className="material-symbols-outlined" style={{ fontSize: "0.95rem" }}>auto_awesome</span> Nexa AI</div>
                  <div className="nf-ai-text">"Add a <strong>milestone-based payment clause</strong> to reduce collection risk on projects over ₹1L."</div>
                  <button className="nf-apply-btn" onClick={() => setAgr(p => ({ ...p, deliverable3: "Milestone payments: 40% upfront, 40% at midpoint, 20% on final delivery." }))}>Apply Smart Terms</button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}