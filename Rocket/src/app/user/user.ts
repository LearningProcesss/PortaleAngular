
export interface IUser {
    _id: string;
    azienda: Azienda;
    registratoIl: string;
    nome: string;
    cognome: string;
    email: string;
    tipo: number;
    __v: number;
    ultimoLogin?: string;
}

export class UserClass implements IUser {
    _id: string;
    azienda: Azienda;
    registratoIl: string;
    nome: string;
    cognome: string;
    email: string;
    tipo: number;
    __v: number;
    ultimoLogin?: string;

    get Id() {

        return this._id;
    }
}

export interface Azienda {
    _id: string;
    ragioneSociale: string;
    indirizzo: string;
}
