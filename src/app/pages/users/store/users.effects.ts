import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UsersState } from './users.state';
import {
  getUserDetails,
  getUserDetailsSuccess,
  getUsers,
  getUsersSuccess,
} from './users.actions';
import { EMPTY, catchError, map, switchMap, withLatestFrom } from 'rxjs';
import { UsersApiService } from 'src/app/shared/services/users-api.service';
import { selectParams } from 'src/app/shared/store/router/router.selectors';

@Injectable()
export class UsersEffects {
  getUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUsers),
      switchMap(() =>
        this.usersApiService.getUsers().pipe(
          map(users => getUsersSuccess({ payload: users })),
          catchError(() => EMPTY),
        ),
      ),
    ),
  );

  getUserDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserDetails),
      concatLatestFrom(() => [this.store.select(selectParams)]),
      switchMap(([_, params]) =>
        this.usersApiService.getUserByUsername(params['username']).pipe(
          map(userDetails => getUserDetailsSuccess({ payload: userDetails })),
          catchError(() => EMPTY),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private store: Store<UsersState>,
    private usersApiService: UsersApiService,
  ) {}
}
