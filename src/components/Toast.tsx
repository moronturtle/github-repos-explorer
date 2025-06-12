import { useEffect, type JSX } from 'react';
import { useToastStore } from '../store/toastStore';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const colorMap: Record<string, string> = {
  success: 'alert-success',
  error: 'alert-error',
  warning: 'alert-warning',
  info: 'alert-info',
};

const iconMap: Record<string, JSX.Element> = {
  success: <CheckCircle size={20} className="text-black-500" />,
  error: <AlertCircle size={20} className="text-black-500" />,
  warning: <AlertTriangle size={20} className="text-black-500" />,
  info: <Info size={20} className="text-black-500" />,
};

const Toast = () => {
  const { open, message, type, hideToast } = useToastStore();

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 2000);
    return () => clearTimeout(timer);
  }, [open, hideToast]);

  if (!open) return null;

  return (
    <div className="toast toast-top toast-center z-50" data-testid="toast">
      <div
        className={`alert ${colorMap[type]} flex gap-3 items-center px-4 py-2 shadow-lg rounded-lg`}
      >
        <span>{iconMap[type]}</span>
        <span className="flex-1">{message}</span>
        <X size={16} data-testid="toast-close" className="cursor-pointer" onClick={hideToast} />
      </div>
    </div>
  );
};

export default Toast;
