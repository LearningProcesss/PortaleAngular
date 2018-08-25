import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Store, Select } from '@ngxs/store';

import { Observable } from 'rxjs';
import { AuthState } from './auth/state/auth.state';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    @Select(AuthState.stateLoginOk)
    stateLogin$: Observable<boolean>;

    constructor(private store: Store) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        if (this.store.selectSnapshot<boolean>(state => state.auth.authOk)) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.store.selectSnapshot<string>(state => state.auth.token)}`
                }
            });
        }

        return next.handle(req);
    }
}