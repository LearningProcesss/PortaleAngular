import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { MaterialModule } from './material/material.module';

import { AppRoutingModule } from './app.routing.module';

import { HeaderComponent } from './header/header.component';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './app.interceptor';

import { NgxsModule } from '@ngxs/store';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { TicketState } from './ticket/state/ticket.state';
import { AuthState } from './auth/state/auth.state';

import { CookieService } from 'ngx-cookie-service';



@NgModule({
  imports: [
    CommonModule,
    BrowserModule,//importantissimo!
    AppRoutingModule,
    NgxsModule.forRoot([TicketState, AuthState]),
    NgxsRouterPluginModule.forRoot(),
    MaterialModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent
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
