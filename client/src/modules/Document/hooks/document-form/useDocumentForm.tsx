import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { documentFormSchema } from '@/lib/schemas/document';

export function useDocumentForm() {
  return useForm({
    resolver: standardSchemaResolver(documentFormSchema),
    defaultValues: {
      documentType: 'general' as const,
      filename: ''
    }
  });
}
