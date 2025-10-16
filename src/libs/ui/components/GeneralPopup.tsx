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
    <div className="d-flex align-items-center justify-content-center w-100-vw h-100-vh position-fixed blur fade-in-nodir">
      <div className="d-flex fade-in align-items-center justify-content-between flex-column w-450-px bg-light rounded-4 p-3">
        <h2 className="fs-4 kanit-regular w-100 text-start">{Confirmation.text}</h2>
        {body !== undefined && (
          <div className="w-100 kanit-regular pb-2">{body}</div>
        )}
        {Confirmation.isDeclinable ? (
          <div className="d-flex align-items-center justify-content-between flex-row w-100">
            <Button
              autoFocus
              className="justify-content-center mr-2"
              variant="primary"
              onClick={() => handleResolve(true)}
            >
              {Confirmation.responseA ?? 'Yes'}
            </Button>
            <Button
              onClick={() => handleResolve(false)}
              className="justify-content-center"
              variant="light"
            >
              {Confirmation.responseB ?? 'No'}
            </Button>
          </div>
        ) : (
          <Button
            className="justify-content-center"
            variant="primary"
            onClick={() => handleResolve(true)}
          >
            {Confirmation.responseA ?? 'I understand'}
          </Button>
        )}
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
