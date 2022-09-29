export type ViewMode = 'desktop' | 'mobile'

export interface InputFileOption {
  disabled: boolean;
  file: File;
  type?: 'any' | 'image';
  label?: string
  image_url?: string
}
export interface InputImageOption {
  label: string;
  limit: number;
  file: (File | string)[];
}
export interface InputOption {
  name: string
  placeholder: string
  model: string
  value?: string
  icon?: string
  label?: string
  error?: string
  type?: 'email' | 'password' | 'tel' | 'number'
  disabled?: boolean
  options?: (string | {
    name: string
    value: string
  })[]
}

export interface InputSearchOption {
  name: string
  placeholder: string
  model: string
  type?: 'primary' | 'secondary'
}

export interface InputGeneric<T> {
  name: string
  placeholder: string
  model: string
  value?: T
  icon?: string
  label?: string
  error?: string
  type?: 'email' | 'password' | 'tel' | 'number'
  disabled?: boolean
  options?: (string | {
    name: string
    value: string
  })[]
}

export interface ChartCashflow {
  label: Date;
  value: [number, number];
}

export interface UserRecord {
  _id: string;
  name: string;
  role_id: string[];
}