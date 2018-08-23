import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoginAction } from '../state/auth.actions';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit() {
  }

  email: string
  password: string

  onLoginClick(loginForm: NgForm): void {
    // if(this.username == 'admin' && this.password == 'admin'){
    //  this.router.navigate(["user"]);
    // }else {
    //   alert("Invalid credentials");
    // }

    this.store.dispatch(new LoginAction({ email: loginForm.value.email, password: loginForm.value.password }));

  }

}
