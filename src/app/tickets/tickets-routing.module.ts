import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';

const ticketsRoutes: Routes = [
  { path: 'tickets', component: TicketsComponent },
  { path: 'ticket/:id', component: TicketDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(ticketsRoutes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule {}
