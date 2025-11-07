import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { EntitiesApiService } from '../../services/entities-api.service';
import * as TreeActions from './tree.actions';

@Injectable()
export class TreeEffects {
  loadRootNodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TreeActions.loadRootNodes),
      mergeMap(() =>
        this.entitiesApi.getTreeNodes().pipe(
          map(nodes => TreeActions.loadRootNodesSuccess({ nodes })),
          catchError(error =>
            of(TreeActions.loadRootNodesFailure({
              error: error.message || 'Failed to load root nodes'
            }))
          )
        )
      )
    )
  );

  loadChildren$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TreeActions.loadChildren),
      mergeMap(({ nodeId }) =>
        this.entitiesApi.getTreeNodes(nodeId).pipe(
          map(children => TreeActions.loadChildrenSuccess({
            parentId: nodeId,
            children
          })),
          catchError(error =>
            of(TreeActions.loadChildrenFailure({
              nodeId,
              error: error.message || 'Failed to load children'
            }))
          )
        )
      )
    )
  );

  resetTree$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TreeActions.resetTree),
      map(() => TreeActions.loadRootNodes())
    )
  );

  constructor(
    private actions$: Actions,
    private entitiesApi: EntitiesApiService
  ) {}
}
