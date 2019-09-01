import { Component, Input } from '@angular/core';
import { Ticket } from '../tickets.model';

/**
 * Dumb component to show basic ticket information.
 */
@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent {
  @Input() ticket: Ticket;
}
