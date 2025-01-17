import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserStore } from '../../store/user.store';
import { UserFormData } from '../../store/user.model';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TableModule,
        InputTextModule,
        ButtonModule,
        CheckboxModule,
        SelectButtonModule,
        ToastModule,
        ProgressSpinnerModule
    ],
    template: `
        @if (userStore.loading()) {
            <div class="flex justify-content-center">
                <p-progressSpinner />
            </div>
        }

        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div class="grid">
                <!-- Personal Info -->
                <div class="col-12 md:col-4">
                    <div class="card">
                        <h5>Personal Information</h5>
                        <div class="field">
                            <label>First Name</label>
                            <input pInputText formControlName="firstName" class="w-full"/>
                            @if (userForm.get('firstName')?.errors?.['required'] && 
                                 userForm.get('firstName')?.touched) {
                                <small class="text-red-500">First name is required</small>
                            }
                        </div>
                        <div class="field">
                            <label>Last Name</label>
                            <input pInputText formControlName="lastName" class="w-full"/>
                            @if (userForm.get('lastName')?.errors?.['required'] && 
                                 userForm.get('lastName')?.touched) {
                                <small class="text-red-500">Last name is required</small>
                            }
                        </div>
                        <div class="field">
                            <label>Email</label>
                            <input pInputText formControlName="email" class="w-full"/>
                            @if (userForm.get('email')?.errors?.['required'] && 
                                 userForm.get('email')?.touched) {
                                <small class="text-red-500">Email is required</small>
                            }
                            @if (userForm.get('email')?.errors?.['email'] && 
                                 userForm.get('email')?.touched) {
                                <small class="text-red-500">Invalid email format</small>
                            }
                        </div>
                    </div>
                </div>

                <!-- Address -->
                <div class="col-12 md:col-4">
                    <div class="card">
                        <h5>Address</h5>
                        <div class="field">
                            <label>Street</label>
                            <input pInputText formControlName="street" class="w-full"/>
                            @if (userForm.get('street')?.errors?.['required'] && 
                                 userForm.get('street')?.touched) {
                                <small class="text-red-500">Street is required</small>
                            }
                        </div>
                        <div class="field">
                            <label>City</label>
                            <input pInputText formControlName="city" class="w-full"/>
                            @if (userForm.get('city')?.errors?.['required'] && 
                                 userForm.get('city')?.touched) {
                                <small class="text-red-500">City is required</small>
                            }
                        </div>
                        <div class="field">
                            <label>State</label>
                            <input pInputText formControlName="state" class="w-full"/>
                            @if (userForm.get('state')?.errors?.['required'] && 
                                 userForm.get('state')?.touched) {
                                <small class="text-red-500">State is required</small>
                            }
                        </div>
                        <div class="field">
                            <label>Zip Code</label>
                            <input pInputText formControlName="zipCode" class="w-full"/>
                            @if (userForm.get('zipCode')?.errors?.['required'] && 
                                 userForm.get('zipCode')?.touched) {
                                <small class="text-red-500">Zip code is required</small>
                            }
                        </div>
                    </div>
                </div>

                <!-- Preferences -->
                <div class="col-12 md:col-4">
                    <div class="card">
                        <h5>Preferences</h5>
                        <div class="field">
                            <p-checkbox formControlName="notifications" label="Enable Notifications"></p-checkbox>
                        </div>
                        <div class="field">
                            <label>Theme</label>
                            <p-selectButton [options]="themeOptions" formControlName="theme"></p-selectButton>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-content-end">
                <p-button type="submit" label="Submit" [disabled]="userForm.invalid || userStore.loading()"></p-button>
            </div>
        </form>

        <div class="mt-4">
            @if (userStore.users().length > 0) {
                <p-table 
                    [value]="userStore.users()" 
                    [paginator]="true" 
                    [rows]="5"
                    [loading]="userStore.loading()"
                    styleClass="p-datatable-gridlines">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Theme</th>
                            <th>Notifications</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-user>
                        <tr>
                            <td>{{user.personalInfo.firstName}} {{user.personalInfo.lastName}}</td>
                            <td>{{user.personalInfo.email}}</td>
                            <td>{{user.address.city}}</td>
                            <td>{{user.address.state}}</td>
                            <td>{{user.preferences.theme}}</td>
                            <td>{{user.preferences.notifications ? 'Yes' : 'No'}}</td>
                        </tr>
                    </ng-template>
                </p-table>
            } @else {
                <p class="text-center">No users added yet</p>
            }
        </div>

        <p-toast></p-toast>
    `
})
export class UserFormComponent implements OnInit {
    userForm: FormGroup;
    userStore = inject(UserStore);
    messageService = inject(MessageService);

    themeOptions = [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' }
    ];

    constructor(private fb: FormBuilder) {
        this.userForm = this.fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            street: ['', [Validators.required]],
            city: ['', [Validators.required]],
            state: ['', [Validators.required]],
            zipCode: ['', [Validators.required]],
            notifications: [false],
            theme: ['light']
        });
    }

    ngOnInit() {
        this.userStore.loadUsers();
        console.log(performance.now())
        
    }

    async onSubmit() {
        if (this.userForm.valid) {
            const formValue = this.userForm.value;
            
            const userData: UserFormData = {
                personalInfo: {
                    firstName: formValue.firstName,
                    lastName: formValue.lastName,
                    email: formValue.email
                },
                address: {
                    street: formValue.street,
                    city: formValue.city,
                    state: formValue.state,
                    zipCode: formValue.zipCode
                },
                preferences: {
                    notifications: formValue.notifications,
                    theme: formValue.theme
                },
                loading: false,
                error: null,
                userId: null
            };

            try {
               await this.userStore.saveUser(userData);
               console.log(this.userStore.users());
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User data saved successfully'
                });
                this.userForm.reset();
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save user data'
                });
            }
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill all required fields'
            });
            Object.keys(this.userForm.controls).forEach(key => {
                const control = this.userForm.get(key);
                if (control?.invalid) {
                    control.markAsTouched();
                }
            });
        }
    }
}