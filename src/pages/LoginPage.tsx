import { useState } from 'react';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: (sessionId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function LoginPage({ onLogin, isLoading, error }: LoginPageProps) {
  const [sessionId, setSessionId] = useState('');
  const [validationError, setValidationError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    const trimmed = sessionId.trim();
    if (!trimmed) {
      setValidationError('กรุณากรอก Session ID');
      return;
    }
    if (trimmed.length < 5) {
      setValidationError('Session ID ต้องมีอย่างน้อย 5 ตัวอักษร');
      return;
    }
    setValidationError('');
    await onLogin(trimmed);
  };

  const displayError = hasSubmitted ? (validationError || error) : null;

  return (
    <div className="login-scene">
      {/* Background layers */}
      <div className="login-bg-noise" />
      <div className="login-bg-glow" />
      <div className="login-bg-lines" />
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />

      <div className="login-card-wrap">
        <div className="login-card">
          {/* Corner decoration */}
          <div className="login-corner-deco">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M120 120 L120 60 Q120 0 60 0 L0 0" stroke="#c9a96e" strokeWidth="1" fill="none" />
              <path d="M120 120 L120 80 Q120 20 60 20 L20 20" stroke="#c9a96e" strokeWidth="0.5" fill="none" opacity="0.5" />
              <circle cx="120" cy="120" r="4" fill="#c9a96e" opacity="0.6" />
            </svg>
          </div>

          {/* Badge */}
          <div className="login-badge">
            <div className="login-badge-dot" />
            <span>Enterprise Finance Platform</span>
          </div>

          {/* Header */}
          <div className="login-header">
            <h1 className="login-title">
              BMS <span>Debt Aging</span>
              <br />
              Analysis
            </h1>
            <p className="login-subtitle">ระบบวิเคราะห์หนี้ค้างชำระ · HOSxP Integration</p>
          </div>

          <div className="login-divider" />

          {/* Error */}
          {displayError && (
            <div className="login-error">
              <span className="login-error-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </span>
              <p>{displayError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <div className="login-label">
                <span className="login-label-req">*</span>
                BMS Session ID
              </div>
              <div className="login-input-wrap">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </span>
                <input
                  type="text"
                  className={`login-input${displayError ? ' login-input-error' : ''}`}
                  placeholder="กรอก Session ID จาก HOSxP"
                  value={sessionId}
                  onChange={(e) => {
                    setSessionId(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  autoFocus
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="login-stats">
              <div className="login-stat">
                <span className="login-stat-num">99.9%</span>
                <span className="login-stat-label">Uptime</span>
              </div>
              <div className="login-stat">
                <span className="login-stat-num">256-bit</span>
                <span className="login-stat-label">Encrypted</span>
              </div>
              <div className="login-stat">
                <span className="login-stat-num">Real-time</span>
                <span className="login-stat-label">Sync</span>
              </div>
            </div>

            {/* Button */}
            <div className="login-btn-wrap">
              <button type="submit" className="login-btn" disabled={isLoading}>
                <div className="login-btn-inner">
                  {isLoading ? (
                    <>
                      <svg className="login-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      กำลังเข้าสู่ระบบ...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                      เข้าสู่ระบบ
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="login-note">
            <div className="login-note-inner">
              <span className="login-note-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </span>
              <p>
                Session ID จาก <strong>HOSxP Desktop Application</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
