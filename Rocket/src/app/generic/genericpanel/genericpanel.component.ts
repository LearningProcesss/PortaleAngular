import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-genericpanel',
  templateUrl: './genericpanel.component.html',
  styleUrls: ['./genericpanel.component.css']
})
export class GenericpanelComponent implements OnInit {

  @Input() titolo: string;
  @Input() contenuto: string;
  @Input() utente: string;

  constructor() { }

  ngOnInit() {
  }

}
