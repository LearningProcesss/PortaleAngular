
export interface ITicket {
    creatoIl?: string;
    prio?: string;
    stato?: string;
    task?: string;
    ticketProcad?: number;
    _id?: string;
    titolo?: string;
    _cliente?: ICliente;
    _tecnico?: string;
    eventi?: IEvento[];
    
    countEventi?: number;
}

export interface ICliente {
    _id?: string;
    nome?: string;
    cognome?: string;
}

export interface IEvento {
    creatoIl?: string;
    _id?: string;
    testo?: string;
    creatoDa?: string;
    file?: string;
    fileFisico?: File;
}