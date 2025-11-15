"use client";
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ToastContainer } from '@/components/ui/Toast';

type ToastType = 'success' | 'error' | 'info';

type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
};

type ToasterContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  showToast: (opts: { title: string; description?: string; variant?: ToastType }) => void;
};

const ToasterContext = createContext<ToasterContextValue | null>(null);

export function useToaster() {
  const ctx = useContext(ToasterContext);
  if (!ctx) throw new Error('useToaster must be used within ToasterProvider');
  return ctx;
}

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2, 10);
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const value = useMemo<ToasterContextValue>(() => ({
    success: (m: string) => add('success', m),
    error: (m: string) => add('error', m),
    info: (m: string) => add('info', m),
    showToast: ({ title, description, variant = 'info' }) => {
      const message = description ? `${title} — ${description}` : title;
      add(variant, message);
    },
  }), [add]);

  return (
    <ToasterContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToasterContext.Provider>
  );
}
