import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ITicket } from './ticket';
import { Store } from '@ngxs/store';
import { TicketListGetActionQuery } from './state/ticket.actions';

@Injectable()
export class TicketResolveGuard implements Resolve<ITicket[]> {

    constructor(private store: Store) {

    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

        if(route.params["id"] !== undefined){
            let id = route.params["id"];

            console.log("TicketResolve:", id);
    
            // this.store.dispatch(new TicketListGetActionQuery({ q: ["_id=" + id]}));
        }
        

        return true;
    }
}
