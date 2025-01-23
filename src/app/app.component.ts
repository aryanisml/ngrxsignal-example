import { Component } from '@angular/core';
import { UserFormComponent } from './user-form/user-form.component';

import { RouterOutlet } from '@angular/router';

@Component({

    selector: 'app-root',
    standalone: true,
    imports: [ RouterOutlet],
    template: `
        <div class="container mx-auto p-4">
            <!-- <h1 class="text-2xl font-bold mb-4">User Management</h1> -->
            <router-outlet></router-outlet>
            <!-- <full-calendar [options]="calendarOptions"></full-calendar> -->
        </div>
    `
})
export class AppComponent {
  
    }