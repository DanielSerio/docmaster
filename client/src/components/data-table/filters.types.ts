
export type DTMetaFilterName = 'search' | 'select' | 'multi-select' | 'date-range' | 'number-range';

interface DTMetaFilterOption {
  value: string;
  label: string;
}

interface DTMetaFilterBase {
  type: DTMetaFilterName;
  label?: string;
  placeholder?: string;
  options?: DTMetaFilterOption[];
}

export interface DTMetaFilterSearch extends DTMetaFilterBase {
  type: 'search';
  label?: string;
  placeholder?: string;
  options?: never;
}

export interface DTMetaFilterSelect extends DTMetaFilterBase {
  type: 'select';
  label?: string;
  options: DTMetaFilterOption[];
  placeholder?: never;
}

export interface DTMetaFilterMultiSelect extends DTMetaFilterBase {
  type: 'multi-select';
  label?: string;
  options: DTMetaFilterOption[];
  placeholder?: never;
}

export interface DTMetaFilterDateRange extends DTMetaFilterBase {
  type: 'date-range';
  label?: string;
  options?: never;
  placeholder?: never;
}

export interface DTMetaFilterNumberRange extends DTMetaFilterBase {
  type: 'number-range';
  label?: string;
  options?: never;
  placeholder?: never;
}

export type DTMetaFilter = DTMetaFilterSearch | DTMetaFilterSelect | DTMetaFilterMultiSelect | DTMetaFilterDateRange | DTMetaFilterNumberRange;