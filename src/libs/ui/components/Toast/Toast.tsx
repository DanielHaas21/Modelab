import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

const ToastWrapperVariants = cva(``, {
  variants: {
    size: {
      sm: 'w-[300px]',
      md: 'w-[400px]',
      lg: 'w-[500px]',
      full: 'w-full'
    }
  },
  defaultVariants: {
    size: 'sm'
  }
});

type ToastWrapperVariantProps = VariantProps<typeof ToastWrapperVariants>;

export interface ToastWrapperProps extends ToastWrapperVariantProps {
  children: React.ReactNode | React.ReactNode[];
  removeTimer?: number | false;
  className?: string;
}

export const ToastWrapper = React.forwardRef<HTMLDivElement, ToastWrapperProps>(
  ({ children, className, size, removeTimer = 10000 }, ref) => {
    const [toasts, setToasts] = React.useState(React.Children.toArray(children));

    const handleRemove = (index: number) => {
      setToasts((prev) => prev.filter((_, i) => i !== index));
    };

    React.useEffect(() => {
      setToasts(React.Children.toArray(children));
    }, [children]);

    React.useEffect(() => {
      if (!removeTimer || toasts.length === 0) return;

      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, removeTimer);

      return () => clearTimeout(timer);
    }, [removeTimer, toasts.length]);

    return (
      <div
        ref={ref}
        className={cn(className, ToastWrapperVariants({ size }), 'flex flex-col gap-2')}
      >
        <AnimatePresence>
          {toasts.map((child, index) => {
            if (!React.isValidElement(child) || child.type !== ToastItem) {
              throw new Error('<Toast> only accepts <Toast.Item> as children.');
            }

            // Clone child with extra prop: onRemove
            return React.cloneElement(child as React.ReactElement<ToastItemProps>, {
              key: child.key || index,
              onRemove: () => handleRemove(index)
            });
          })}
        </AnimatePresence>
      </div>
    );
  }
);

type ToastVariant = 'default' | 'success' | 'error' | 'warning';

const stripColors: Record<ToastVariant, string> = {
  default: 'bg-bg-400',
  success: 'bg-primary-500',
  error: 'bg-accent-500',
  warning: 'bg-secondary-500'
};

const variantLabels: Record<ToastVariant, string> = {
  default: 'Info',
  success: 'Success',
  error: 'Error',
  warning: 'Warning'
};

export interface ToastItemProps {
  children: React.ReactNode;
  variant?: ToastVariant;
  description?: string;
  actions?: React.ReactNode;
  progressBar?: number;
  onRemove?: () => void;
}

/**
 * A component that represents an individual toast message. It supports different variants (default, success, error, warning) which change the color and label of the toast. 
 * It also supports an optional description, action buttons, and a progress bar. The toast can be dismissed by clicking the close button or automatically after a specified duration.
 */
export const ToastItem = React.forwardRef<HTMLDivElement, ToastItemProps>(
  ({ children, variant = 'default', description, actions, progressBar, onRemove }, ref) => {
    const strip = stripColors[variant];
    const label = variantLabels[variant];

    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        role="alert"
        transition={{ duration: 0.3, ease: [0, 0.8, 0.4, 1] }}
        className="flex flex-row bg-bg-100 border border-ui-border rounded-lg shadow-lg overflow-hidden w-full relative"
        ref={ref}
      >
        <div className={cn('w-2 shrink-0', strip)} />
        <div className="grow p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</span>
            <button
              onClick={onRemove}
              className="text-text-400 hover:text-text-950 transition-colors pointer-events-auto"
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
          <p className="text-sm font-light text-text-700 leading-snug">{children}</p>
          {description && <p className="text-sm text-black-800 mt-1">{description}</p>}
          {actions && <div className="mt-2 flex items-center space-x-2">{actions}</div>}
        </div>
        {typeof progressBar === 'number' && (
          <div
            className={cn(strip, 'absolute bottom-0 left-0 h-1 rounded-full transition-all duration-300')}
            style={{ width: `${Math.min(progressBar, 100)}%` }}
          />
        )}
      </motion.div>
    );
  }
);

const Toast = Object.assign(ToastWrapper, { Item: ToastItem });

export { Toast };

Toast.displayName = 'Toast';
ToastWrapper.displayName = 'ToastWrapper';
ToastItem.displayName = 'Toast.Item';
