import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DetailComponent } from './detail/detail.component';
import { TableListComponent } from './table-list/table-list.component';

const routes: Routes = [
    // Necessita di <routeroutlet> nel componente padre in questo caso TableList
    // {
    //     path: '', component: TableListComponent, children: [
    //         {
    //             path: 'new', component: DetailComponent
    //         }
    //     ]
    // }
    {
        path: '', component: TableListComponent
    },
    {
        path: ':new', component: DetailComponent
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketRoutingModule { }
