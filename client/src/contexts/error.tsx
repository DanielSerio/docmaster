import { createContext, useContext, useState, useCallback } from 'react';
import { ErrorSnackbar } from '@/components/feedback/ErrorSnackbar';

export type ErrorState = { message: string } & Record<string, unknown>;

export interface ErrorContextValue {
  error: ErrorState | null;
  setError: (error: unknown) => void;
  clearError: () => void;
}

const timeout = 100;

const ErrorContext = createContext<ErrorContextValue | null>(null);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setErrorState] = useState<ErrorState | null>(null);
  const [errorQueue, setErrorQueue] = useState<ErrorState[]>([]);

  const setError = useCallback(
    (newError: unknown) => {
      const nextError: ErrorState =
        newError && typeof newError === 'object' && 'message' in (newError as any)
          ? (newError as ErrorState)
          : { message: String(newError ?? 'Unknown error') };

      if (error) {
        setErrorQueue((prev) => [...prev, nextError]);
      } else {
        setErrorState(nextError);
      }
    },
    [error]
  );

  const clearError = useCallback(() => {
    setErrorState(null);

    if (errorQueue.length > 0) {
      const [nextError, ...remainingQueue] = errorQueue;
      setErrorQueue(remainingQueue);
      setTimeout(() => {
        setErrorState(nextError);
      }, timeout);
    }
  }, [errorQueue]);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      <ErrorSnackbar />
      {children}
    </ErrorContext.Provider>
  );
}

export function useError(): ErrorContextValue {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within ErrorProvider');
  }
  return context;
}

export function useErrorReporter() {
  const context = useContext(ErrorContext);
  const reportError = useCallback(
    (error: unknown) => {
      context?.setError(error);
    },
    [context]
  );

  return { reportError };
}
