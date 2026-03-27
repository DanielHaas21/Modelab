import { v4 as uuidv4 } from 'uuid';
import { registerResolver } from '../../../../store/utils/Resolver';
import { AppDispatch } from '../../../../store/store';
import { showConfirmation } from '../../../../store/slices/Confirmation';
import { registerBody } from '../../../../store/utils/ConfirmationBodyRegistry';

export const confirmPopup = (
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