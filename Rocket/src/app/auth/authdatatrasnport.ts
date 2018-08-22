export interface AuthTransportData {
    token: string;
    expire: number;
    uId: string;
    messaggio: string;
    authOk:    boolean;
    nome: string;
}

export interface AuthStateModel  {
    token: string;
    expire: number;
    uid: string;
    messaggio: string;
    authOk:    boolean;
    nome: string;
}
