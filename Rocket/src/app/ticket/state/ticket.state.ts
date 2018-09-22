import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ITicket } from '../ticket';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TicketListGetAction, TicketListReturnGetAction, TicketListGetActionQuery, TicketSaveAction } from './ticket.actions';
import { PagedResult } from '../../pagedResult';

export interface TicketStateModel {
    tickets: ITicket[];
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

        this.httpclient.get<PagedResult<ITicket>>(this.stateApiUrl, { params: queryParams })
            .subscribe(result => {
                ctx.patchState({
                    tickets: result.collection
                });
            }, (error) => {

            });
    }

    @Action(TicketSaveAction)
    saveTicket(ctx: StateContext<TicketStateModel>, action: TicketSaveAction) {

        let data = new FormData();

        data.append("titolo", action.payload.ticket.titolo);
        data.append("_cliente", action.payload.ticket._cliente);
        data.append("_tecnico", action.payload.ticket._tecnico);
        data.append("task", action.payload.ticket.task);
        data.append("stato", action.payload.ticket.stato);
        data.append("prio", action.payload.ticket.prio);

        if(action.payload.file != null) {
            data.append("uploadEventFile", action.payload.file);
        }
        
        this.httpclient.post(this.stateApiUrl, data).subscribe(resp => {
            console.log("saveTicket", resp);
        });

    }


    // @Action(TicketListGetAction)
    // getTickets(ctx: StateContext<TicketStateModel>, action: TicketListGetAction) {

    //     var queryParams = new HttpParams().set("q", "_tecnico=" + action.payload._tecnico.toString());

    //     this.httpclient.get<PagedResult<Ticket>>(this.stateApiUrl, { params: queryParams })
    //         .subscribe((result) => {
    //             ctx.patchState({
    //                 tickets: result.collection
    //             });
    //         }, (error) => {

    //         });
    // }


}
