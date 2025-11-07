import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TreeNodeDto, EntityType } from '../models/tree-node.model';
import { EntityDetail, ProfileDto } from '../models/entity.model';
import { ConnectionConfigService } from './connection-config.service';

@Injectable({
  providedIn: 'root'
})
export class EntitiesApiService {
  constructor(
    private http: HttpClient,
    private connectionService: ConnectionConfigService
  ) {}

  private get baseUrl(): string {
    return `${this.connectionService.getApiUrl()}/entities`;
  }

  private get profilesUrl(): string {
    return `${this.connectionService.getApiUrl()}/profiles`;
  }

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

  /**
   * Get profile by ID with element definitions
   * @param profileId The profile entity ID
   * @param includeDeleted Include soft-deleted profiles (default: true for internal use)
   */
  getProfileById(profileId: number, includeDeleted: boolean = true): Observable<ProfileDto> {
    const params = new HttpParams().set('includeDeleted', includeDeleted.toString());
    return this.http.get<ProfileDto>(`${this.profilesUrl}/${profileId}`, { params });
  }
}
