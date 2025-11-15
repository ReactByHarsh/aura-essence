import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  onRemove: (id: string) => void;
  duration?: number;
}

export function Toast({ 
  id, 
  type, 
  message, 
  onRemove, 
  duration = 5000 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        'relative flex items-center p-4 rounded-xl shadow-xl backdrop-blur bg-white/80 dark:bg-slate-900/80 ring-1 transition-all duration-300 transform',
        {
          'ring-green-300/60 text-green-900 dark:text-green-200': type === 'success',
          'ring-red-300/60 text-red-900 dark:text-red-200': type === 'error',
          'ring-blue-300/60 text-blue-900 dark:text-blue-200': type === 'info',
        },
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1 rounded-l-xl',
          {
            'bg-gradient-to-b from-green-400 to-emerald-500': type === 'success',
            'bg-gradient-to-b from-red-400 to-rose-500': type === 'error',
            'bg-gradient-to-b from-blue-400 to-indigo-500': type === 'info',
          }
        )}
      />
      <Icon className="h-5 w-5 mr-3 ml-2 flex-shrink-0 opacity-90" />
      <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onRemove(id), 300);
        }}
        className="ml-3 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Toast Container
interface ToastContainerProps {
  toasts?: Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
  }>;
  onRemove?: (id: string) => void;
}

export function ToastContainer({ toasts = [], onRemove = () => {} }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}