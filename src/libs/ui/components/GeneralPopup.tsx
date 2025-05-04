import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { Button } from './Button';
import { resolveConfirmation, showConfirmation } from '../../../store/slices/Confirmation';
import { v4 as uuidv4 } from 'uuid';
import { registerResolver } from '../../../store/utils/Resolver';

export const GeneralPopup: React.FC = () => {
  const Confirmation = useSelector((state: RootState) => state.ConfirmationSlice);
  const Dispatch = useDispatch<AppDispatch>();

  if (!Confirmation.isVisible) return false;

  return (
    <div className="d-flex align-items-center justify-content-center w-100-vw h-100-vh position-fixed blur fade-in-nodir">
      <div className="d-flex fade-in align-items-center justify-content-between flex-column w-450-px h-200-px bg-light rounded-4 p-3">
        <h2 className="fs-4 kanit-regular w-90 text-center">{Confirmation.text}</h2>
        {Confirmation.isDeclinable ? (
          <div className="d-flex align-items-center justify-content-between flex-row w-60 mb-5">
            <Button
              className="justify-content-center mr-2"
              variant="primary"
              onClick={() => Dispatch(resolveConfirmation(true))}
            >
              Yes
            </Button>
            <Button
              onClick={() => Dispatch(resolveConfirmation(false))}
              className="justify-content-center"
              variant="light"
            >
              No
            </Button>
          </div>
        ) : (
          <Button
            className="justify-content-center mr-2"
            variant="primary"
            onClick={() => Dispatch(resolveConfirmation(true))}
          >
            I understand
          </Button>
        )}
      </div>
    </div>
  );
};

export const confirm = (
  text: string,
  isDeclinable = true,
  dispatch: AppDispatch
): Promise<boolean> => {
  const id = uuidv4();

  return new Promise((resolve) => {
    registerResolver(id, resolve);
    dispatch(showConfirmation({ text, isDeclinable, confirmationId: id }));
  });
};
