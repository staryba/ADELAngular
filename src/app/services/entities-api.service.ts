import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TreeNodeDto, EntityType } from '../models/tree-node.model';
import { EntityDetail } from '../models/entity.model';

@Injectable({
  providedIn: 'root'
})
export class EntitiesApiService {
  private readonly baseUrl = `${environment.apiUrl}/entities`;

  constructor(private http: HttpClient) {}

  /**
   * Get tree nodes for hierarchical navigation with lazy loading
   * @param parentId Optional parent ID to load children of specific node
   * @param entityType Optional entity type filter
   * @param includeDeleted Include deleted entities
   */
  getTreeNodes(
    parentId?: number,
    entityType?: EntityType,
    includeDeleted: boolean = false
  ): Observable<TreeNodeDto[]> {
    let params = new HttpParams();

    if (parentId !== undefined) {
      params = params.set('parentId', parentId.toString());
    }

    if (entityType !== undefined) {
      params = params.set('entityType', entityType.toString());
    }

    if (includeDeleted) {
      params = params.set('includeDeleted', 'true');
    }

    return this.http.get<TreeNodeDto[]>(`${this.baseUrl}/tree-nodes`, { params });
  }

  /**
   * Get entity details by ID
   * @param entityId The entity ID
   */
  getEntityById(entityId: number): Observable<EntityDetail> {
    return this.http.get<EntityDetail>(`${this.baseUrl}/${entityId}`);
  }

  /**
   * Get children entities in table view format
   * @param parentId The parent entity ID
   */
  getChildrenTableView(parentId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${parentId}/children/table-view`);
  }

  /**
   * Get entities by profile in table view format
   * @param profileId The profile ID
   */
  getByProfileTableView(profileId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/by-profile/${profileId}/table-view`);
  }
}
