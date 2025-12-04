
export type DTMetaFilterName = 'search' | 'select' | 'multi-select' | 'date-range' | 'number-range';

interface DTMetaFilterOption {
  value: string;
  label: string;
}

interface DTMetaFilterBase {
  type: DTMetaFilterName;
  options?: DTMetaFilterOption[];
}

export interface DTMetaFilterSearch extends DTMetaFilterBase {
  type: 'search';
  options?: never;
}

export interface DTMetaFilterSelect extends DTMetaFilterBase {
  type: 'select';
  options: DTMetaFilterOption[];
}

export interface DTMetaFilterMultiSelect extends DTMetaFilterBase {
  type: 'multi-select';
  options: DTMetaFilterOption[];
}

export interface DTMetaFilterDateRange extends DTMetaFilterBase {
  type: 'date-range';
  options?: never;
}

export interface DTMetaFilterNumberRange extends DTMetaFilterBase {
  type: 'number-range';
  options?: never;
}

export type DTMetaFilter = DTMetaFilterSearch | DTMetaFilterSelect | DTMetaFilterMultiSelect | DTMetaFilterDateRange | DTMetaFilterNumberRange;