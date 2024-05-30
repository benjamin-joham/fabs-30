import loggerService from '@/services/logger.service';

interface ErrorModel {
  /**
   * Descriptive, human readable error message.
   */
  message?: string;
  /**
   * Additional classification specific for each
   * error type e.g. 'noStock'.
   */
  reason?: string;
  /**
   * Identifier of the related object e.g. '1'.
   */
  subject?: string;
  /**
   * Type of the object related to the error
   * e.g. 'entry'.
   */
  subjectType?: string;
  /**
   * Type of the error e.g. 'LowStockError'.
   */
  type?: string;
}

type ActionError = {
  message: string;
  error: true;
  errors?: ErrorModel[];
  type?: string;
  reason?: string;
  subjectType?: string;
};


const getAction = <Attributes extends unknown[], K extends Promise<unknown>>(
  fn: (...a: Attributes) => K,
  errorCallback: (error: unknown) => void,
) => {
  return async (...a: Attributes): Promise<Awaited<K> | ActionError> => {
    try {
      return await fn(...a);
    } catch (error) {
      errorCallback(error);
      return {
        message: (error as Error).message,
        error: true,
      };
    }
  };
};

export const createAction =
  (logger: (error: unknown) => void) =>
  <Attributes extends unknown[], K extends Promise<unknown>>(fn: (...a: Attributes) => K) =>
    getAction(fn, logger);

const isActionError = (result: unknown): result is ActionError =>
  (result as ActionError)?.error === true;

export const handleAction = <T>(result: T | ActionError, context?: string): T => {
  if (isActionError(result)) {
    loggerService.captureException(result, context);
    throw new Error(result.message);
  }

  return result;
};
