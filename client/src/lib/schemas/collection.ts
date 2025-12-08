import { z } from 'zod';

export const collectionFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name cannot exceed 255 characters')
});

export type CollectionFormData = z.infer<typeof collectionFormSchema>;
