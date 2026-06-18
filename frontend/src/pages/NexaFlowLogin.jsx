import { useState } from "react";
import { useNavigate } from "react-router-dom";
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .nf-root {
    min-height: 100vh;
    background: #090d16;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

  /* Glowing background orbs */
  .nf-bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.22;
    pointer-events: none;
    z-index: 0;
  }
  
  .nf-bg-orb-1 {
    width: 450px;
    height: 450px;
    background: linear-gradient(135deg, #1d4ed8, #7c3aed);
    top: -10%;
    left: -5%;
    animation: floatOrb1 25s infinite alternate ease-in-out;
  }

  .nf-bg-orb-2 {
    width: 500px;
    height: 500px;
    background: linear-gradient(135deg, #7c3aed, #ec4899);
    bottom: -15%;
    right: -10%;
    animation: floatOrb2 30s infinite alternate-reverse ease-in-out;
  }

  .nf-bg-orb-3 {
    width: 320px;
    height: 320px;
    background: linear-gradient(135deg, #06b6d4, #3b82f6);
    top: 35%;
    left: 55%;
    animation: floatOrb1 20s infinite alternate-reverse ease-in-out;
  }

  @keyframes floatOrb1 {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(50px, -40px) scale(1.1); }
    100% { transform: translate(-30px, 60px) scale(0.9); }
  }

  @keyframes floatOrb2 {
    0% { transform: translate(0, 0) scale(0.9); }
    50% { transform: translate(-60px, 50px) scale(1.05); }
    100% { transform: translate(40px, -30px) scale(1); }
  }

  .nf-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: rgba(15, 22, 38, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 24px;
    overflow: hidden;
    width: 100%;
    max-width: 950px;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(29, 78, 216, 0.1);
    z-index: 1;
    animation: cardAppear 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes cardAppear {
    from { opacity: 0; transform: translateY(30px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* LEFT PANEL */
  .nf-left {
    background: linear-gradient(145deg, #1d4ed8 0%, #1e3a8a 60%, #0b0f19 100%);
    padding: 3.5rem 3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 520px;
    position: relative;
    overflow: hidden;
    border-right: 1px solid rgba(255, 255, 255, 0.06);
  }

  .nf-left::before {
    content: '';
    position: absolute;
    width: 350px; height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%);
    bottom: -80px; right: -80px;
    animation: pulseGlow 8s infinite alternate ease-in-out;
  }

  .nf-left::after {
    content: '';
    position: absolute;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%);
    top: -50px; left: -50px;
  }

  @keyframes pulseGlow {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.15); opacity: 1; }
  }

  .nf-logo {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    z-index: 2;
  }

  .nf-logo-icon {
    width: 42px; height: 42px;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    color: #fff;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
    animation: logoRotate 6s infinite ease-in-out;
  }

  @keyframes logoRotate {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(15deg) scale(1.05); }
  }

  .nf-logo-name {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    color: #fff;
    font-size: 1.4rem;
    letter-spacing: -0.01em;
  }

  .nf-left-body { z-index: 2; margin-top: auto; margin-bottom: auto; }

  .nf-headline {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    color: #fff;
    font-size: clamp(2.2rem, 3vw, 2.8rem);
    line-height: 1.15;
    margin-bottom: 2rem;
    letter-spacing: -0.03em;
    background: linear-gradient(to bottom right, #ffffff 60%, #93c5fd 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .nf-tagline {
    color: #93c5fd;
    font-size: 0.95rem;
    line-height: 1.65;
    max-width: 340px;
    opacity: 0.85;
  }

  .nf-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 2rem;
    z-index: 2;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.4rem 0.8rem;
    border-radius: 30px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nf-badge-line {
    width: 6px; height: 6px;
    background: #4ade80;
    border-radius: 50%;
    box-shadow: 0 0 10px #4ade80;
    animation: blink 1.5s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }

  .nf-badge-text {
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.8);
    text-transform: uppercase;
    font-weight: 600;
  }

  /* RIGHT PANEL */
  .nf-right {
    padding: 3.5rem 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: rgba(15, 23, 42, 0.35);
  }

  .nf-welcome { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 2rem; color: #fff; letter-spacing: -0.01em; }
  .nf-sub { color: #94a3b8; font-size: 0.9rem; margin-top: 0.4rem; margin-bottom: 2.2rem; }

  .nf-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: #94a3b8;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .nf-forgot {
    color: #3b82f6;
    font-size: 0.78rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    background: none; border: none;
    transition: all 0.2s;
  }
  .nf-forgot:hover { color: #60a5fa; text-shadow: 0 0 8px rgba(96,165,250,0.4); }

  .nf-field-wrap {
    position: relative;
    margin-bottom: 1.4rem;
  }

  .nf-field-icon {
    position: absolute;
    left: 16px; top: 50%;
    transform: translateY(-50%);
    color: #64748b;
    font-size: 1.05rem;
    pointer-events: none;
    transition: color 0.2s;
  }

  .nf-input {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 2.8rem;
    border: 1.5px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    background: rgba(15, 23, 42, 0.4);
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    color: #fff;
    outline: none;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .nf-input::placeholder { color: #475569; }
  .nf-input:focus { 
    border-color: #3b82f6; 
    background: rgba(15, 23, 42, 0.6); 
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15); 
  }
  .nf-input:focus + .nf-field-icon {
    color: #3b82f6;
  }

  .nf-error {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 12px;
    padding: 0.85rem 1.1rem;
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
    margin-bottom: 1.4rem;
    animation: shake 0.4s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  .nf-error-icon { color: #f87171; font-size: 1.1rem; flex-shrink: 0; }

  .nf-error-text strong {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: #f87171;
  }

  .nf-error-text span {
    font-size: 0.8rem;
    color: #fca5a5;
  }

  .nf-checkbox-row {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-bottom: 1.8rem;
  }

  .nf-checkbox {
    width: 18px; height: 18px;
    accent-color: #2563eb;
    cursor: pointer;
    border-radius: 6px;
    border: 1.5px solid rgba(255, 255, 255, 0.15);
    background: rgba(0, 0, 0, 0.2);
  }

  .nf-checkbox-label {
    font-size: 0.85rem;
    color: #94a3b8;
    cursor: pointer;
    user-select: none;
    transition: color 0.2s;
  }
  .nf-checkbox-label:hover { color: #cbd5e1; }

  .nf-btn {
    width: 100%;
    padding: 0.9rem;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: #fff;
    border: none;
    border-radius: 14px;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    letter-spacing: 0.01em;
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.25);
  }
  .nf-btn:hover { 
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); 
    transform: translateY(-2px); 
    box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4); 
  }
  .nf-btn:active { transform: translateY(0); }
  .nf-btn:disabled {
    background: #334155 !important;
    color: #64748b;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }

  .nf-divider {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    margin: 1.8rem 0 1.2rem;
  }

  .nf-security {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.78rem;
    color: #64748b;
  }

  .nf-footer {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.72rem;
    color: #475569;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    z-index: 1;
  }

  @media (max-width: 768px) {
    .nf-card { grid-template-columns: 1fr; max-width: 480px; }
    .nf-left { min-height: auto; padding: 2.5rem 2rem; }
    .nf-right { padding: 2.5rem 2rem; }
  }
`;

export default function NexaFlowLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const handleSubmit = async () => {

  setLoading(true);
  setError("");

  try {

    const response = await fetch(
      "https://nexaflow-js2m.onrender.com/api/dashboard/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          username: email,
          password: password
        })
      }
    );

    const data = await response.json();

    if (!response.ok || data.status !== "success") {

      setError(data.message || "Login failed");

      return;
    }

    // console.log("OTP sent:", data);

    // SHOW OTP INPUT
    setShowOtp(true);

  } catch (err) {

    console.error(err);

    setError("Server error. Try again.");

  } finally {

    setLoading(false);
  }
};
  const handleVerifyOtp = async () => {

  setOtpLoading(true);

  setError("");

  try {

    const response = await fetch(
      "https://nexaflow-js2m.onrender.com/api/dashboard/verify-otp",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          username: email,
          otp: otp
        })
      }
    );

    const data = await response.json();

    if (!response.ok || data.status !== "success") {

      setError(data.message || "Invalid OTP");

      return;
    }

    // console.log("OTP verified:", data);

    // STORE JWT TOKEN
    localStorage.setItem(
      "token",
      data.data.token
    );

    // REDIRECT
    navigate("/dashboard");

  } catch (err) {

    console.error(err);

    setError("OTP verification failed");

  } finally {

    setOtpLoading(false);
  }
};

  return (
    <>
      <style>{styles}</style>
      <div className="nf-root">
        {/* Background Animated Orbs */}
        <div className="nf-bg-orb nf-bg-orb-1"></div>
        <div className="nf-bg-orb nf-bg-orb-2"></div>
        <div className="nf-bg-orb nf-bg-orb-3"></div>
        
        <div className="nf-card">
          {/* LEFT */}
          <div className="nf-left">
            <div className="nf-logo">
              <div className="nf-logo-icon">
                <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>auto_awesome</span>
              </div>
              <span className="nf-logo-name">NexaFlow</span>
            </div>
            <div className="nf-left-body">
              <h1 className="nf-headline">
                Orchestrate your workflow with absolute precision.
              </h1>
              <p className="nf-tagline">
                The next generation of internal automation is here. Secure, fast,
                and engineered for high-performance teams.
              </p>
              <div className="nf-badge">
                <div className="nf-badge-line" />
                <span className="nf-badge-text">Internal Systems Only</span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="nf-right">
            <div className="nf-welcome">Welcome Back</div>
            <div className="nf-sub">Access your automation dashboard</div>

            <label className="nf-label" htmlFor="email">Email Address</label>
            <div className="nf-field-wrap">
              <span className="nf-field-icon"><span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>mail</span></span>
              <input
                id="email"
                className="nf-input"
                type="email"
                placeholder="name@nexaflow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="nf-label">
              <label htmlFor="password">Password</label>
              <button className="nf-forgot" type="button">Forgot Password?</button>
            </div>
            <div className="nf-field-wrap">
              <span className="nf-field-icon"><span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>lock</span></span>
              <input
                id="password"
                className="nf-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {
  showOtp && (
    <>
      <label className="nf-label">
        Verification Code
      </label>

      <div className="nf-field-wrap">

        <span className="nf-field-icon">
          <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>vpn_key</span>
        </span>

        <input
          className="nf-input"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

      </div>
    </>
  )
}

            {error && (
              <div className="nf-error">
                <span className="nf-error-icon"><span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>error</span></span>
                <div className="nf-error-text">
                  <strong>{error}</strong>
                  <span>Please verify your login details.</span>
                </div>
              </div>
            )}

            <div className="nf-checkbox-row">
              <input
                id="remember"
                className="nf-checkbox"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label className="nf-checkbox-label" htmlFor="remember">
                Remember this device
              </label>
            </div>

            {
  !showOtp ? (

    <button
      className="nf-btn"
      onClick={handleSubmit}
      disabled={loading}
    >
      {
        loading
          ? "Sending OTP..."
          : <>Login to NexaFlow <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>arrow_forward</span></>
      }
    </button>

  ) : (

    <button
      className="nf-btn"
      onClick={handleVerifyOtp}
      disabled={otpLoading}
    >
      {
        otpLoading
          ? "Verifying OTP..."
          : <>Verify OTP <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>arrow_forward</span></>
      }
    </button>

  )
}

            <hr className="nf-divider" />
            <div className="nf-security">
              <span className="material-symbols-outlined" style={{ fontSize: "1.1rem", color: "#64748b" }}>security</span>
              <span>Enterprise Grade Security Architecture</span>
            </div>
          </div>
        </div>

        <div className="nf-footer">
          © 2024 NexaFlow Automation Suite • Authorized Personnel Access Only
        </div>
      </div>
    </>
  );
}
