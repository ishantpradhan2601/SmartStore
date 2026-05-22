import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) {
  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Card */}
      <div className={`relative w-full ${currentSize} glass-card border border-white/10 shadow-2xl p-6 md:p-8 overflow-hidden z-10 animate-fadeInUp`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-dark-600/40 mb-6">
          <h2 className="text-xl font-bold text-white tracking-wide">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-dark-700/60 hover:bg-primary-500/20 text-dark-200 hover:text-white border border-white/5 transition-all"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content body */}
        <div className="max-h-[75vh] overflow-y-auto pr-2">
          {children}
        </div>
      </div>
    </div>
  );
}
