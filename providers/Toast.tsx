import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import { Toast } from "primereact/toast";
import { createContext, useContext, useRef, ReactNode } from "react";

type ToastOptions = {
  severity?: "success" | "info" | "warn" | "error";
  summary?: string;
  detail?: string;
  life?: number;
};

type ToastContextType = {
  showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

type ToastContextProviderProps = {
  children: ReactNode;
};

export const ToastContextProvider = ({ children }: ToastContextProviderProps) => {
  const toastRef = useRef<Toast>(null);

  const showToast = (options: ToastOptions) => {
    if (!toastRef.current) return;
    toastRef.current.show(options);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toastRef} draggable  />
      <div>{children}</div>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToastContext must be used within ToastContextProvider");
  }

  return context;
};
