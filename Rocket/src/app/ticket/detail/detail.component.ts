import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SchemaService } from '../../schema/schema.service';
import { ITicket, IEvento, ICliente } from '../ticket';

import { Observable } from 'rxjs';
import { IStringFieldEnum } from '../../schema/schema';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { UserState } from '../../user/state/user.state';
import { IUser } from '../../user/user';
import { MatSelectChange } from '@angular/material';
import { FileHolder } from 'angular2-image-upload';
import { TicketSaveAction } from '../state/ticket.actions';
import { AuthState } from '../../auth/state/auth.state';
import { TicketState } from '../state/ticket.state';
import { ActivatedRoute, Params } from '@angular/router';



@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  ticketFormGroup: FormGroup;

  ticket: ITicket;

  $tasks: Observable<string[]>;
  $prios: Observable<string[]>;
  $statos: Observable<string[]>;
  $filteredPortalUserOptions: Observable<IUser[]>;
  $filteredTecnicoOptions: Observable<IUser[]>;
  @Select(UserState.getUsers) $users: Observable<IUser[]>;
  @Select(TicketState.getLastEventoCreatoInSessione) $evento: Observable<IEvento>;
  private selectedIdCliente = "";
  private selectedIdTecnico = "";

  private selectedFile: File;

  constructor(private store: Store, private schemaService: SchemaService, private route: ActivatedRoute) {

  }

  ngOnInit() {

    // this.route.params.subscribe((p: Params) => {
    //   if (p['id'] != "0") {

    //   }
    // });

    this.$tasks = this.schemaService.getSchemaPathProperty<IStringFieldEnum>("ticket", "task", "enumValues").pipe(map((m: IStringFieldEnum) => m.enumValues));

    this.$prios = this.schemaService.getSchemaPathProperty<IStringFieldEnum>("ticket", "prio", "enumValues").pipe(map((m: IStringFieldEnum) => m.enumValues));

    this.$statos = this.schemaService.getSchemaPathProperty<IStringFieldEnum>("ticket", "stato", "enumValues").pipe(map((m: IStringFieldEnum) => m.enumValues));

    this.ticketFormGroup = new FormGroup(
      {
        ticketFormTitolo: new FormControl(),
        ticketFormEventoText: new FormControl(),
        ticketFormTask: new FormControl(),
        ticketFormPrio: new FormControl(),
        ticketFormCliente: new FormControl(),
        ticketFormProcad: new FormControl(),
        ticketFormTecnico: new FormControl(),
        ticketFormStato: new FormControl()
      }
    );

    this.$filteredPortalUserOptions = this.ticketFormGroup.get("ticketFormCliente").valueChanges.pipe(
      startWith(''),
      switchMap(text => {
        return this.$users.pipe(map(u => u.filter(usr => usr.nome.toLowerCase().includes(text.toLowerCase()) || usr.cognome.toLowerCase().includes(text.toLowerCase()))))
      }));

    this.$filteredTecnicoOptions = this.ticketFormGroup.get("ticketFormTecnico").valueChanges.pipe(
      startWith(''),
      switchMap(text => {
        return this.$users.pipe(map(u => u.filter(usr => usr.tipo === 1 && (usr.nome.toLowerCase().includes(text.toLowerCase()) || usr.cognome.toLowerCase().includes(text.toLowerCase())))))
      }));

  }
  selezioneCliente(event: MatSelectChange, obj: IUser) {
    this.selectedIdCliente = obj._id;
  }
  selezioneTecnico(event: MatSelectChange, obj: IUser) {
    this.selectedIdTecnico = obj._id;
  }

  onUploadFinished(event: FileHolder) {
    this.selectedFile = event.file;
  }

  salvaFormSubmit() {

    console.log(this.ticketFormGroup.value);

    try {

      const nomeUtente = this.store.selectSnapshot<string>(AuthState.authStateNome);

      let _clienteModel: ICliente = {
        _id: this.selectedIdCliente
      }

      const nuovoTicket: ITicket = {
        titolo: this.ticketFormGroup.get("ticketFormTitolo").value + "",
        //_cliente: this.selectedIdCliente,
        _cliente: _clienteModel,
        _tecnico: this.selectedIdTecnico,
        task: this.ticketFormGroup.get("ticketFormTask").value,
        prio: this.ticketFormGroup.get("ticketFormPrio").value,
        stato: this.ticketFormGroup.get("ticketFormStato").value
        // eventi: [{
        //   testo: this.ticketFormGroup.get("ticketFormTitolo").value,
        //   creatoDa: nomeUtente
        // }]
      };

      let evento: IEvento = {
        testo: this.ticketFormGroup.get("ticketFormEventoText").value,
        creatoDa: nomeUtente
      };

      this.store.dispatch(new TicketSaveAction({ ticket: nuovoTicket, evento: evento, file: this.selectedFile })).subscribe(response => {
        console.log("LOG dispatch", response);
      });

    } catch (error) {
      console.log(error);
    }


  }
}
