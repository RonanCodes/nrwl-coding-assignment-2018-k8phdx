import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsComponent } from './tickets.component';
import { TicketsModule } from '../tickets.module';
import { TicketsStoreService } from '../data-stores/tickets-store/ticket-store.service';
import { Subject } from 'rxjs';
import { Ticket } from '../tickets.model';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('TicketsComponent', () => {
  let component: TicketsComponent;
  let fixture: ComponentFixture<TicketsComponent>;

  // Mock data
  let tickets: Ticket[];

  // Subjects
  let toggleCompletedStatusSubject: Subject<void>;
  let ticketsObservableSubject: Subject<Ticket[]>;

  // Injectables
  let mockTicketsStoreService: jasmine.SpyObj<TicketsStoreService>;

  beforeEach(async(() => {
    // Mock data
    tickets = [
      { id: 0, description: 'Zero', assigneeId: null, completed: false },
      { id: 1, description: 'One', assigneeId: null, completed: false },
      { id: 2, description: 'Two', assigneeId: null, completed: false },
      { id: 3, description: 'Three', assigneeId: null, completed: false },
      { id: 4, description: 'Four', assigneeId: null, completed: false }
    ];

    // Subjects
    toggleCompletedStatusSubject = new Subject<void>();
    ticketsObservableSubject = new Subject<Ticket[]>();

    // Injectables
    mockTicketsStoreService = {
      ...jasmine.createSpyObj('mockTicketsStoreService', ['toggleCompletedStatus']),
      ticketsObservable: ticketsObservableSubject.asObservable()
    };
    mockTicketsStoreService.toggleCompletedStatus.and.returnValue(
      toggleCompletedStatusSubject.asObservable()
    );

    TestBed.configureTestingModule({
      imports: [TicketsModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: TicketsStoreService,
          useValue: mockTicketsStoreService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    ticketsObservableSubject.next(tickets);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('element: ul.tickets', () => {
    const ticketsSelector = '.tickets li';

    it('should contain 5 tickets', () => {
      // Act
      const ticketDebugElements: DebugElement[] = fixture.debugElement.queryAll(
        By.css(ticketsSelector)
      );
      fixture.detectChanges();

      // Assert
      expect(ticketDebugElements.length).toEqual(5);
    });
  });

  describe('element: input.checkbox-complete', () => {
    const completeCheckboxSelector = '.checkbox-complete';

    it('should call #ticketsStoreService.toggleCompletedStatus() with the third ticket', () => {
      // Arrange
      const checkboxDebugElements: DebugElement[] = fixture.debugElement.queryAll(
        By.css(completeCheckboxSelector)
      );

      // Act
      checkboxDebugElements[3].nativeElement.dispatchEvent(new Event('change'));
      toggleCompletedStatusSubject.next();

      // Assert
      expect(mockTicketsStoreService.toggleCompletedStatus).toHaveBeenCalledWith(tickets[3]);
    });
  });
});
