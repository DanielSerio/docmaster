import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '@/components/ui/field';
import type { useCollectionForm } from '../../hooks/collection-form';
import { useCreateCollectionMutation } from '../../hooks/mutations';
import { Input } from '@/components/ui/input';
import { AsyncButton } from '@/components/ui/async-button';
import { Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useError, type ErrorState } from '@/contexts/error';

export function CollectionForm({ form }: { form: ReturnType<typeof useCollectionForm> }) {
  const {
    register,
    handleSubmit,
    formState: { isValid }
  } = form;
  const { setError } = useError();
  const navigate = useNavigate();
  const mutation = useCreateCollectionMutation({
    onSuccess: () => navigate({ to: '/collections' }),
    onError: (error) => {
      setError(error as ErrorState);
    }
  });

  const onSubmit = (data: Parameters<typeof mutation.mutate>[0]) => {
    mutation.mutate(data);
  };

  return (
    <form
      className="max-w-md mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FieldSet>
        <FieldLegend>Create Collection</FieldLegend>
        <FieldDescription>Fill out the form below to create a new collection.</FieldDescription>
        <FieldGroup className="gap-y-4">
          <Field>
            <FieldLabel>
              <span>Name</span>
              <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              type="text"
              {...register('name')}
            />
          </Field>
        </FieldGroup>
      </FieldSet>
      <footer className="flex justify-end mt-4">
        <AsyncButton
          type="submit"
          disabled={!isValid}
          isBusy={mutation.isPending}
          icon={<Plus />}
        >
          Create
        </AsyncButton>
      </footer>
    </form>
  );
}
