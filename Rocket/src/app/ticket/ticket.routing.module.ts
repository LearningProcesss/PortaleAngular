import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// import { DetailComponent } from './detail/detail.component';
// import { TableListComponent } from './table-list/table-list.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { TicketResolveGuard } from './ticket.resolve';

const routes: Routes = [
    // Necessita di <routeroutlet> nel componente padre in questo caso TableList
    // {
    //     path: '', component: TableListComponent, children: [
    //         {
    //             path: 'new', component: DetailComponent
    //         }
    //     ]
    // }

    // OK
    // {
    //     path: '', component: TicketListComponent
    // },
    // {
    //     path: ':new', component: DetailComponent
    // }

    {
        path: '', component: TicketListComponent, resolve: { test: TicketResolveGuard }, children: [
            {
                path: ':id', component: TicketDetailComponent, resolve: { test: TicketResolveGuard }
            },
            {
                path: ':id/edit', component: TicketDetailComponent
            },
            {
                path: 'new', component: TicketDetailComponent
            }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketRoutingModule { }
