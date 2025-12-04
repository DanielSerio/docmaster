import { AsyncButton } from '@/components/ui/async-button';
import { Save } from 'lucide-react';

const meta = {
  title: 'UI/AsyncButton',
  component: AsyncButton
};

export default meta;

export const Default = () => {
  return <AsyncButton icon={<Save />}>Save</AsyncButton>;
};

export const Loading = () => {
  return (
    <AsyncButton
      icon={<Save />}
      isBusy
    >
      Save
    </AsyncButton>
  );
};
