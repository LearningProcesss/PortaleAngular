import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable()
export class SchemaService {

    private api = environment.api + "schema/";

    constructor(private http: HttpClient) {

    }

    /**
     * name
     */
    public getSchema(type: string) {
        return this.getSchemaData(this.api + type);
    }

    public getSchemaPath(type: string, path: string) {
        return this.getSchemaData(this.api + type + "/" + path);
    }

    public getSchemaPathProperty<T>(type: string, path: string, property: string) {
        return this.getSchemaData<T>(this.api + type + "/" + path + "/" + property);
    }

    /**
     * name
     */
    private getSchemaData<T>(uri: string) {
        return this.http.get<T>(uri);
    }


}