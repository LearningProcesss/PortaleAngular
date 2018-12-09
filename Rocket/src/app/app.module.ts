import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';

import { AppRoutingModule } from './app.routing.module';

import { AppComponent } from './app.component';
import { TokenInterceptor } from './app.interceptor';

import { NgxsModule } from '@ngxs/store';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { TicketState } from './ticket/state/ticket.state';
import { AuthState } from './auth/state/auth.state';

import { CookieService } from 'ngx-cookie-service';
import { HeadermaterialComponent } from './headermaterial/headermaterial.component';
import { InputComponent } from './schema/components/input/input.component';
import { UserState } from './user/state/user.state';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,//importantissimo!
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxsModule.forRoot([TicketState, AuthState, UserState]),
    NgxsRouterPluginModule.forRoot(),
    MaterialModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    HeadermaterialComponent,
    InputComponent
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
