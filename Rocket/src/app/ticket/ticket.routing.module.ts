import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { TableListComponent } from './table-list/table-list.component';

const routes: Routes = [
    {
        path: '', component: TableListComponent
    },
    {
        path: ':id', component: DetailComponent
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketRoutingModule { }
