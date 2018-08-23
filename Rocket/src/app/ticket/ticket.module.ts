import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketRoutingModule } from './ticket.routing.module';
import { MaterialModule } from '../material/material.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { TableListComponent } from './table-list/table-list.component';
import { MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';

@NgModule({
    declarations: [
        ListComponent,
        DetailComponent,
        TableListComponent
    ],
    imports: [ 
        CommonModule,
        TicketRoutingModule,
        MaterialModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule
    ],
    exports: [],
    providers: [],
})
export class TicketModule {}