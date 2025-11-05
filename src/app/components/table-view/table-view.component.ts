import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject, switchMap, takeUntil, filter } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { EntitiesApiService } from '../../services/entities-api.service';
import * as TreeSelectors from '../../store/tree/tree.selectors';
import { EntityDetail, ElementValue } from '../../models/entity.model';

interface TableRow {
  [key: string]: any;
}

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.scss'
})
export class TableViewComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [];
  dataSource: TableRow[] = [];
  columnNames: { [key: string]: string } = {}; // Map element IDs to readable names
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private entitiesApi: EntitiesApiService
  ) {}

  ngOnInit(): void {
    // Watch for selected node changes
    this.store.select(TreeSelectors.selectSelectedNode).pipe(
      takeUntil(this.destroy$),
      filter(node => node !== null && node !== undefined)
    ).subscribe(node => {
      if (node) {
        this.loadEntityData(node.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEntityData(entityId: number): void {
    this.loading = true;
    this.error = null;

    this.entitiesApi.getEntityById(entityId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (entity: EntityDetail) => {
        this.processEntityData(entity);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load entity data';
        this.loading = false;
        this.dataSource = [];
        this.displayedColumns = [];
      }
    });
  }

  private processEntityData(entity: EntityDetail): void {
    // Convert entity values to table row
    const row: TableRow = { _id: entity.id };
    this.columnNames = {};
    const columns: string[] = ['_id'];

    // Process each element value
    Object.entries(entity.values).forEach(([elementId, elementValue]: [string, ElementValue]) => {
      const columnKey = `element_${elementId}`;
      columns.push(columnKey);
      row[columnKey] = elementValue.value;

      // For now, use element ID as the name (we'll need profile metadata to get actual names)
      this.columnNames[columnKey] = `Element ${elementId}`;
    });

    columns.push('_actions');
    this.displayedColumns = columns;
    this.dataSource = [row];
  }

  onEdit(row: TableRow): void {
    console.log('Edit row:', row);
    // TODO: Implement edit functionality
  }

  onDelete(row: TableRow): void {
    console.log('Delete row:', row);
    // TODO: Implement delete functionality
  }

  onRestore(row: TableRow): void {
    console.log('Restore row:', row);
    // TODO: Implement restore functionality
  }

  sortData(sort: Sort): void {
    // TODO: Implement sorting
    console.log('Sort:', sort);
  }
}
