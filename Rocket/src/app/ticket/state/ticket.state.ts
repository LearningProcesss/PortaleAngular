import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Ticket, PagedResult } from '../ticket';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TicketListGetAction, TicketListReturnGetAction, TicketListGetActionQuery } from './ticket.actions';

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

    private stateApiUrl = environment.api + "tickets";

    @Selector()
    static getTickets(state: TicketStateModel) {
        return state.tickets;
    }

    constructor(private httpclient: HttpClient) {

    }
    
    @Action(TicketListGetActionQuery)
    getTicketsQuery(ctx: StateContext<TicketStateModel>, action: TicketListGetActionQuery) {
        let q = action.payload.q.join(",");

        var queryParams = new HttpParams().set("q", q);

        this.httpclient.get<PagedResult>(this.stateApiUrl, { params: queryParams })
            .subscribe((result) => {
                ctx.patchState({
                    tickets: result.collection
                });
            }, (error) => {

            });
    }



    @Action(TicketListGetAction)
    getTickets(ctx: StateContext<TicketStateModel>, action: TicketListGetAction) {

        // let search = new URLSearchParams();

        // search.set("q", "_tecnico=" + action.payload._tecnico);

        var queryParams = new HttpParams().set("q", "_tecnico=" + action.payload._tecnico.toString());

        this.httpclient.get<PagedResult>(this.stateApiUrl, { params: queryParams })
            // .pipe(
            //     map((pagedResult) => { return of(pagedResult.collection) })
            // )
            .subscribe((result) => {
                ctx.patchState({
                    tickets: result.collection
                });
                // console.log(ctx.getState());
                //ctx.dispatch(new TicketListReturnGetAction())
            }, (error) => {

            });
    }


}
