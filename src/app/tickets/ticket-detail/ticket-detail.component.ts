import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../tickets.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketsStoreService } from '../data-stores/tickets-store/ticket-store.service';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket;
  ticketObservable: Observable<Ticket>;

  constructor(private route: ActivatedRoute, public ticketsStoreService: TicketsStoreService) {}

  ngOnInit() {
    this.getTicket();
  }

  private getTicket() {
    this.route.paramMap.subscribe(params => {
      const ticketId = +params.get('id');

      this.ticketsStoreService.ticketsObservable.subscribe(tickets => {
        this.ticket = tickets.find(ticket => ticket.id === ticketId);
      });
    });
  }
}
