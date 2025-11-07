export interface DatabaseConnection {
  id: string;
  name: string;
  apiUrl: string;
  databaseName: string;
  description?: string;
  lastConnected?: Date;
  isDefault?: boolean;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  serverInfo?: {
    version?: string;
    environment?: string;
  };
}
