import { z } from 'zod';

export const documentFormSchema = z.object({
  documentType: z.enum(['rule', 'general']),
  filename: z
    .string()
    .min(1, 'Filename is required')
    .regex(/^[a-zA-Z0-9._-]+$/)
});

export type DocumentFormData = z.infer<typeof documentFormSchema>;
