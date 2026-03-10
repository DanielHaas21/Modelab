import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { Button } from './Button';
import { resolveConfirmation, showConfirmation } from '../../../store/slices/Confirmation';
import { v4 as uuidv4 } from 'uuid';
import { registerResolver } from '../../../store/utils/Resolver';
import { getBody, registerBody, removeBody } from '../../../store/utils/ConfirmationBodyRegistry';

export const GeneralPopup: React.FC = () => {
  const Confirmation = useSelector((state: RootState) => state.ConfirmationSlice);
  const Dispatch = useDispatch<AppDispatch>();

  if (!Confirmation.isVisible) return false;

  const body = getBody(Confirmation.confirmationId);

  const handleResolve = (value: boolean) => {
    removeBody(Confirmation.confirmationId);
    Dispatch(resolveConfirmation(value));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex flex-col items-center justify-between w-[450px] bg-bg-100 border border-ui-border rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <h2 className="text-2xl kanit-regular w-full text-left mb-4">{Confirmation.text}</h2>
        {body !== undefined && (
          <div className="w-full kanit-light pb-6 text-text-700">{body}</div>
        )}
        <div className="flex flex-row items-center justify-end gap-3 w-full">
          {Confirmation.isDeclinable ? (
            <>
              <Button
                onClick={() => handleResolve(false)}
                className="justify-center"
                variant="light"
                size="md"
              >
                {Confirmation.responseB ?? 'Cancel'}
              </Button>
              <Button
                autoFocus
                className="justify-center"
                variant="primary"
                size="md"
                onClick={() => handleResolve(true)}
              >
                {Confirmation.responseA ?? 'Confirm'}
              </Button>
            </>
          ) : (
            <Button
              className="justify-center w-full"
              variant="primary"
              size="md"
              onClick={() => handleResolve(true)}
            >
              {Confirmation.responseA ?? 'I understand'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const confirm = (
  text: string,
  isDeclinable = true,
  dispatch: AppDispatch,
  responseA: string | undefined = undefined,
  responseB: string | undefined = undefined,
  body: React.ReactNode = undefined
): Promise<boolean> => {
  const id = uuidv4();

  registerBody(id, body);

  return new Promise((resolve) => {
    registerResolver(id, resolve);
    dispatch(
      showConfirmation({ text, isDeclinable, confirmationId: id, responseA, responseB })
    );
  });
};
