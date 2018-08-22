export class TicketListGetAction {

    static readonly type = '[TICKETS] TicketListGetAction';

    constructor(public readonly payload?: { _tecnico: string }) { }
}

