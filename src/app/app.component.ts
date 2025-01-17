import { Component } from '@angular/core';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [UserFormComponent],
    template: `
        <div class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-4">User Management</h1>
            <app-user-form />
        </div>
    `
})
export class AppComponent {}