import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { TreeNode, EntityType } from '../../models/tree-node.model';
import * as TreeActions from '../../store/tree/tree.actions';
import * as TreeSelectors from '../../store/tree/tree.selectors';

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [
    CommonModule,
    ScrollingModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './tree-view.component.html',
  styleUrl: './tree-view.component.scss'
})
export class TreeViewComponent implements OnInit {
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;

  flatNodes$: Observable<TreeNode[]>;
  selectedNodeId$: Observable<number | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  readonly itemSize = 36; // Height of each tree item in pixels
  readonly EntityType = EntityType;

  contextMenuPosition = { x: '0px', y: '0px' };
  selectedContextNode: TreeNode | null = null;

  constructor(private store: Store) {
    this.flatNodes$ = this.store.select(TreeSelectors.selectFlatNodes);
    this.selectedNodeId$ = this.store.select(TreeSelectors.selectSelectedNodeId);
    this.loading$ = this.store.select(TreeSelectors.selectLoading);
    this.error$ = this.store.select(TreeSelectors.selectError);
  }

  ngOnInit(): void {
    // Load root nodes on initialization
    this.store.dispatch(TreeActions.loadRootNodes());
  }

  toggleNode(node: TreeNode, event: Event): void {
    event.stopPropagation();

    if (node.hasChildren) {
      if (!node.isExpanded && (!node.children || node.children.length === 0)) {
        // Load children if not loaded yet
        this.store.dispatch(TreeActions.loadChildren({ nodeId: node.id }));
      } else {
        // Just toggle expansion
        this.store.dispatch(TreeActions.toggleNode({ nodeId: node.id }));
      }
    }
  }

  selectNode(node: TreeNode): void {
    this.store.dispatch(TreeActions.selectNode({ nodeId: node.id }));
  }

  getNodeIcon(node: TreeNode): string {
    switch (node.entityType) {
      case EntityType.BusinessObject:
        return 'business_center';
      case EntityType.Profile:
        return 'description';
      case EntityType.Entity:
        return 'article';
      default:
        return 'circle';
    }
  }

  getExpandIcon(node: TreeNode): string {
    if (!node.hasChildren) {
      return '';
    }
    return node.isExpanded ? 'expand_more' : 'chevron_right';
  }

  onContextMenu(event: MouseEvent, node: TreeNode): void {
    event.preventDefault();
    event.stopPropagation();

    // Store the node for context menu actions
    this.selectedContextNode = node;

    // Set menu position
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';

    // Open menu if available
    if (this.contextMenu) {
      this.contextMenu.openMenu();
    }
  }

  onCreateBusinessObject(): void {
    console.log('Create Business Object for node:', this.selectedContextNode);
    // TODO: Implement create business object
  }

  onCreateProfile(): void {
    console.log('Create Profile for node:', this.selectedContextNode);
    // TODO: Implement create profile
  }

  onCreateEntity(): void {
    console.log('Create Entity for node:', this.selectedContextNode);
    // TODO: Implement create entity
  }

  onEdit(): void {
    console.log('Edit node:', this.selectedContextNode);
    // TODO: Implement edit
  }

  onDelete(): void {
    console.log('Delete node:', this.selectedContextNode);
    // TODO: Implement delete
  }

  trackByNodeId(index: number, node: TreeNode): number {
    return node.id;
  }
}
