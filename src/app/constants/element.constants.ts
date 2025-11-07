/**
 * Hardcoded element ID mappings for Profile and BusinessObject entities.
 * These IDs correspond to the element positions in the profile/business object schema.
 *
 * IMPORTANT: All entity types (BusinessObject, Profile, Entity) are treated identically.
 * They differ ONLY by their EntityType field. There are NO special cases in retrieval/saving/updating logic.
 */

/**
 * Profile entity element IDs (EntityType = 2)
 * A Profile is a parent container with 2 hardcoded elements (like BusinessObject)
 * It contains child ProfileEntity elements that define the schema
 */
export const ProfileElementIds = {
  /** Element 1: Entity name (stored as string) */
  EntityName: 1,

  /** Element 2: Status (stored as integer: 1=Active, 2=Deleted) */
  Status: 2
} as const;

/**
 * Maps Profile element ID to display name
 */
export function getProfileElementName(elementId: number): string {
  const nameMap: Record<number, string> = {
    [ProfileElementIds.EntityName]: 'Entity Name',
    [ProfileElementIds.Status]: 'Status'
  };

  return nameMap[elementId] || `Element ${elementId}`;
}

/**
 * ProfileEntity element IDs (EntityType = 4)
 * A ProfileEntity defines one field/column in a schema with these 11 hardcoded elements
 * Each ProfileEntity is a child of a Profile entity
 */
export const ProfileEntityElementIds = {
  /** Element 1: Name of the field (stored as string) */
  Name: 1,

  /** Element 2: Data type of the field (stored as string) */
  DataType: 2,

  /** Element 3: Whether this field is a primary key (stored as boolean) */
  PrimaryKey: 3,

  /** Element 4: Foreign key reference (stored as string) */
  ForeignKey: 4,

  /** Element 5: Default value for the field (stored as string) */
  DefaultValue: 5,

  /** Element 6: Constraint definition (stored as string) */
  Constraint: 6,

  /** Element 7: Function expression (stored as string) */
  Function: 7,

  /** Element 8: Whether this is a function-only field (stored as boolean) */
  FunctionOnly: 8,

  /** Element 9: Display order number (stored as integer) */
  OrderNumber: 9,

  /** Element 10: Whether NULL values are allowed (stored as boolean) */
  AllowNull: 10,

  /** Element 11: Status (stored as integer: 1=Active, 2=Deleted) */
  Status: 11
} as const;

/**
 * Maps ProfileEntity element ID to display name
 */
export function getProfileEntityElementName(elementId: number): string {
  const nameMap: Record<number, string> = {
    [ProfileEntityElementIds.Name]: 'Name',
    [ProfileEntityElementIds.DataType]: 'Data Type',
    [ProfileEntityElementIds.PrimaryKey]: 'Primary Key',
    [ProfileEntityElementIds.ForeignKey]: 'Foreign Key',
    [ProfileEntityElementIds.DefaultValue]: 'Default Value',
    [ProfileEntityElementIds.Constraint]: 'Constraint',
    [ProfileEntityElementIds.Function]: 'Function',
    [ProfileEntityElementIds.FunctionOnly]: 'Function Only',
    [ProfileEntityElementIds.OrderNumber]: 'Order Number',
    [ProfileEntityElementIds.AllowNull]: 'Allow Null',
    [ProfileEntityElementIds.Status]: 'Status'
  };

  return nameMap[elementId] || `Element ${elementId}`;
}

/**
 * BusinessObject entity element IDs (EntityType = 1)
 * A BusinessObject acts as a container/folder with these 2 hardcoded elements
 */
export const BusinessObjectElementIds = {
  /** Element 1: Entity name (stored as string) */
  EntityName: 1,

  /** Element 2: Status (stored as integer: 1=Active, 2=Deleted) */
  Status: 2
} as const;

/**
 * Maps BusinessObject element ID to display name
 */
export function getBusinessObjectElementName(elementId: number): string {
  const nameMap: Record<number, string> = {
    [BusinessObjectElementIds.EntityName]: 'Entity Name',
    [BusinessObjectElementIds.Status]: 'Status'
  };

  return nameMap[elementId] || `Element ${elementId}`;
}

/**
 * Entity elements are NOT hardcoded - they are defined by the Profile entity that the Entity references via ProfileId
 */
