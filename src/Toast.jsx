import { useEffect, useState } from 'react'

const TOAST_DURATION = 5000;

function Toast({ toast, onDismiss }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!toast || paused) return;
    const timer = setTimeout(onDismiss, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [toast, paused, onDismiss]);

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div
          key={toast.id}
          className="toast"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            className="toast-undo"
            onClick={() => {
              toast.onUndo();
              onDismiss();
            }}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

export default Toast;
