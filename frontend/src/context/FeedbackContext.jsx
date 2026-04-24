import { useRef, useState } from "react";
import { FeedbackContext } from "./feedbackContextInstance";

const FLASH_TOAST_KEY = "shopkart_flash_toast";

function toneToTitle(tone) {
  if (tone === "success") return "Success";
  if (tone === "error") return "Something went wrong";
  if (tone === "warning") return "Please check";
  return "Update";
}

function getInitialToasts() {
  const flashToast = sessionStorage.getItem(FLASH_TOAST_KEY);

  if (!flashToast) return [];

  sessionStorage.removeItem(FLASH_TOAST_KEY);

  try {
    const parsed = JSON.parse(flashToast);
    return [
      {
        id: `${Date.now()}-flash`,
        title: parsed.title || toneToTitle(parsed.tone),
        message: parsed.message,
        tone: parsed.tone || "info"
      }
    ];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState(getInitialToasts);
  const [dialog, setDialog] = useState({
    open: false,
    mode: "info",
    tone: "info",
    title: "",
    message: "",
    confirmLabel: "Continue",
    cancelLabel: "Cancel",
    onConfirm: null,
    onClose: null
  });
  const resolverRef = useRef(null);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showToast = ({ title, message, tone = "info", duration = 3200 }) => {
    const id = `${Date.now()}-${Math.random()}`;
    const nextToast = {
      id,
      title: title || toneToTitle(tone),
      message,
      tone
    };

    setToasts((prev) => [...prev, nextToast]);

    if (duration > 0) {
      window.setTimeout(() => dismissToast(id), duration);
    }
  };

  const queueFlashToast = (toast) => {
    sessionStorage.setItem(FLASH_TOAST_KEY, JSON.stringify(toast));
  };

  const showDialog = ({
    title,
    message,
    tone = "info",
    confirmLabel = "Continue",
    onConfirm,
    onClose
  }) => {
    setDialog({
      open: true,
      mode: "info",
      tone,
      title,
      message,
      confirmLabel,
      cancelLabel: "Cancel",
      onConfirm,
      onClose
    });
  };

  const confirmAction = ({
    title,
    message,
    tone = "warning",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel"
  }) =>
    new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialog({
        open: true,
        mode: "confirm",
        tone,
        title,
        message,
        confirmLabel,
        cancelLabel,
        onConfirm: null,
        onClose: null
      });
    });

  const closeDialog = () => {
    if (dialog.onClose) {
      dialog.onClose();
    }

    setDialog((prev) => ({ ...prev, open: false }));
  };

  const handleDialogConfirm = () => {
    if (dialog.mode === "confirm" && resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
      setDialog((prev) => ({ ...prev, open: false }));
      return;
    }

    if (dialog.onConfirm) {
      dialog.onConfirm();
    }

    setDialog((prev) => ({ ...prev, open: false }));
  };

  const handleDialogCancel = () => {
    if (dialog.mode === "confirm" && resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }

    closeDialog();
  };

  return (
    <FeedbackContext.Provider
      value={{
        showToast,
        showDialog,
        confirmAction,
        queueFlashToast
      }}
    >
      {children}

      <div className="toast-region">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card ${toast.tone}`}>
            <div>
              <strong>{toast.title}</strong>
              {toast.message && <p>{toast.message}</p>}
            </div>
            <button className="toast-close" onClick={() => dismissToast(toast.id)}>
              x
            </button>
          </div>
        ))}
      </div>

      {dialog.open && (
        <div className="dialog-backdrop" onClick={handleDialogCancel}>
          <div
            className={`dialog-card ${dialog.tone}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="dialog-icon">{dialog.tone === "success" ? "OK" : dialog.tone === "error" ? "!" : "?"}</div>
            <div className="dialog-copy">
              <h2>{dialog.title}</h2>
              <p>{dialog.message}</p>
            </div>
            <div className="dialog-actions">
              {dialog.mode === "confirm" && (
                <button className="ghost-button" onClick={handleDialogCancel}>
                  {dialog.cancelLabel}
                </button>
              )}
              <button className="primary-button" onClick={handleDialogConfirm}>
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}
