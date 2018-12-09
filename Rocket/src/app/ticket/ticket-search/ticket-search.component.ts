import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { UserState } from '../../user/state/user.state';
import { Observable } from 'rxjs';
import { IUser } from '../../user/user';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import { startWith, switchMap, map } from 'rxjs/operators';
import { UserListGetActionQuery } from '../../user/state/user.actions';


@Component({
  selector: 'app-ticket-search',
  templateUrl: './ticket-search.component.html',
  styleUrls: ['./ticket-search.component.css']
})
export class TicketSearchComponent implements OnInit {

  @Select(UserState.getUsers)
  $users: Observable<IUser[]>;

  reactiveFilterForm: FormGroup;

  private qValues: string[] = [];

  private selectedIdCliente = "";
  private selectedIdTecnico = "";

  $filteredPortalUserOptions: Observable<IUser[]>;
  $filteredTecnicoOptions: Observable<IUser[]>;

  constructor(private store: Store) { }

  ngOnInit() {

    this.store.dispatch(new UserListGetActionQuery({ q: [] }));

    this.reactiveFilterForm = new FormGroup(
      {
        reactiveFilterNumeroTicket: new FormControl(),
        reactiveFilterDataAperturaRangeStart: new FormControl(),
        reactiveFilterDataAperturaRangeEnd: new FormControl({ value: new Date(), disabled: false }),
        reactiveFilterFullText: new FormControl(),
        reactiveFilterCliente: new FormControl(),
        reactiveFilterTecnico: new FormControl()
      }
    );

    this.$filteredPortalUserOptions = this.reactiveFilterForm.get("reactiveFilterCliente").valueChanges.pipe(
      startWith(''),
      switchMap(text => {
        return this.$users.pipe(map(u => u.filter(usr => usr.nome.toLowerCase().includes(text.toLowerCase()) || usr.cognome.toLowerCase().includes(text.toLowerCase()))))
      }));

    this.$filteredTecnicoOptions = this.reactiveFilterForm.get("reactiveFilterTecnico").valueChanges.pipe(
      startWith(''),
      switchMap(text => {
        return this.$users.pipe(map(u => u.filter(usr => usr.tipo === 1 && (usr.nome.toLowerCase().includes(text.toLowerCase()) || usr.cognome.toLowerCase().includes(text.toLowerCase())))))
      }));
  }

  reactiveFilterFormSubmit() {
    console.log(this.reactiveFilterForm.value);

  }


  selezioneCliente(event: MatSelectChange, obj: IUser) {
    this.selectedIdCliente = obj._id;
  }
  selezioneTecnico(event: MatSelectChange, obj: IUser) {
    this.selectedIdTecnico = obj._id;
  }
}
