import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketRoutingModule } from './ticket.routing.module';
import { MaterialModule } from '../material/material.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
    declarations: [
        ListComponent,
        DetailComponent
    ],
    imports: [ 
        CommonModule,
        TicketRoutingModule,
        MaterialModule
    ],
    exports: [],
    providers: [],
})
export class TicketModule {}