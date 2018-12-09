import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITicket, ICliente, IEvento } from '../ticket';
import { Router, Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket-list-item',
  templateUrl: './ticket-list-item.component.html',
  styleUrls: ['./ticket-list-item.component.css']
})
export class TicketListItemComponent implements OnInit {

  @Input() ticket: ITicket;

  @Input() index: number;

  @Output() onMatCardClick: EventEmitter<number> = new EventEmitter<number>();

  clicked: boolean = false;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  onMatCardItemClick() {
    this.clicked = !this.clicked;

    if (this.clicked) {

      this.onMatCardClick.emit(this.index);

      this.router.navigate([this.ticket._id], { relativeTo: this.route });
    }
  }
}
