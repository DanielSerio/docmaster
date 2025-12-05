import { trpc } from '@/lib/trpc/react';
import type { UseMutationParams } from '@/types';

export function useCreateCollectionMutation({ onSuccess, onError }: UseMutationParams) {
  return trpc.documentCollection.create.useMutation({
    onSuccess,
    onError: (error) => onError(error)
  });
}
