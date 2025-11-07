import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatabaseConnection, ConnectionTestResult } from '../../models/database-connection.model';
import { ConnectionConfigService } from '../../services/connection-config.service';

@Component({
  selector: 'app-connection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './connection-dialog.component.html',
  styleUrls: ['./connection-dialog.component.scss']
})
export class ConnectionDialogComponent implements OnInit {
  savedConnections: DatabaseConnection[] = [];
  currentConnection: DatabaseConnection | null = null;
  showAddForm = false;
  connectionForm: FormGroup;
  testingConnection = false;
  testResult: ConnectionTestResult | null = null;

  constructor(
    private dialogRef: MatDialogRef<ConnectionDialogComponent>,
    private connectionService: ConnectionConfigService,
    private fb: FormBuilder
  ) {
    this.connectionForm = this.fb.group({
      name: ['', Validators.required],
      apiUrl: ['http://localhost:5112/api/v1', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      databaseName: ['ADEL', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadConnections();
    this.currentConnection = this.connectionService.getCurrentConnection();
  }

  loadConnections(): void {
    this.savedConnections = this.connectionService.getSavedConnections();

    // Sort by last connected (most recent first), then by name
    this.savedConnections.sort((a, b) => {
      if (a.lastConnected && b.lastConnected) {
        return b.lastConnected.getTime() - a.lastConnected.getTime();
      }
      if (a.lastConnected) return -1;
      if (b.lastConnected) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  selectConnection(connection: DatabaseConnection): void {
    this.connectionService.setCurrentConnection(connection);
    this.currentConnection = connection;
    this.dialogRef.close({ connected: true, connection });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.testResult = null;
    if (!this.showAddForm) {
      this.connectionForm.reset({
        apiUrl: 'http://localhost:5112/api/v1',
        databaseName: 'ADEL'
      });
    }
  }

  testConnection(): void {
    if (this.connectionForm.invalid) {
      return;
    }

    this.testingConnection = true;
    this.testResult = null;

    const tempConnection: DatabaseConnection = {
      id: 'temp',
      ...this.connectionForm.value
    };

    this.connectionService.testConnection(tempConnection).subscribe({
      next: (result) => {
        this.testResult = result;
        this.testingConnection = false;
      },
      error: (error) => {
        console.error('Test connection error:', error);
        this.testResult = {
          success: false,
          message: `Test failed: ${error.message || 'Unknown error'}`
        };
        this.testingConnection = false;
      }
    });
  }

  saveNewConnection(): void {
    if (this.connectionForm.invalid) {
      return;
    }

    const newConnection: DatabaseConnection = {
      id: this.connectionService.generateConnectionId(),
      ...this.connectionForm.value
    };

    this.connectionService.saveConnection(newConnection);
    this.loadConnections();
    this.toggleAddForm();
  }

  deleteConnection(connection: DatabaseConnection, event: Event): void {
    event.stopPropagation();

    if (confirm(`Are you sure you want to delete the connection "${connection.name}"?`)) {
      this.connectionService.deleteConnection(connection.id);
      this.loadConnections();

      if (this.currentConnection?.id === connection.id) {
        this.currentConnection = null;
      }
    }
  }

  isCurrentConnection(connection: DatabaseConnection): boolean {
    return this.currentConnection?.id === connection.id;
  }

  formatLastConnected(date?: Date): string {
    if (!date) return 'Never';

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  }

  close(): void {
    this.dialogRef.close();
  }
}
