import * as React from 'react';
import { cn } from '../../utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Remove } from '../../../store/slices/Message';
import { Label } from './Label';
import { useTranslation } from '../provider';

const variantMeta = {
  Success: { label: 'Success', color: 'bg-primary-500' },
  Warning: { label: 'Warning', color: 'bg-secondary-500' },
  Error: { label: 'Error', color: 'bg-accent-500' },
  Alert: { label: 'Alert', color: 'bg-accent-500' },
  Info: { label: 'Info', color: 'bg-bg-400' },
} as const;

type VariantType = keyof typeof variantMeta;

const MessageVariants = cva('', {
  variants: {
    variant: {
      Success: variantMeta.Success.color,
      Warning: variantMeta.Warning.color,
      Error: variantMeta.Error.color,
      Alert: variantMeta.Alert.color,
      Info: variantMeta.Info.color,
    },
  },
  defaultVariants: {
    variant: 'Info',
  },
});

type MessageVariantProps = Required<VariantProps<typeof MessageVariants>>;

interface MessageProps extends MessageVariantProps {
  className?: string;
  children: string; // is used for the message itself
  variant: VariantType; //Must be enforced since cva marks all as optional and null cant be used as an index
  onRemove: () => void;
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ className, children, variant = 'Info', onRemove, ...props }, ref) => {
    const meta = variantMeta[variant];
    const t = useTranslation('ui.message');

    React.useEffect(() => {
      const timer = setTimeout(() => {
        onRemove();
      }, 10000);

      return () => clearTimeout(timer);
    }, [onRemove]);

    return (
      <div
        className={cn(
          'flex flex-row bg-bg-100 border border-ui-border rounded-lg shadow-lg overflow-hidden w-[300px] animate-in slide-in-from-right duration-300',
          className
        )}
        ref={ref}
        {...props}
      >
        <div className={cn('w-2 shrink-0', meta.color)}></div>
        <div className="grow p-3">
          <div className="flex items-center justify-between mb-1">
            <Label size="xxs" className="font-bold uppercase tracking-wider opacity-70">
              {t(variant.toLowerCase())}
            </Label>
            <button
              onClick={onRemove}
              className="text-text-400 hover:text-text-950 transition-colors pointer-events-auto"
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
          <p className="text-sm kanit-light text-text-700 leading-snug">{children}</p>
        </div>
      </div>
    );
  }
);

interface MessageWrapperProps {
  classname?: string;
}

export const MessageWrapper: React.FC<MessageWrapperProps> = ({ classname, ...props }) => {
  const StateMessages = useSelector((state: RootState) => state.Message.messages);
  const Dispatch = useDispatch<AppDispatch>();
  const [removingIds, setRemovingIds] = React.useState<number[]>([]);

  const handleRemove = (id: number) => {
    setRemovingIds((prev) => [...prev, id]);
    setTimeout(() => {
      Dispatch(Remove(id));
      setRemovingIds((prev) => prev.filter((i) => i !== id));
    }, 300);
  };

  // Render only the last 8 messages
  const visibleMessages = StateMessages.slice(-8);

  return (
    <div
      id="MessageWrapper"
      className={cn(
        'fixed bottom-6 right-6 z-[110] flex flex-col-reverse gap-3 pointer-events-none',
        classname
      )}
      {...props}
    >
      {visibleMessages.map((ms, index) => (
        <div key={index} className="pointer-events-auto">
          <Message
            variant={ms.variant}
            onRemove={() => handleRemove(index)}
            className={removingIds.includes(index) ? 'opacity-0 translate-x-10 transition-all duration-300' : ''}
          >
            {ms.message}
          </Message>
        </div>
      ))}
    </div>
  );
};
