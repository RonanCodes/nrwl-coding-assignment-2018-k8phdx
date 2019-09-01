import { Component } from '@angular/core';
import { TicketsStoreService } from '../data-stores/tickets-store/ticket-store.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {
  constructor(public ticketsStoreService: TicketsStoreService) {}
}
