import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ticket } from '../../tickets.model';
import { BackendService } from 'src/app/backend.service';
import { take } from 'rxjs/operators';

// TODO: Add optimistic update reversals to all data store update methods.

/**
 * A data source service for tickets.
 *
 * @description
 * All updates are optimistic and hence are done instantly.
 * If the actual service call fails, then the optimistic data store update is reversed.
 * This keeps the UI snappy for the user.
 */
@Injectable({
  providedIn: 'root'
})
export class TicketsStoreService {
  private readonly ticketsSubject = new BehaviorSubject<Ticket[]>([]);
  readonly ticketsObservable = this.ticketsSubject.asObservable();

  constructor(private backendService: BackendService) {
    this.backendService
      .tickets()
      .pipe(take(1)) // Only do the HTTP Request once, this will help with race conditions.
      .subscribe(tickets => {
        this.setTickets([...tickets]);
      });
  }

  get tickets(): Ticket[] {
    return this.ticketsSubject.getValue();
  }

  getTicket(ticketId: number): Ticket {
    return this.ticketsSubject.getValue().find(ticket => ticket.id === ticketId);
  }

  // TODO: Should this return the new ticket number or should the UI generate that? (probably the service)
  addTicket(ticketDescription: string): void {
    this.setTickets([
      ...this.tickets,
      {
        id: null,
        description: ticketDescription,
        assigneeId: null,
        completed: false
      }
    ]);

    this.backendService.newTicket({ description: ticketDescription }).subscribe(
      ticket => console.log('Ticket added successfully.', { ticket }),
      error => {
        console.log('Error adding ticket.', { error });

        // Reverse our optimistic update:
        this.setTickets(this.tickets.filter(ticket => ticket.description !== ticketDescription));
      }
    );
  }

  removeTicket(ticketId: number): void {
    this.setTickets(this.tickets.filter(ticket => ticket.id !== ticketId));
  }

  updateTicket(updatedTicket: Ticket): void {
    this.tickets.find(ticket => ticket.id !== updatedTicket.id),
      this.setTickets([
        ...this.tickets.filter(ticket => ticket.id !== updatedTicket.id),
        updatedTicket
      ]);
  }

  toggleCompletedStatus(ticket: Ticket): void {
    // Optimistic update:
    ticket.completed = !ticket.completed;
    this.updateTicket(ticket);

    this.backendService.complete(ticket.id, ticket.completed).subscribe(
      ticket => console.log('Ticket completion status updated successfully.', { ticket }),
      error => {
        // NOTE: Uncomment this timeout to view the optimistic update working (also update #backendService.complete() to return an error).
        // setTimeout(() => {
        console.error('Error updating ticket completion status.', error);
        // Reverse our optimistic update:
        this.updateTicket({
          ...ticket,
          completed: !ticket.completed
        });
        // }, 3000);
      }
    );
  }

  // Add Assign method (and inject UserStoreService)

  // Add Filter method

  private setTickets(tickets: Ticket[]): void {
    // Create new objects (break reference to service objects,
    // as we don't want service updates to effect our local objects as this will cause race conditions and weird immutable behavior.
    const newTickets = tickets.map(ticket => ({ ...ticket }));

    this.ticketsSubject.next(newTickets);
  }
}
