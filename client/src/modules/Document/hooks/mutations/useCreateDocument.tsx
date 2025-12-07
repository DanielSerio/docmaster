import { trpc } from '@/lib/trpc/react';
import type { UseMutationParams } from '@/types';

export function useCreateDocumentMutation({ onSuccess, onError }: UseMutationParams) {
  return trpc.document.create.useMutation({
    onSuccess,
    onError: (error: unknown) => onError(error)
  });
}
