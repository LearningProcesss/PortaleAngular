import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, Select } from '@ngxs/store';
import { AuthState } from './auth/state/auth.state';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class AppCanActivateGuard implements CanActivate {
    @Select(AuthState.stateLoginOk) stateLogin$: Observable<boolean>;

    constructor(private store: Store, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const token = this.store.selectSnapshot(AuthState.stateToken);

        if (token == null) {
            this.router.navigate(["/auth/login"]);
        }

        return token !== undefined;
    }
}

