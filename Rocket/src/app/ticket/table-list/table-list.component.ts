import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { TableListDataSource } from './table-list-datasource';

import { Store, Select, Actions } from '@ngxs/store';
import { TicketListGetActionQuery } from '../state/ticket.actions';
import { AuthState } from '../../auth/state/auth.state';
import { TicketState } from '../state/ticket.state';

import { Observable } from 'rxjs';

import { Ticket } from '../ticket';
import { NgForm } from '@angular/forms';

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
  $tickets: Observable<Ticket[]>;

  private qValues: string[] = [];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['_id', 'titolo'];

  constructor(private store: Store) {

  }

  ngOnInit() {

    const idUtente = this.store.selectSnapshot<String>(AuthState.authStateId);

    this.qValues.push("_tecnico=" + idUtente);
    this.qValues.push("stato=Aperto");

    this.store.dispatch(new TicketListGetActionQuery({ q: this.qValues }));

    this.$tickets.subscribe((retTickets: Ticket[]) => {

      this.dataSource = new TableListDataSource(this.paginator, this.sort);

      this.dataSource.data = retTickets;
    });

    this.qValues = [];
  }

  eseguiRicerca(filterForm: NgForm) {

    this.qValues.push("titolo~" + filterForm.value.fullText);

    this.store.dispatch(new TicketListGetActionQuery({ q: this.qValues }));

    this.qValues = [];
  }
}
