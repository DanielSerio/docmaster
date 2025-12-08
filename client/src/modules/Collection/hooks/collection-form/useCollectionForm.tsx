import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { collectionFormSchema } from '@/lib/schemas/collection';

export function useCollectionForm() {
  return useForm({
    resolver: standardSchemaResolver(collectionFormSchema),
    defaultValues: {
      name: ''
    }
  });
}
