
export interface ITicket {
    creatoIl?: string;
    prio?: string;
    stato?: string;
    task?: string;
    ticketProcad?: number;
    _id?: string;
    titolo?: string;
    _cliente?: string;
    _tecnico?: string;
    eventi?: IEvento[];
    __v?: number;
}

export interface IEvento {
    creatoIl?: string;
    _id?: string;
    testo?: string;
    creatoDa?: string;
    file?: string;
    fileFisico?: File;
}