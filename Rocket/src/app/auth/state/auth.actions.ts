import { AuthTransportData } from "../authdatatrasnport";


export class LoginAction {

    static readonly type = '[AUTH] Login';

    constructor(public readonly payload?: { email: string, password: string }) { }
}

export class LoginSuccesfull {
            
    static readonly type = '[AUTH] LoginSuccesfull';

    constructor(public readonly payload?: { nome: string, id: string }) { }
}

export class LoginError {
    
    static readonly type = '[AUTH] LoginError]';
    
    constructor(public readonly payload?: { messaggio: string }) { }
}

export class SignupAction {

    static readonly type = '[AUTH] Signup';

    constructor(public readonly payload?: AuthTransportData) { }
}


