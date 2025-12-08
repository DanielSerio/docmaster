import { CategoryTypeAhead } from '@/components/ui/category-typeahead';

const meta = {
  title: 'ui/CategoryTypeAhead',
  component: CategoryTypeAhead,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;

export const Default = {
  args: {
    placeholder: 'Search for a category',
    value: '',
    suggestions: ['Category 1', 'Category 2']
  }
};
