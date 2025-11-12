import React, { useEffect } from 'react';
import './toast.css';

export default function Toast({ message, type = 'info', onClose, duration = 3500 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;
  return (
    <div className={`toast ${type}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
