import { State, StateContext, Action, Selector } from '@ngxs/store';
import { IUser, UserClass } from '../user';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserListGetActionQuery } from './user.actions';
import { PagedResult } from '../../pagedResult';


export interface UsersStateModel {
    users: IUser[];
}

@State<UsersStateModel>({
    name: "users",
    defaults: {
        users: []
    }
})
export class UserState {
    private stateApiUrl = environment.api + "users";

    @Selector()
    static getUsers(state: UsersStateModel) {
        return state.users;
    }

    constructor(private httpclient: HttpClient) {

    }

    @Action(UserListGetActionQuery)
    getTicketsQuery(ctx: StateContext<UsersStateModel>, action: UserListGetActionQuery) {
        let q = action.payload.q.join(",");

        var queryParams = new HttpParams().set("q", q);

        this.httpclient.get<PagedResult<IUser>>(this.stateApiUrl, { params: queryParams })
            .subscribe(result => {
                ctx.patchState({
                    users: result.collection
                });
            }, (error) => {

            });
    }
}
