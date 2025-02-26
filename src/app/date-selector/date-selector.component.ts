// date-selector.component.ts
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';

interface DateOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-date-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule
  ],
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss']
})
export class DateSelectorComponent implements OnInit {
  dateOptions: DateOption[] = [
    { name: 'Daily', value: 'daily' },
    { name: 'Next 5 days', value: 'next5days' },
    { name: 'Monthly', value: 'monthly' }
  ];

  selectedOption: DateOption = this.dateOptions[0];
  selectedDate: Date = new Date();
  dateRange: Date[] = [];
  isOpen: boolean = false;
  
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.updateDateRange();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
  
  selectOption(option: DateOption) {
    this.selectedOption = option;
    this.updateDateRange();
  }

  updateDateRange() {
    const today = new Date();
    
    switch(this.selectedOption.value) {
      case 'daily':
        this.selectedDate = today;
        break;
      case 'next5days':
        this.dateRange = [];
        for(let i = 0; i < 5; i++) {
          const nextDay = new Date(today);
          nextDay.setDate(today.getDate() + i);
          this.dateRange.push(nextDay);
        }
        break;
      case 'monthly':
        this.selectedDate = today;
        break;
    }
  }
  
  onDateSelect(event: any) {
    if (this.selectedOption.value === 'next5days') {
      const startDate = new Date(event);
      this.dateRange = [];
      
      // Add selected date plus next 4 days
      for(let i = 0; i < 5; i++) {
        const nextDay = new Date(startDate);
        nextDay.setDate(startDate.getDate() + i);
        this.dateRange.push(nextDay);
      }
    }
  }
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    // Don't trigger when clicking inside the component
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}