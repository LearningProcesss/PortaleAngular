import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TicketRoutingModule } from './ticket.routing.module';

import { MaterialModule } from '../material/material.module';

import { MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';

import { GenericpanelComponent } from '../generic/genericpanel/genericpanel.component';

import { SchemaService } from '../schema/schema.service';

import { ImageUploadModule } from 'angular2-image-upload';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { DetailComponent } from './detail/detail.component';
import { TableListComponent } from './table-list/table-list.component';
import { TicketSearchComponent } from './ticket-search/ticket-search.component';
import { TicketListItemComponent } from './ticket-list-item/ticket-list-item.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { TicketResolveGuard } from './ticket.resolve';

@NgModule({
    declarations: [
        DetailComponent,
        TableListComponent,
        TicketListComponent,
        TicketSearchComponent,
        TicketListItemComponent,
        TicketDetailComponent,
        GenericpanelComponent
    ],
    imports: [ 
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TicketRoutingModule,
        MaterialModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        ImageUploadModule.forRoot()
    ],
    exports: [

    ],
    providers: [
        SchemaService,
        TicketResolveGuard
    ],
})
export class TicketModule {}