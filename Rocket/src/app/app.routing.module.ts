import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AppCanActivateGuard } from './app.guard';

const routes: Routes = [
    { path: '', component: AppComponent, canActivate: [AppCanActivateGuard] },
    { path: 'tickets', loadChildren: "./ticket/ticket.module#TicketModule", canActivate: [AppCanActivateGuard] },
    { path: 'auth', loadChildren: "./auth/auth.module#AuthModule" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
