import { useState } from "react";
import { useNavigate } from "react-router-dom";
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto+Flex:opsz,wght,XOPQ,XTRA,YOPQ,YTDE,YTFI,YTLC,YTUC@8..144,100..1000,96,468,79,-203,738,514,712&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .nf-root {
    min-height: 100vh;
    background: #eef0f4;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    padding: 2rem 1rem;
  }

  .nf-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    width: 100%;
    max-width: 900px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.10);
  }

  /* LEFT PANEL */
  .nf-left {
    background: #1d4ed8;
    padding: 3rem 2.5rem 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 500px;
    position: relative;
    overflow: hidden;
  }

  .nf-left::before {
    content: '';
    position: absolute;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    bottom: -80px; right: -80px;
  }

  .nf-left::after {
    content: '';
    position: absolute;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    top: -40px; left: -40px;
  }

  .nf-logo {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    z-index: 1;
  }

  .nf-logo-icon {
    width: 38px; height: 38px;
    background: rgba(255,255,255,0.15);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
  }

  .nf-logo-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    color: #fff;
    font-size: 1.15rem;
    letter-spacing: 0.02em;
  }

  .nf-left-body { z-index: 1; margin-top: 2.5rem; }

  .nf-headline {
    font-family: "Bebas Neue", sans-serif;
    font-weight: 800;
    color: #fff;
    font-size: clamp(3.6rem, 3vw, 2.2rem);
    line-height: 1.18;
    margin-bottom: 70px;
  }

  .nf-tagline {
    color: rgba(255,255,255,0.72);
    font-size: 0.88rem;
    line-height: 1.65;
    max-width: 300px;
  }

  .nf-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.8rem;
    z-index: 1;
  }

  .nf-badge-line {
    width: 28px; height: 1px;
    background: rgba(255,255,255,0.4);
  }

  .nf-badge-text {
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    font-weight: 500;
  }

  /* RIGHT PANEL */
  .nf-right {
    padding: 3rem 2.8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .nf-welcome { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.7rem; color: #111827; }
  .nf-sub { color: #6b7280; font-size: 0.88rem; margin-top: 0.3rem; margin-bottom: 2rem; }

  .nf-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.45rem;
  }

  .nf-forgot {
    color: #1d4ed8;
    font-size: 0.78rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    background: none; border: none;
    transition: opacity 0.15s;
  }
  .nf-forgot:hover { opacity: 0.7; }

  .nf-field-wrap {
    position: relative;
    margin-bottom: 1.2rem;
  }

  .nf-field-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    font-size: 0.95rem;
    pointer-events: none;
  }

  .nf-input {
    width: 100%;
    padding: 0.72rem 0.9rem 0.72rem 2.5rem;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    background: #f3f6fa;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    color: #111827;
    outline: none;
    transition: border-color 0.18s, background 0.18s;
  }
  .nf-input::placeholder { color: #9ca3af; }
  .nf-input:focus { border-color: #1d4ed8; background: #fff; }

  .nf-error {
    background: #fff1f1;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    margin-bottom: 1.2rem;
  }

  .nf-error-icon { color: #ef4444; font-size: 1rem; flex-shrink: 0; margin-top: 1px; }

  .nf-error-text strong {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    color: #b91c1c;
  }

  .nf-error-text span {
    font-size: 0.78rem;
    color: #ef4444;
  }

  .nf-checkbox-row {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin-bottom: 1.5rem;
  }

  .nf-checkbox {
    width: 17px; height: 17px;
    accent-color: #1d4ed8;
    cursor: pointer;
    border-radius: 5px;
  }

  .nf-checkbox-label {
    font-size: 0.82rem;
    color: #6b7280;
    cursor: pointer;
  }

  .nf-btn {
    width: 100%;
    padding: 0.85rem;
    background: #1d4ed8;
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background 0.18s, transform 0.1s;
    letter-spacing: 0.01em;
  }
  .nf-btn:hover { background: #1a44c2; }
  .nf-btn:active { transform: scale(0.99); }

  .nf-divider {
    border: none;
    border-top: 1px solid #f0f0f0;
    margin: 1.5rem 0 1rem;
  }

  .nf-security {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: #9ca3af;
  }

  .nf-footer {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.72rem;
    color: #9ca3af;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  @media (max-width: 640px) {
    .nf-card { grid-template-columns: 1fr; }
    .nf-left { min-height: auto; padding: 2rem; }
    .nf-right { padding: 2rem 1.5rem; }
  }
`;

export default function NexaFlowLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
  setLoading(true);
  setError(false);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/dashboard/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: email,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Login failed");
      return;
    }
    navigate("/dashboard")

    console.log("Login success:", data);

    // TODO: store token later
    // localStorage.setItem("token", data.token);

  } catch (err) {
    console.error(err);
    setError("Server error. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <style>{styles}</style>
      <div className="nf-root">
        <div className="nf-card">
          {/* LEFT */}
          <div className="nf-left">
            <div className="nf-logo">
              <div className="nf-logo-icon">✦</div>
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
              <span className="nf-field-icon">@</span>
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
              <span className="nf-field-icon">🔒</span>
              <input
                id="password"
                className="nf-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="nf-error">
                <span className="nf-error-icon">⊘</span>
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

            <button className="nf-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Signing in…" : "Login to NexaFlow →"}
            </button>

            <hr className="nf-divider" />
            <div className="nf-security">
              <span>🔒</span>
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
