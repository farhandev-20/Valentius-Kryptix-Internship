import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Save, 
  RotateCcw, 
  Terminal,
  Layers,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, resetApiBaseUrl, productsApi } from '../api/apiClient';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';

export const ApiSettingsPage = () => {
  const { fetchProducts } = useProducts();
  const { showToast } = useToast();

  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const startTime = performance.now();

    try {
      const healthData = await productsApi.checkHealth();
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      setTestResult({
        success: true,
        latency,
        data: healthData,
        timestamp: new Date().toLocaleTimeString(),
      });
      showToast(`Connected to API successfully! Latency: ${latency}ms`, 'success');
    } catch (err) {
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      setTestResult({
        success: false,
        latency,
        error: err.message || 'Connection failed',
        status: err.status || 'Offline',
        timestamp: new Date().toLocaleTimeString(),
      });
      showToast('API Connection Test Failed', 'error');
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    handleTestConnection();
  }, []);

  const handleSaveUrl = (e) => {
    e.preventDefault();
    if (!apiUrl.trim()) return;
    setApiBaseUrl(apiUrl.trim());
    showToast(`REST API Base URL updated to: ${apiUrl.trim()}`, 'success');
    fetchProducts();
    handleTestConnection();
  };

  const handleResetUrl = () => {
    const defaultUrl = resetApiBaseUrl();
    setApiUrl(defaultUrl);
    showToast(`REST API Base URL reset to default: ${defaultUrl}`, 'info');
    fetchProducts();
    handleTestConnection();
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          REST API Status & Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Monitor live connectivity, configure target backend endpoints, and test error resiliency.
        </p>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Connection Status Card */}
        <div
          className="glass-card"
          style={{
            padding: '24px 28px',
            border: testResult?.success
              ? '1px solid rgba(16, 185, 129, 0.4)'
              : '1px solid rgba(239, 68, 68, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Server size={22} color={testResult?.success ? '#34d399' : '#f87171'} />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                Live Connection Status
              </h2>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="btn btn-secondary btn-sm"
            >
              <RefreshCw size={14} className={testing ? 'animate-spin' : ''} />
              <span>{testing ? 'Testing...' : 'Ping REST API'}</span>
            </button>
          </div>

          {testResult ? (
            <div
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: testResult.success ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {testResult.success ? (
                  <CheckCircle2 size={24} color="#10b981" />
                ) : (
                  <XCircle size={24} color="#ef4444" />
                )}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: testResult.success ? '#34d399' : '#f87171' }}>
                    {testResult.success ? 'REST API is Online and Responsive' : 'Backend Server Unreachable'}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Last checked at {testResult.timestamp} • Response Latency: <strong>{testResult.latency}ms</strong>
                  </span>
                </div>
              </div>

              {testResult.success && testResult.data && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Server Message: <em>"{testResult.data.message || 'OK'}"</em> • Total Items in Database: <strong>{testResult.data.totalProducts ?? 'N/A'}</strong>
                </div>
              )}

              {!testResult.success && (
                <div style={{ fontSize: '0.85rem', color: '#fca5a5', marginTop: '4px' }}>
                  Error Details: {testResult.error}
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Testing connection...</p>
          )}
        </div>

        {/* Configure REST API Base URL */}
        <div className="glass-card" style={{ padding: '24px 28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
            Configure API Base URL
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '18px' }}>
            Point the frontend to any backend REST API (e.g. your Spring Boot, Node/Express, or Python service).
          </p>

          <form onSubmit={handleSaveUrl} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="api-url">
                REST API Base URL:
              </label>
              <input
                id="api-url"
                type="text"
                className="form-input"
                style={{ fontFamily: 'var(--font-mono)' }}
                placeholder="http://localhost:5000/api"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary btn-sm">
                <Save size={15} />
                <span>Save & Connect</span>
              </button>

              <button
                type="button"
                onClick={handleResetUrl}
                className="btn btn-secondary btn-sm"
              >
                <RotateCcw size={15} />
                <span>Reset to Default (/api)</span>
              </button>
            </div>
          </form>
        </div>

        {/* Developer Guide & How to Run */}
        <div className="glass-card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Terminal size={18} color="#818cf8" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Quick Backend & Verification Instructions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>1. Starting the Built-in Companion REST API:</strong>
              <pre style={{ margin: '6px 0', padding: '10px 14px', backgroundColor: '#090d16', borderRadius: '6px', color: '#38bdf8', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                npm run server
              </pre>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Runs the Express server on <code>http://localhost:5000</code> with sample seed products.
              </span>
            </div>

            <div>
              <strong style={{ color: 'var(--text-primary)' }}>2. Starting Both Frontend & Backend Together:</strong>
              <pre style={{ margin: '6px 0', padding: '10px 14px', backgroundColor: '#090d16', borderRadius: '6px', color: '#38bdf8', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                npm run start:all
              </pre>
            </div>

            <div>
              <strong style={{ color: 'var(--text-primary)' }}>3. Testing Error Handling (Milestone Requirement):</strong>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                Stop the backend server (Ctrl+C in terminal) and refresh the page. Notice how the application displays an informative error banner with status code, retry button, and clear diagnostics instead of crashing or showing blank screens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
