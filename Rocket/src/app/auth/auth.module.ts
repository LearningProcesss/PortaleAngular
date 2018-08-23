import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth.routing.module';
import { MaterialModule } from '../material/material.module';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AuthRoutingModule,
        MaterialModule
    ],
    exports: [],
    declarations: [LoginComponent, SignupComponent],
    providers: [],
})
export class AuthModule { }
