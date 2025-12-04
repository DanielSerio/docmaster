import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '@/components/ui/field';
import type { useDocumentForm } from '../../hooks/document-form';
import { useCreateDocumentMutation } from '../../hooks/mutations';
import { Input } from '@/components/ui/input';
import { AsyncButton } from '@/components/ui/async-button';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Controller } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';

export function DocumentForm({ form }: { form: ReturnType<typeof useDocumentForm> }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isValid }
  } = form;
  const navigate = useNavigate();
  const mutation = useCreateDocumentMutation({
    onSuccess: () => navigate({ to: '/documents' }),
    onError: () => {
      console.log('error');
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
        <FieldLegend>Create Document</FieldLegend>
        <FieldDescription>Fill out the form below to create a new document.</FieldDescription>
        <FieldGroup className="gap-y-4">
          <Controller
            control={control}
            name="documentType"
            render={({ field }) => {
              return (
                <Field>
                  <FieldLabel> Document Type</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger onBlur={field.onBlur}>
                      <SelectValue placeholder="Select a document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rule">Rule</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              );
            }}
          />
          <Field>
            <FieldLabel>
              <span>Filename</span>
              <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              type="text"
              {...register('filename')}
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
