import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TreeState } from './tree.reducer';

export const selectTreeState = createFeatureSelector<TreeState>('tree');

export const selectAllNodes = createSelector(
  selectTreeState,
  state => state.nodes
);

export const selectFlatNodes = createSelector(
  selectTreeState,
  state => state.flatNodes
);

export const selectSelectedNodeId = createSelector(
  selectTreeState,
  state => state.selectedNodeId
);

export const selectSelectedNode = createSelector(
  selectFlatNodes,
  selectSelectedNodeId,
  (flatNodes, selectedId) =>
    selectedId ? flatNodes.find(node => node.id === selectedId) : null
);

export const selectLoading = createSelector(
  selectTreeState,
  state => state.loading
);

export const selectError = createSelector(
  selectTreeState,
  state => state.error
);
