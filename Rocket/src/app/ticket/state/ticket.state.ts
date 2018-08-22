import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Ticket, PagedResult } from '../ticket';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TicketListGetAction } from './ticket.actions';

export interface TicketStateModel {
    tickets: Ticket[];
}

@State<TicketStateModel>({
    name: "tickets",
    defaults: {
        tickets: []
    }
})
export class TicketState {

    @Selector()
    static ticketStateTicket(state: TicketStateModel) {
        return state.tickets;
    }

    constructor(private httpclient: HttpClient) {

    }



    @Action(TicketListGetAction)
    getTickets(ctx: StateContext<TicketStateModel>, action: TicketListGetAction) {

        var queryParams = new HttpParams().set("_tecnico", action.payload._tecnico);

        this.httpclient.get<PagedResult>(environment.api + "tickets", { params: queryParams })
            // .pipe(
            //     map((pagedResult) => { return of(pagedResult.collection) })
            // )
            .subscribe((result) => {
                ctx.patchState({
                    tickets: result.collection
                });
                console.log(ctx.getState());
                
            }, (error) => {

            });
    }


}
