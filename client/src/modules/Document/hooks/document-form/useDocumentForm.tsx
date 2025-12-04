import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';

const documentFormSchema = z.object({
  documentType: z.enum(['rule', 'general']),
  filename: z
    .string()
    .min(1, 'Filename is required')
    .regex(/^[a-zA-Z0-9._-]+$/)
});

export function useDocumentForm() {
  return useForm({
    resolver: standardSchemaResolver(documentFormSchema),
    defaultValues: {
      documentType: 'general' as const,
      filename: ''
    }
  });
}
