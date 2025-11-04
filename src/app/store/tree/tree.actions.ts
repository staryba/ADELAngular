import { createAction, props } from '@ngrx/store';
import { TreeNode, TreeNodeDto } from '../../models/tree-node.model';

// Load root nodes
export const loadRootNodes = createAction('[Tree] Load Root Nodes');

export const loadRootNodesSuccess = createAction(
  '[Tree] Load Root Nodes Success',
  props<{ nodes: TreeNodeDto[] }>()
);

export const loadRootNodesFailure = createAction(
  '[Tree] Load Root Nodes Failure',
  props<{ error: string }>()
);

// Load children of a node
export const loadChildren = createAction(
  '[Tree] Load Children',
  props<{ nodeId: number }>()
);

export const loadChildrenSuccess = createAction(
  '[Tree] Load Children Success',
  props<{ parentId: number; children: TreeNodeDto[] }>()
);

export const loadChildrenFailure = createAction(
  '[Tree] Load Children Failure',
  props<{ nodeId: number; error: string }>()
);

// Toggle node expansion
export const toggleNode = createAction(
  '[Tree] Toggle Node',
  props<{ nodeId: number }>()
);

// Select node
export const selectNode = createAction(
  '[Tree] Select Node',
  props<{ nodeId: number }>()
);

// Deselect node
export const deselectNode = createAction('[Tree] Deselect Node');
