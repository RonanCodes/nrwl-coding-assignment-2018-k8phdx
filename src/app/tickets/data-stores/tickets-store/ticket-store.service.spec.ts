import { TestBed } from '@angular/core/testing';

import { TicketsStoreService } from './ticket-store.service';
import { BackendService } from 'src/app/backend.service';
import { Subject } from 'rxjs';
import { Ticket } from '../../tickets.model';

describe('TicketsStoreService', () => {
  let service: TicketsStoreService;

  // Mock data
  let tickets: Ticket[];

  // Subjects
  let ticketsSubject: Subject<Ticket[]>;
  let newTicketSubject: Subject<Ticket>;
  let completeSubject: Subject<Ticket>;

  // Injectables
  let mockBackendService: jasmine.SpyObj<BackendService>;

  beforeEach(() => {
    // Mock data
    tickets = [
      { id: 0, description: 'Zero', assigneeId: null, completed: false },
      { id: 1, description: 'One', assigneeId: null, completed: false },
      { id: 2, description: 'Two', assigneeId: null, completed: false },
      { id: 3, description: 'Three', assigneeId: null, completed: false },
      { id: 4, description: 'Four', assigneeId: null, completed: false }
    ];

    // Subjects
    ticketsSubject = new Subject<Ticket[]>();
    newTicketSubject = new Subject<Ticket>();
    completeSubject = new Subject<Ticket>();

    // Injectables
    mockBackendService = jasmine.createSpyObj('mockBackendService', [
      'tickets',
      'newTicket',
      'complete'
    ]);
    mockBackendService.tickets.and.returnValue(ticketsSubject.asObservable());
    mockBackendService.newTicket.and.returnValue(newTicketSubject.asObservable());
    mockBackendService.complete.and.returnValue(completeSubject.asObservable());

    TestBed.configureTestingModule({
      providers: [
        {
          provide: BackendService,
          useValue: mockBackendService
        }
      ]
    });
    service = TestBed.get(TicketsStoreService);

    ticketsSubject.next(tickets);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#toggleCompletedStatus()', () => {
    const completeCheckboxSelector = '.checkbox-complete;';
    let ticketsObservableCount;

    let ticketToUpdate: Ticket;
    let returnedTicket: Ticket;

    let updateTicketSpy: jasmine.Spy;

    beforeEach(() => {
      ticketsObservableCount = 0;

      ticketToUpdate = {
        assigneeId: 0,
        completed: false,
        description: 'Zero',
        id: 222
      } as Ticket;

      returnedTicket = {
        ...ticketToUpdate,
        completed: true
      } as Ticket;

      updateTicketSpy = spyOn(service, 'updateTicket').and.callThrough();
    });

    [{ completed: true }, { completed: false }].forEach(params => {
      it(`should update #ticket.completed to ${params.completed}`, done => {
        // Arrange
        ticketToUpdate.completed = !params.completed;
        returnedTicket.completed = params.completed;

        service.ticketsObservable.subscribe(tickets => {
          ticketsObservableCount++;
          done();
        });

        // Act
        service.toggleCompletedStatus(ticketToUpdate);
        completeSubject.next(returnedTicket);

        // Assert
        expect(mockBackendService.complete).toHaveBeenCalledWith(222, params.completed);

        expect(service.updateTicket).toHaveBeenCalledWith(ticketToUpdate);
        expect(updateTicketSpy).toHaveBeenCalledTimes(1);
        expect(ticketsObservableCount).toEqual(2);
      });
    });

    it('should update #ticket.completed & then revert update on error', done => {
      // Arrange
      service.ticketsObservable.subscribe(tickets => {
        ticketsObservableCount++;
        done();
      });

      // Act
      service.toggleCompletedStatus(ticketToUpdate);
      completeSubject.error(new Error('Mock Error'));

      // Assert
      expect(mockBackendService.complete).toHaveBeenCalledWith(
        ticketToUpdate.id,
        ticketToUpdate.completed
      );

      expect(updateTicketSpy).toHaveBeenCalledTimes(2);

      expect(service.updateTicket).toHaveBeenCalledWith({
        ...ticketToUpdate,
        completed: true
      } as Ticket);
      expect(service.updateTicket).toHaveBeenCalledWith({
        ...ticketToUpdate,
        completed: false
      } as Ticket);
      expect(ticketsObservableCount).toEqual(3);
    });
  });
});
