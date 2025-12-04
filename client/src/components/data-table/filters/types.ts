import type { DTMetaFilter } from '../filters.types';

export interface DTFilterProps {
  columnId: string;
  filterConfig: DTMetaFilter;
  value: unknown;
  onChange: (value: unknown) => void;
  onClear: () => void;
}
