import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatAutocompleteSelectedEvent, MatSelectChange } from '@angular/material';
import { TableListDataSource } from './table-list-datasource';

import { Store, Select } from '@ngxs/store';
import { TicketListGetActionQuery } from '../state/ticket.actions';
import { TicketState } from '../state/ticket.state';
import { UserState } from '../../user/state/user.state';
import { AuthState } from '../../auth/state/auth.state';

import { Observable } from 'rxjs';
import { map, startWith, filter, switchMap } from 'rxjs/operators';

import { NgForm, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { SchemaService } from '../../schema/schema.service';
import { IUser, UserClass } from '../../user/user';
import { ITicket } from '../ticket';
import { UserListGetActionQuery } from '../../user/state/user.actions';
import { Event } from '@angular/router';


@Component({
  selector: 'app-ticket/table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: TableListDataSource;

  @Select(TicketState.getTickets)
  $tickets: Observable<ITicket[]>;

  @Select(UserState.getUsers)
  $users: Observable<IUser[]>;

  reactiveFilterForm: FormGroup;

  private qValues: string[] = [];

  private selectedIdCliente = "";
  private selectedIdTecnico = "";

  private called = false;

  $filteredPortalUserOptions: Observable<IUser[]>;
  $filteredTecnicoOptions: Observable<IUser[]>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['_id', 'titolo'];

  constructor(private store: Store) {

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

  }

  ngOnInit() {

    const idUtente = this.store.selectSnapshot<String>(AuthState.authStateId);

    this.qValues.push("_tecnico=" + idUtente);
    this.qValues.push("stato!=Chiuso");


    this.store.dispatch(new TicketListGetActionQuery({ q: this.qValues }));
    this.store.dispatch(new UserListGetActionQuery({ q: [] }));

    this.$tickets.subscribe((retTickets: ITicket[]) => {
      console.log("INIT:", retTickets);

      this.dataSource = new TableListDataSource(this.paginator, this.sort);

      this.dataSource.data = retTickets;
    });




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

    this.qValues = [];
  }

  // eseguiRicerca(filterForm: NgForm) {

  //   console.log(filterForm.value);


  //   if (filterForm.value.fullText != "") {
  //     this.qValues.push("titolo~" + filterForm.value.fullText);
  //   }

  //   this.store.dispatch(new TicketListGetActionQuery({ q: this.qValues }));

  //   this.qValues = [];
  // }

  filterTable(realtimeFiler: string) {

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
