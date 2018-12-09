import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ITicket } from '../ticket';
import { Observable } from 'rxjs';
import { TicketState } from '../state/ticket.state';
import { Select } from '@ngxs/store';
import { find, map, first } from 'rxjs/operators';
import { log } from 'util';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {

  @Select(TicketState.getTickets)
  private $tickets: Observable<ITicket[]>;

  ticket: ITicket;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params["id"]) {
        this.$tickets.pipe(
          map(t => t.find(tt => tt._id === params["id"]))
        )
          .subscribe(q => {
            this.ticket = q; 
          });
      }
    });
  }

}
