import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { ToastType } from '../../types';

const toastConfig: Record<ToastType, { icon: typeof CheckCircle; bgColor: string; textColor: string }> = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    textColor: 'text-green-600 dark:text-green-400',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    textColor: 'text-red-600 dark:text-red-400',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const config = toastConfig[toast.type];
        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
              animate-in slide-in-from-right-5 fade-in duration-200
              ${config.bgColor}
            `}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 ${config.textColor}`} />
            <span className={`text-sm font-medium ${config.textColor}`}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className={`ml-2 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 ${config.textColor}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
