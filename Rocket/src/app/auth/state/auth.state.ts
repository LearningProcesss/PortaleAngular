import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { CookieService } from 'ngx-cookie-service';
import { AuthStateModel, AuthTransportData } from '../authdatatrasnport';
import { AuthDataCache } from '../authdatacache';
import { LoginAction, LoginSuccesfull } from './auth.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

    @Action(LoginAction)
    doLogin(ctx: StateContext<AuthStateModel>, action: LoginAction) {

        console.log("state LoginAction");

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
            this.http.post(environment.api + "users/signin", { email: action.payload.email, password: action.payload.password })
                .subscribe((response: AuthTransportData) => {

                    // var state = ctx.getState();

                    // console.log("prima", state);

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

                    this.authCache.saveLocal(response.token, response.expire, response.uId, response.nome);

                    ctx.dispatch(new LoginSuccesfull({ nome: response.nome, id: response.uId }));
                }, error => {

                });
        }
    }

    @Action(LoginSuccesfull)
    onLoginSuccess(ctx: StateContext<AuthStateModel>, action: LoginSuccesfull) {
        ctx.dispatch(new Navigate(['/commandcenter']));
    }

    private setTimer(durata: number) {

        // this.timer = setTimeout(() => {
        //   this.logout();
        // }, durata);
    }

}
