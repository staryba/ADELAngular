export enum EntityType {
  BusinessObject = 1,
  Profile = 2,
  Entity = 3
}

export enum Status {
  Active = 1,
  Deleted = 2
}

export interface TreeNodeDto {
  id: number;
  name: string;
  entityType: EntityType;
  parentId?: number;
  profileId?: number;
  hasChildren: boolean;
  childCount: number;
  status: Status;
}

export interface TreeNode extends TreeNodeDto {
  level: number;
  isExpanded: boolean;
  isLoading: boolean;
  children?: TreeNode[];
}
