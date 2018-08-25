import { PagedResult, Ticket } from "../ticket";

export class TicketListGetAction {

    static readonly type = '[TICKETS] TicketListGetAction';

    constructor(public readonly payload?: { _tecnico: String }) { }
}

export class TicketListGetActionQuery {
    static readonly type = '[TICKETS] TicketListGetActionQuery]';
    constructor(public readonly payload?: { q: string[] }) { }
}


export class TicketListReturnGetAction {
    static readonly type = '[TICKETS] TicketListReturnGetAction]';
    constructor(public readonly payload?: Ticket[]) { }
}
