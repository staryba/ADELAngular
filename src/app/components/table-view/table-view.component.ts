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
import { ProfileEntityElementIds } from '../../constants/element.constants';
import { EntityType } from '../../models/tree-node.model';

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
    console.log('TableViewComponent initialized');

    // Watch for selected node changes
    this.store.select(TreeSelectors.selectSelectedNode).pipe(
      takeUntil(this.destroy$),
      filter(node => node !== null && node !== undefined)
    ).subscribe(node => {
      console.log('Selected node changed:', node);
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

    console.log('Loading entity data for ID:', entityId);

    this.entitiesApi.getEntityById(entityId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (entity: EntityDetail) => {
        console.log('Entity data received:', entity);
        this.processEntityData(entity);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading entity:', err);
        this.error = err.message || 'Failed to load entity data';
        this.loading = false;
        this.dataSource = [];
        this.displayedColumns = [];
      }
    });
  }

  private processEntityData(entity: EntityDetail): void {
    // Check if entity has any values
    if (!entity.values || Object.keys(entity.values).length === 0) {
      console.log('Entity has no values');
      this.displayedColumns = ['_id', '_actions'];
      this.columnNames = {};
      this.dataSource = [{ _id: entity.id }];
      return;
    }

    // For Entity type (EntityType=3), fetch Profile children to get field names
    if (entity.entityType === EntityType.Entity && entity.profileId) {
      this.fetchProfileFieldNames(entity);
    } else {
      // For other entity types, use generic column names
      this.processEntityDataWithoutProfile(entity);
    }
  }

  private processEntityDataWithoutProfile(entity: EntityDetail): void {
    const row: TableRow = { _id: entity.id };
    this.columnNames = {};
    const columns: string[] = ['_id'];

    // Process each element value
    Object.entries(entity.values).forEach(([elementId, elementValue]: [string, ElementValue]) => {
      const columnKey = `element_${elementId}`;
      columns.push(columnKey);
      row[columnKey] = elementValue.value;
      this.columnNames[columnKey] = `Element ${elementId} (${elementValue.dataType})`;
    });

    columns.push('_actions');
    this.displayedColumns = columns;
    this.dataSource = [row];
    console.log('Processed entity data without profile:', { columns, row, dataSource: this.dataSource, columnNames: this.columnNames });
  }

  private fetchProfileFieldNames(entity: EntityDetail): void {
    // Fetch the Profile entity to get its ProfileEntity children
    this.entitiesApi.getEntityById(entity.profileId!).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (profile: EntityDetail) => {
        console.log('Profile entity retrieved:', profile);

        // Check if profile has children (ProfileEntity elements)
        if (!profile.children || profile.children.length === 0) {
          console.warn('Profile has no children (ProfileEntity elements)');
          this.processEntityDataWithoutProfile(entity);
          return;
        }

        // Build element ID to field name mapping from ProfileEntity children
        const elementIdToFieldName: { [key: number]: string } = {};

        // ProfileEntity children are ordered by ID, and their sequence determines element numbering
        profile.children
          .filter((child: EntityDetail) => child.entityType === EntityType.ProfileEntity)
          .sort((a: EntityDetail, b: EntityDetail) => a.id - b.id)
          .forEach((profileEntity: EntityDetail, index: number) => {
            // Get the "Name" value from the ProfileEntity (element ID = 1)
            const nameElementId = ProfileEntityElementIds.Name.toString();
            if (profileEntity.values && profileEntity.values[nameElementId]) {
              const fieldName = profileEntity.values[nameElementId].value as string;
              elementIdToFieldName[index + 1] = fieldName; // Element IDs are 1-based
            }
          });

        console.log('Element ID to field name mapping:', elementIdToFieldName);

        // Now build the table with proper field names
        const row: TableRow = { _id: entity.id };
        this.columnNames = {};
        const columns: string[] = ['_id'];

        Object.entries(entity.values).forEach(([elementId, elementValue]: [string, ElementValue]) => {
          const columnKey = `element_${elementId}`;
          columns.push(columnKey);
          row[columnKey] = elementValue.value;

          // Use the field name from the ProfileEntity, or fall back to generic name
          const fieldName = elementIdToFieldName[parseInt(elementId)];
          this.columnNames[columnKey] = fieldName || `Element ${elementId} (${elementValue.dataType})`;
        });

        columns.push('_actions');
        this.displayedColumns = columns;
        this.dataSource = [row];
        console.log('Processed entity data with profile field names:', {
          columns,
          row,
          dataSource: this.dataSource,
          columnNames: this.columnNames
        });
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        // Fallback to generic column names
        this.processEntityDataWithoutProfile(entity);
      }
    });
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
