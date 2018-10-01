import { ITicket, IEvento } from "../ticket";

export class TicketListGetAction {

    static readonly type = '[TICKETS] TicketListGetAction';

    constructor(public readonly payload?: { _tecnico: String }) { }
}

export class TicketListGetActionQuery {
    static readonly type = '[TICKETS] TicketListGetActionQuery';
    constructor(public readonly payload?: { q: string[] }) { }
}


export class TicketListReturnGetAction {
    static readonly type = '[TICKETS] TicketListReturnGetAction';
    constructor(public readonly payload?: ITicket[]) { }
}

export class TicketSaveAction {
    static readonly type = '[TICKETS] TicketSaveAction';
    constructor(public readonly payload?: { ticket: ITicket, evento?: IEvento, file?: File}) { }
}

export class TicketEventSaveAction {
    static readonly type = '[TICKETS] TicketEventSaveAction';
    constructor(public readonly payload?: { ticketId: string, evento?: IEvento, file?: File}) {}
}

export class TicketSaveReturnPostAction {   
    static readonly type = '[TICKETS] TicketSaveReturnPostAction';    
    constructor(public readonly payload?: any) {}
}


