import { IUser } from "../user";

export class UserListGetActionQuery {
    static readonly type = '[USERS] UserListGetAction';
    constructor(public readonly payload?: { q: string[] }) { }
}

export class UserListReturnGetAction {
    static readonly type = '[USERS] UserListReturnGetAction';
    constructor(public readonly payload?: IUser[]) { }
}
