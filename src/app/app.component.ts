import { Component } from '@angular/core';
import { BackendService } from './backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // TODO: Move the users logic to a users store service.
  users = this.backend.users();

  constructor(private backend: BackendService) {}
}
