import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoginAction } from './auth/state/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {

  }

  ngOnInit() {
    this.store.dispatch(new LoginAction({ email: "", password: "" }));
  }
  title = 'app';
}


