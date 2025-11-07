export interface ElementValue {
  elementId: number;
  value: any;
  dataType: string;
  revisionId: number;
  userId: string;
}

export interface EntityDetail {
  id: number;
  entityType: number;
  profileId: number;
  values: { [elementId: string]: ElementValue };
  children?: EntityDetail[];
}

export interface TableViewColumn {
  elementId: number;
  name: string;
  dataType: string;
}

export interface TableViewRow {
  [key: string]: any; // Dynamic properties based on element names
  _entityId: number; // Special field to track entity ID
}

export interface TableViewData {
  columns: TableViewColumn[];
  rows: TableViewRow[];
}

export interface ProfileElement {
  id: number;
  properties: {
    Name?: string;
    DataType?: string;
    PrimaryKey?: boolean;
    OrderNumber?: number;
    AllowNull?: boolean;
    [key: string]: any;
  };
}

export interface ProfileDto {
  id: number;
  parentEntityId: number | null;
  elements: ProfileElement[];
  entityCount: number;
}
