import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';

const collectionFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name cannot exceed 255 characters')
});

export function useCollectionForm() {
  return useForm({
    resolver: standardSchemaResolver(collectionFormSchema),
    defaultValues: {
      name: ''
    }
  });
}
