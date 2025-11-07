import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { Store } from '@ngrx/store';
import { TreeViewComponent } from '../tree-view/tree-view.component';
import { TableViewComponent } from '../table-view/table-view.component';
import { ConnectionDialogComponent } from '../connection-dialog/connection-dialog.component';
import { ConnectionConfigService } from '../../services/connection-config.service';
import { DatabaseConnection } from '../../models/database-connection.model';
import * as TreeActions from '../../store/tree/tree.actions';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatBadgeModule,
    TreeViewComponent,
    TableViewComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  treeWidth = 20; // Default 20% width
  tableHeight = 75; // Default 75% height for table view
  isTreeCollapsed = false;
  currentConnection: DatabaseConnection | null = null;

  constructor(
    private dialog: MatDialog,
    private connectionService: ConnectionConfigService,
    private store: Store
  ) {}

  ngOnInit() {
    // Load saved layout state from localStorage
    const savedTreeWidth = localStorage.getItem('adel-tree-width');
    const savedTableHeight = localStorage.getItem('adel-table-height');
    const savedTreeCollapsed = localStorage.getItem('adel-tree-collapsed');

    if (savedTreeWidth) {
      this.treeWidth = parseInt(savedTreeWidth, 10);
    }
    if (savedTableHeight) {
      this.tableHeight = parseInt(savedTableHeight, 10);
    }
    if (savedTreeCollapsed) {
      this.isTreeCollapsed = savedTreeCollapsed === 'true';
    }

    // Subscribe to current connection changes
    this.connectionService.currentConnection$.subscribe(connection => {
      const previousConnection = this.currentConnection;
      this.currentConnection = connection;

      // If connection changed (not initial load), reset the tree view
      if (previousConnection && connection && previousConnection.id !== connection.id) {
        console.log('Database connection changed, resetting tree view');
        this.store.dispatch(TreeActions.resetTree());
      }
    });
  }

  onTreeResize(event: MouseEvent) {
    const startX = event.clientX;
    const startWidth = this.treeWidth;
    const containerWidth = document.querySelector('.layout-container')?.clientWidth || window.innerWidth;

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newWidth = startWidth + (deltaX / containerWidth) * 100;
      this.treeWidth = Math.max(10, Math.min(50, newWidth)); // Between 10% and 50%
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      localStorage.setItem('adel-tree-width', this.treeWidth.toString());
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  onTableResize(event: MouseEvent) {
    const startY = event.clientY;
    const startHeight = this.tableHeight;
    const containerElement = document.querySelector('.right-panel-content');
    const containerHeight = containerElement?.clientHeight || window.innerHeight;

    const onMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newHeight = startHeight + (deltaY / containerHeight) * 100;
      this.tableHeight = Math.max(25, Math.min(90, newHeight)); // Between 25% and 90%
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      localStorage.setItem('adel-table-height', this.tableHeight.toString());
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  toggleTree() {
    this.isTreeCollapsed = !this.isTreeCollapsed;
    localStorage.setItem('adel-tree-collapsed', this.isTreeCollapsed.toString());
  }

  openConnectionDialog() {
    const dialogRef = this.dialog.open(ConnectionDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.connected) {
        // Connection changed - reload the page or refresh data
        console.log('Connected to:', result.connection);
        // Optionally reload the page to apply new connection
        // window.location.reload();
      }
    });
  }

  getConnectionDisplayName(): string {
    return this.currentConnection?.name || 'No Connection';
  }

  getConnectionDatabaseName(): string {
    return this.currentConnection?.databaseName || 'N/A';
  }
}
