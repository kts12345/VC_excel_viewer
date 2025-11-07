export type TableRow = Record<string, string | number | boolean | Date | null>;

export interface FileData {
  id: string;
  name: string;
  headers: string[];
  data: TableRow[];
  size: number; // in bytes
  rowCount: number;
}

// New types for advanced filtering
export interface CheckboxFilter {
    type: 'checkbox';
    selected: (string | number | boolean | Date)[];
}

export interface TextFilter {
    type: 'text';
    value: string;
}

export type Filter = CheckboxFilter | TextFilter;