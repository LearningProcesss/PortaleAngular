import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { CookieService } from 'ngx-cookie-service';
import { AuthStateModel, AuthTransportData } from '../authdatatrasnport';
import { AuthDataCache } from '../authdatacache';
import { LoginAction, LoginSuccesfull, QueryPortalUsersAction } from './auth.actions';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../../pagedResult';
import { IUser, UserClass } from '../../user/user';

@State<AuthStateModel>({
    name: "auth"
})
export class AuthState {

    private authCache: AuthDataCache;

    constructor(private http: HttpClient, private cookie: CookieService) {
        this.authCache = new AuthDataCache("", "", cookie);
    }

    @Selector()
    static stateLoginOk(state: AuthStateModel) {
        return state.authOk;
    }

    @Selector()
    static stateToken(state: AuthStateModel) {
        return state.token;
    }

    @Selector()
    static authStateMessaggio(state: AuthStateModel) {
        return state.messaggio;
    }

    @Selector()
    static authStateNome(state: AuthStateModel) {
        return state.nome;
    }

    @Selector()
    static authStateId(state: AuthStateModel) {
        return state.uid;
    }

    @Selector()
    static getPortalUser(state: AuthStateModel) {
        return state.users;
    }

    @Action(LoginAction)
    doLogin(ctx: StateContext<AuthStateModel>, action: LoginAction) {

        console.log("state LoginAction", action);

        if (action.payload.email === "" && action.payload.password === "") {

            if (this.authCache.isValidToken()) {

                this.setTimer(this.authCache.expireRimanente);

                ctx.patchState(
                    {
                        uid: this.authCache.userId,
                        authOk: true,
                        expire: this.authCache.expireRimanente,
                        messaggio: "",
                        token: this.authCache.tokenU,
                        nome: this.authCache.fullname
                    }
                );

                ctx.dispatch(new LoginSuccesfull({ nome: this.authCache.fullname, id: this.authCache.userId }));
            }
        } else {
            this.http.post(environment.api + "auth/signin", { email: action.payload.email, password: action.payload.password })
                .subscribe((response: AuthTransportData) => {

                    ctx.patchState(
                        {
                            uid: response.uId,
                            authOk: response.authOk,
                            expire: response.expire,
                            messaggio: response.messaggio,
                            token: response.token,
                            nome: response.nome
                        }
                    );

                    // console.log(ctx.getState());

                    this.authCache.saveLocal(response.token, response.expire, response.uId, response.nome);

                    ctx.dispatch(new LoginSuccesfull({ nome: response.nome, id: response.uId }));
                }, error => {

                });
        }
    }

    @Action(LoginSuccesfull)
    onLoginSuccess(ctx: StateContext<AuthStateModel>, action: LoginSuccesfull) {
        ctx.dispatch(new Navigate(['/tickets']));
    }

    @Action(QueryPortalUsersAction)
    queryPortalUsers(ctx: StateContext<AuthStateModel>, action: QueryPortalUsersAction) {

        let q = action.payload.q.join(",");

        var queryParams = new HttpParams().set("q", q);

        this.http.get<PagedResult<UserClass>>(environment.api + "/users", { params: queryParams }).subscribe(result => {
            ctx.patchState({
                users: result.collection
            });
        });
    }


    private setTimer(durata: number) {

        // this.timer = setTimeout(() => {
        //   this.logout();
        // }, durata);
    }

}
