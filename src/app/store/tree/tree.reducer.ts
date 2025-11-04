import { createReducer, on } from '@ngrx/store';
import { TreeNode, TreeNodeDto } from '../../models/tree-node.model';
import * as TreeActions from './tree.actions';

export interface TreeState {
  nodes: TreeNode[];
  flatNodes: TreeNode[]; // Flattened list for virtual scrolling
  selectedNodeId: number | null;
  loading: boolean;
  error: string | null;
}

export const initialState: TreeState = {
  nodes: [],
  flatNodes: [],
  selectedNodeId: null,
  loading: false,
  error: null
};

// Helper function to convert TreeNodeDto to TreeNode
function convertToTreeNode(dto: TreeNodeDto, level: number = 0): TreeNode {
  return {
    ...dto,
    level,
    isExpanded: false,
    isLoading: false,
    children: []
  };
}

// Helper function to flatten tree for virtual scrolling
function flattenTree(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = [];

  function traverse(node: TreeNode) {
    result.push(node);
    if (node.isExpanded && node.children) {
      node.children.forEach(child => traverse(child));
    }
  }

  nodes.forEach(node => traverse(node));
  return result;
}

// Helper function to find and update a node
function updateNode(
  nodes: TreeNode[],
  nodeId: number,
  updateFn: (node: TreeNode) => TreeNode
): TreeNode[] {
  return nodes.map(node => {
    if (node.id === nodeId) {
      return updateFn(node);
    }
    if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: updateNode(node.children, nodeId, updateFn)
      };
    }
    return node;
  });
}

export const treeReducer = createReducer(
  initialState,

  // Load root nodes
  on(TreeActions.loadRootNodes, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(TreeActions.loadRootNodesSuccess, (state, { nodes }) => {
    const treeNodes = nodes.map(dto => convertToTreeNode(dto, 0));
    return {
      ...state,
      nodes: treeNodes,
      flatNodes: flattenTree(treeNodes),
      loading: false,
      error: null
    };
  }),

  on(TreeActions.loadRootNodesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load children
  on(TreeActions.loadChildren, (state, { nodeId }) => {
    const updatedNodes = updateNode(state.nodes, nodeId, node => ({
      ...node,
      isLoading: true
    }));
    return {
      ...state,
      nodes: updatedNodes,
      flatNodes: flattenTree(updatedNodes)
    };
  }),

  on(TreeActions.loadChildrenSuccess, (state, { parentId, children }) => {
    const updatedNodes = updateNode(state.nodes, parentId, parent => {
      const childNodes = children.map(dto => convertToTreeNode(dto, parent.level + 1));
      return {
        ...parent,
        isLoading: false,
        children: childNodes,
        isExpanded: true
      };
    });
    return {
      ...state,
      nodes: updatedNodes,
      flatNodes: flattenTree(updatedNodes)
    };
  }),

  on(TreeActions.loadChildrenFailure, (state, { nodeId, error }) => {
    const updatedNodes = updateNode(state.nodes, nodeId, node => ({
      ...node,
      isLoading: false
    }));
    return {
      ...state,
      nodes: updatedNodes,
      flatNodes: flattenTree(updatedNodes),
      error
    };
  }),

  // Toggle node
  on(TreeActions.toggleNode, (state, { nodeId }) => {
    const updatedNodes = updateNode(state.nodes, nodeId, node => ({
      ...node,
      isExpanded: !node.isExpanded
    }));
    return {
      ...state,
      nodes: updatedNodes,
      flatNodes: flattenTree(updatedNodes)
    };
  }),

  // Select node
  on(TreeActions.selectNode, (state, { nodeId }) => ({
    ...state,
    selectedNodeId: nodeId
  })),

  // Deselect node
  on(TreeActions.deselectNode, state => ({
    ...state,
    selectedNodeId: null
  }))
);
