import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Render Portal */}
      <div className="toast-container">
        {toasts.map((toast) => {
          let icon = <Info size={20} className="text-blue-400" color="#60a5fa" />;
          let borderColor = 'rgba(255, 255, 255, 0.1)';
          let bgColor = '#1e293b';

          if (toast.type === 'success') {
            icon = <CheckCircle2 size={20} color="#34d399" />;
            borderColor = 'rgba(16, 185, 129, 0.4)';
          } else if (toast.type === 'error') {
            icon = <AlertCircle size={20} color="#f87171" />;
            borderColor = 'rgba(239, 68, 68, 0.4)';
          } else if (toast.type === 'warning') {
            icon = <AlertTriangle size={20} color="#fbbf24" />;
            borderColor = 'rgba(245, 158, 11, 0.4)';
          }

          return (
            <div
              key={toast.id}
              className="toast-item"
              style={{
                backgroundColor: bgColor,
                borderColor: borderColor,
              }}
            >
              <div style={{ flexShrink: 0 }}>{icon}</div>
              <div style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.4 }}>
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
