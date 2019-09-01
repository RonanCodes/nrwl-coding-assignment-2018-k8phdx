import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketComponent } from './ticket/ticket.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { TicketsRoutingModule } from './tickets-routing.module';

export * from './tickets.model';

@NgModule({
  declarations: [TicketsComponent, TicketComponent, TicketDetailComponent],
  imports: [CommonModule, FormsModule, TicketsRoutingModule],
  exports: [TicketsComponent]
})
export class TicketsModule {}
