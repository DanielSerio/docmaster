import { createContext, useContext, useState, useCallback } from 'react';
import { ErrorSnackbar } from '@/components/feedback/ErrorSnackbar';
import type { AppRouter } from '../../../server/src/routers/index.js';
import type { TRPCClientErrorLike } from '@trpc/client';

export type ErrorState = Omit<TRPCClientErrorLike<AppRouter>, 'shape'> &
  Partial<TRPCClientErrorLike<AppRouter>['shape']>;

export interface ErrorContextValue {
  error: ErrorState | null;
  setError: (error: ErrorState) => void;
  clearError: () => void;
}

const timeout = 100;

const ErrorContext = createContext<ErrorContextValue | null>(null);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setErrorState] = useState<ErrorState | null>(null);
  const [errorQueue, setErrorQueue] = useState<ErrorState[]>([]);

  const setError = useCallback(
    (newError: ErrorState) => {
      if (error) {
        setErrorQueue((prev) => [...prev, newError]);
      } else {
        setErrorState(newError);
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
