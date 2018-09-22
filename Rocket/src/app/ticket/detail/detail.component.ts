import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SchemaService } from '../../schema/schema.service';
import { ITicket, IEvento } from '../ticket';

import { Observable } from 'rxjs';
import { ITicketSchema, ITicketSchemaDefinition, IStringEnumOptions, IStringFieldEnum } from '../../schema/schema';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { UserState } from '../../user/state/user.state';
import { IUser } from '../../user/user';
import { MatSelectChange } from '@angular/material';
import { FileHolder } from 'angular2-image-upload';
import { TicketSaveAction } from '../state/ticket.actions';
import { AuthState } from '../../auth/state/auth.state';



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

  @Select(UserState.getUsers)
  $users: Observable<IUser[]>;
  $filteredPortalUserOptions: Observable<IUser[]>;
  $filteredTecnicoOptions: Observable<IUser[]>;
  private selectedIdCliente = "";
  private selectedIdTecnico = "";

  private selectedFile: File;

  constructor(private store: Store, private schemaService: SchemaService) {

  }

  ngOnInit() {

    this.$tasks = this.schemaService.getSchemaPathProperty<IStringFieldEnum>("ticket", "task", "enumValues").pipe(map((m: IStringFieldEnum) => m.enumValues));

    this.$prios = this.schemaService.getSchemaPathProperty<IStringFieldEnum>("ticket", "prio", "enumValues").pipe(map((m: IStringFieldEnum) => m.enumValues));

    this.ticketFormGroup = new FormGroup(
      {
        ticketFormTitolo: new FormControl(),
        ticketFormEventoText: new FormControl(),
        ticketFormTask: new FormControl(),
        ticketFormPrio: new FormControl(),
        ticketFormCliente: new FormControl(),
        ticketFormProcad: new FormControl(),
        ticketFormTecnico: new FormControl()
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

      console.log(nomeUtente);

      const nuovoTicket: ITicket = {
        titolo: this.ticketFormGroup.get("ticketFormTitolo").value + "",
        _cliente: this.selectedIdCliente,
        _tecnico: this.selectedIdTecnico,
        task: this.ticketFormGroup.get("ticketFormTask").value,
        prio: this.ticketFormGroup.get("ticketFormPrio").value
        // eventi: [{
        //   testo: this.ticketFormGroup.get("ticketFormTitolo").value,
        //   creatoDa: nomeUtente
        // }]
      };

      let evento: IEvento = {
        testo: this.ticketFormGroup.get("ticketFormEventoText").value,
        creatoDa: nomeUtente
      };

      this.store.dispatch(new TicketSaveAction({ ticket: nuovoTicket, evento: evento, file: this.selectedFile }));
    } catch (error) {
console.log(error);

    }


  }
}
