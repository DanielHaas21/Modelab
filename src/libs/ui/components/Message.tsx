import * as React from 'react';
import { cn } from '../../utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Remove } from '../../../store/slices/Message';
import { Label } from './Label';

const variantMeta = {
  Success: { label: 'Success', color: 'bg-success' },
  Warning: { label: 'Warning', color: 'bg-warning' },
  Error: { label: 'Error', color: 'bg-danger' },
  Alert: { label: 'Alert', color: 'bg-danger' },
  Info: { label: 'Info', color: 'bg-info' },
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

    React.useEffect(() => {
      const timer = setTimeout(() => {
        onRemove();
      }, 10000);

      return () => clearTimeout(timer);
    }, [onRemove]);

    return (
      <div
        className={cn(
          className,
          variant,
          'd-flex bg-light overflow-hidden flex-row message fade-in-right justify-content-start align-items-stretch rounded-3 w-250-px'
        )}
        ref={ref}
        {...props}
      >
        <div className={cn(meta.color, 'msg-tag')}></div>
        <div className="h-100 pt-1 pb-1 mr-1">
          <Label size="xxs" className="mt-1 mb-0 kanit-regular">
            {meta.label}
          </Label>
          <p className="kanit-light m-0 w-100">{children}</p>
        </div>
        <FontAwesomeIcon
          icon={faClose}
          className="fs-3 mr-1 ms-auto cursor-pointer align-self-center"
          onClick={onRemove}
        ></FontAwesomeIcon>
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
        classname,
        'position-fixed p-3 d-flex flex-column-reverse gap-2 overflow-visible'
      )}
      {...props}
    >
      {visibleMessages.map((ms, index) => (
        <Message
          key={index}
          variant={ms.variant}
          onRemove={() => handleRemove(index)}
          className={removingIds.includes(index) ? 'exit' : ''}
        >
          {ms.message}
        </Message>
      ))}
    </div>
  );
};
