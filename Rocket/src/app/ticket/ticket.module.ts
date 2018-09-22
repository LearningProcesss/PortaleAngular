import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketRoutingModule } from './ticket.routing.module';
import { MaterialModule } from '../material/material.module';
import { DetailComponent } from './detail/detail.component';
import { TableListComponent } from './table-list/table-list.component';
import { MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchemaService } from '../schema/schema.service';
import { ImageUploadModule } from 'angular2-image-upload';

@NgModule({
    declarations: [
        DetailComponent,
        TableListComponent
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
        SchemaService
    ],
})
export class TicketModule {}