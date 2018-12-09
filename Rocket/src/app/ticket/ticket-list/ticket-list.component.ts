import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TicketState } from '../state/ticket.state';
import { Observable } from 'rxjs';
import { ITicket } from '../ticket';
import { AuthState } from '../../auth/state/auth.state';
import { TicketListGetActionQuery } from '../state/ticket.actions';
import { TicketListItemComponent } from '../ticket-list-item/ticket-list-item.component';
import { MatPaginator } from '@angular/material';
import { take, tap, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChildren(TicketListItemComponent) items: QueryList<TicketListItemComponent>;

  // Viene automaticamente valorizzato con il valore dello state, nessuna operazione necessaria
  // Se lo state viene modificato, ovviamente, anche questa Observable viene modificata.
  @Select(TicketState.getTickets)
  public $tickets: Observable<ITicket[]>;

  private idUtente: string;

  constructor(private store: Store) { }

  ngOnInit() {
    this.idUtente = this.store.selectSnapshot<string>(AuthState.authStateId);
    
    this.store.dispatch(new TicketListGetActionQuery({ q: ["_tecnico=" + this.idUtente, "stato!=Chiuso"], p: ["titolo", "creatoIl", "_cliente.nome", "_cliente.cognome", "eventi<<1", "eventi>?"] }));
    
    // this.$tickets = this.store.selectOnce<ITicket[]>(TicketState.getTickets);

    // this.$tickets.subscribe(t => console.log(t));
    
    
    this.$tickets.subscribe(tickets => {
      this.paginator.length = tickets.length;
    });
    // this.$tickets.pipe(switchMap(ret => { return ret; })).subscribe(t => );
  }
  ngAfterViewInit(): void {
    // this.items.changes.subscribe((i: TicketListItemComponent) => {
    //   console.log("cambiato:", i);

    // });
  }
  onItemMatCardClick(index: number) {
    console.log(index);
    this.items.filter(i => i.clicked == true && i.index != index).forEach(i => i.clicked = false);
  }

}
