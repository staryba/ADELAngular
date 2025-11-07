import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { DatabaseConnection, ConnectionTestResult } from '../models/database-connection.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionConfigService {
  private readonly STORAGE_KEY = 'adel-database-connections';
  private readonly CURRENT_CONNECTION_KEY = 'adel-current-connection';

  private currentConnectionSubject = new BehaviorSubject<DatabaseConnection | null>(null);
  public currentConnection$ = this.currentConnectionSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentConnection();
  }

  /**
   * Get all saved database connections from localStorage
   */
  getSavedConnections(): DatabaseConnection[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return this.getDefaultConnections();
    }

    try {
      const connections = JSON.parse(stored) as DatabaseConnection[];
      // Convert lastConnected strings back to Date objects
      return connections.map(conn => ({
        ...conn,
        lastConnected: conn.lastConnected ? new Date(conn.lastConnected) : undefined
      }));
    } catch (error) {
      console.error('Error parsing saved connections:', error);
      return this.getDefaultConnections();
    }
  }

  /**
   * Get default connections (local dev and test databases)
   */
  private getDefaultConnections(): DatabaseConnection[] {
    return [
      {
        id: 'local-adel',
        name: 'Local - ADEL',
        apiUrl: 'http://localhost:5112/api/v1',
        databaseName: 'ADEL',
        description: 'Local development database',
        isDefault: true
      },
      {
        id: 'local-adel-test',
        name: 'Local - ADEL_Test',
        apiUrl: 'http://localhost:5112/api/v1',
        databaseName: 'ADEL_Test',
        description: 'Local test database'
      }
    ];
  }

  /**
   * Save a new or updated database connection
   */
  saveConnection(connection: DatabaseConnection): void {
    const connections = this.getSavedConnections();
    const existingIndex = connections.findIndex(c => c.id === connection.id);

    if (existingIndex >= 0) {
      connections[existingIndex] = connection;
    } else {
      connections.push(connection);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(connections));
  }

  /**
   * Delete a saved connection
   */
  deleteConnection(connectionId: string): void {
    const connections = this.getSavedConnections().filter(c => c.id !== connectionId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(connections));

    // If we deleted the current connection, clear it
    const current = this.currentConnectionSubject.value;
    if (current?.id === connectionId) {
      this.setCurrentConnection(null);
    }
  }

  /**
   * Get the current active connection
   */
  getCurrentConnection(): DatabaseConnection | null {
    return this.currentConnectionSubject.value;
  }

  /**
   * Set the current active connection
   */
  setCurrentConnection(connection: DatabaseConnection | null): void {
    if (connection) {
      connection.lastConnected = new Date();
      this.saveConnection(connection);
      localStorage.setItem(this.CURRENT_CONNECTION_KEY, connection.id);
    } else {
      localStorage.removeItem(this.CURRENT_CONNECTION_KEY);
    }

    this.currentConnectionSubject.next(connection);
  }

  /**
   * Load the current connection from localStorage on service init
   */
  private loadCurrentConnection(): void {
    const currentId = localStorage.getItem(this.CURRENT_CONNECTION_KEY);
    if (currentId) {
      const connections = this.getSavedConnections();
      const current = connections.find(c => c.id === currentId);
      if (current) {
        this.currentConnectionSubject.next(current);
        return;
      }
    }

    // If no current connection, use the default from environment
    const defaultConnection: DatabaseConnection = {
      id: 'environment-default',
      name: 'Default (Environment)',
      apiUrl: environment.apiUrl,
      databaseName: 'ADEL',
      description: 'Default connection from environment configuration',
      isDefault: true
    };

    this.currentConnectionSubject.next(defaultConnection);
  }

  /**
   * Test a database connection by calling the health endpoint
   */
  testConnection(connection: DatabaseConnection): Observable<ConnectionTestResult> {
    const healthUrl = `${connection.apiUrl.replace('/api/v1', '')}/health`;

    return this.http.get(healthUrl, {
      observe: 'response',
      responseType: 'text'
    }).pipe(
      map(response => ({
        success: response.status === 200,
        message: 'Connection successful',
        serverInfo: {
          environment: response.headers.get('X-Environment') || 'Unknown'
        }
      } as ConnectionTestResult)),
      catchError(error => {
        console.error('Connection test failed:', error);
        return of({
          success: false,
          message: `Connection failed: ${error.message || 'Unknown error'}`
        } as ConnectionTestResult);
      })
    );
  }

  /**
   * Get the API base URL for the current connection
   */
  getApiUrl(): string {
    const current = this.getCurrentConnection();
    return current?.apiUrl || environment.apiUrl;
  }

  /**
   * Get the database name for the current connection
   */
  getDatabaseName(): string {
    const current = this.getCurrentConnection();
    return current?.databaseName || 'ADEL';
  }

  /**
   * Generate a unique ID for a new connection
   */
  generateConnectionId(): string {
    return `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
