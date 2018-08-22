import { CookieService } from "ngx-cookie-service";

export class AuthDataCache {
    
    private _expireDate: Date;
    private _expireRimanente: number;
    private _valid: boolean;
    private _userId: string;
    private _fullname : string;
    
    constructor(private token: string, private expire: string, private cookie: CookieService) {

        this.readLocal();

        if (!this._expireDate) {

            var d = new Date();

            this._expireDate = new Date(d.getTime() + expire);
        }
    }

    private readLocal() {

        this.token = this.cookie.get("token");

        this.expire = this.cookie.get("expire");

        this._userId = this.cookie.get("uid");

        this._fullname = this.cookie.get("fn");

        if (!this.token && !this.expire) {
            return;
        } else {
            this._expireDate = new Date(this.expire);
        }
    }

    public saveLocal(token: string, expire: number, userId: string, fullname: string) {

        const ora = new Date();

        const cnstr = new Date(ora.getTime() + expire);

        this.cookie.set("token", token);

        this.cookie.set("expire", cnstr.toISOString());

        this.cookie.set("uid", userId);

        this.cookie.set("fn", fullname);

        this.readLocal();
    }

    public deleteLocal() {
        this.cookie.delete("token");
        this.cookie.delete("expire");
        this.cookie.delete("uid");
        this.cookie.delete("fn");
    }

    public isValidToken(): boolean {

        this.readLocal();

        if (!this.token || !this.expire) {
            return false;
        }

        var ora = new Date();

        var dateExpire = new Date(this.expire);

        var rimanente = dateExpire.getTime() - ora.getTime();

        if (rimanente > 0) {
            this._expireRimanente = rimanente;
            return true;
        }
        else {
            this.deleteLocal();
            return false;
        }
    }

    public get tokenU(): string {
        return this.token;
    }

    public get userId(): string {
        return this._userId;
    }

    public get expireRimanente(): number {
        return this._expireRimanente;
    }

    public get valid(): boolean {
        return this._valid;
    }

    public get expireDate(): Date {
        return this._expireDate;
    }

    public get fullname() : string {
        return this._fullname;
    }
}
