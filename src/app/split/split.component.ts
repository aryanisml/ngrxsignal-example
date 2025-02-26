import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-split',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    RouterLink
  ],
  templateUrl: './split.component.html',
  styleUrl: './split.component.scss',
  animations: [
    // Regular slide animation for desktop
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    // Mobile-specific animation for full-screen panels
    trigger('mobileSlideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }),
        animate('300ms ease-out', style({ transform: 'translateX(0%)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    // Fade animation for backdrop
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SplitComponent implements OnInit {
  // Panel visibility states
  showUnitPanel = false;
  showReservationPanel = false;
  
  // Mobile detection
  isMobile = false;
  
  // Selected reservation
  selectedReservation: any = null;
  
  // Selected unit
  selectedUnit: any = null;
  
  // Calendar appointments
  appointments = [
    {
      time: '08:00 AM',
      items: [
        { id: 1, customer: 'Mike Wang', reservation: '#78432G', status: 'Confirmed' },
        { id: 2, customer: 'Robert Park', reservation: '#32H890', status: 'Postponed' },
        { id: 3, customer: 'Albert Flores', reservation: '#78432G', status: 'Confirmed' },
        { id: 4, customer: 'Bob Blake', reservation: '#98H543', status: 'Urgent' }
      ]
    },
    {
      time: '09:00 AM',
      items: [
        { id: 5, customer: 'John Stone', reservation: '#87655209', status: 'Booked' },
        { id: 6, customer: 'Bob Blake', reservation: '#98H543', status: 'Postponed' },
        { id: 7, customer: 'Mike Wang', reservation: '#78H554', status: 'Confirmed' },
        { id: 8, customer: 'Albert Flores', reservation: '#87H6435', status: 'Confirmed' }
      ]
    },
    {
      time: '09:00 AM',
      items: [
        { id: 5, customer: 'John Stone', reservation: '#87655209', status: 'Booked' },
        { id: 6, customer: 'Bob Blake', reservation: '#98H543', status: 'Postponed' },
        { id: 7, customer: 'Mike Wang', reservation: '#78H554', status: 'Confirmed' },
        { id: 8, customer: 'Albert Flores', reservation: '#87H6435', status: 'Confirmed' }
      ]
    }
  
  ];
  
  // Available units
  units = [
    {
      id: '18\' Flatbed Truck - 2023',
      location: 'lorem  TestData,sample 19898',
      distance: '2.4 miles away',
      unitId: 'Larger',
      rentalStatus: 'Ready Line',
      pmDate: '02/27/25',
      image: 'assets/flatbed-truck.png',
      status: 'Available'
    },
    {
      id: '98\' Flatbed Truck - 2023',
      location: 'lorem  TestData,sample 19898',
      distance: '2.4 miles away',
      unitId: 'Larger',
      rentalStatus: 'Ready Line',
      pmDate: '02/27/25',
      image: 'assets/flatbed-truck.png',
      status: 'Available'
    },
    {
      id: '58\' Flatbed Truck - 2023',
      location: 'lorem  TestData,sample 19898',
      distance: '2.4 miles away',
      unitId: 'Larger',
      rentalStatus: 'Ready Line',
      pmDate: '02/27/25',
      image: 'assets/flatbed-truck.png',
      status: 'Available'
    }
   
  ];

  constructor() {
    // Check screen size immediately on construction
    this.checkScreenSize();
  }
  
  ngOnInit() {
    // Initialize with default data
    this.initializeDefaultData();
  }
  
  // Listen for window resize to detect mobile/desktop mode
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
  
  // Check if the current screen size is mobile
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }
  
  initializeDefaultData() {
    // Set a default selected reservation for demonstration
    this.selectedReservation = {
      customer: 'John Stone',
      phone: '(215) 445 5712',
      reservation: '#87655209',
      type: 'Box Truck',
      lengthHeight: '16 ft & 12.5 ft',
      towing: 'Car Carrier',
      tripType: 'One-Way',
      insurance: 'On File',
      rental: 'Personal',
      duration: '3 Days',
      distance: '264 miles',
      pickup: {
        location: '0666-10',
        address: '25 Riverfront, lorem  Plaza, TestData, PA 19602',
        phone: '(610) 320-7103',
        date: 'Thu, 02/20/2025',
        time: '3:00 pm'
      },
      dropoff: {
        location: '6370-10',
        address: '802 Holly Springs Ave, Richmond, VA 23224',
        phone: '(804) 212-3538',
        date: 'Thu, 02/23/2025',
        time: '3:00 pm'
      }
    };
    
    // Set a default selected unit
    this.selectedUnit = this.units[0];
  }
  
  // Method to select a reservation
  selectReservation(reservation: any) {
    this.selectedReservation = reservation;
    
    if (this.isMobile) {
      // On mobile, show reservation panel only
      this.showReservationPanel = true;
      this.showUnitPanel = false;
    } else {
      // On desktop, can show both panels
      this.showUnitPanel = true;
      this.showReservationPanel = true;
    }
  }
  
  // Method to select a unit
  selectUnit(unit: any) {
    this.selectedUnit = unit;
    
    if (this.isMobile) {
      // On mobile, close the unit panel and show reservation
      this.showUnitPanel = false;
      this.showReservationPanel = true;
    }
  }
  
  // Close reservation and unit panels
  closePanels() {
    this.showUnitPanel = false;
    this.showReservationPanel = false;
  }
  
  // Method to open unit panel (especially for mobile)
  openUnitPanel() {
    if (this.isMobile) {
      this.showUnitPanel = true;
      this.showReservationPanel = false;
    } else {
      this.showUnitPanel = true;
    }
  }
  
  // Back button handler for mobile navigation
  goBack() {
    if (this.showUnitPanel) {
      this.showUnitPanel = false;
      this.showReservationPanel = true;
    } else if (this.showReservationPanel) {
      this.showReservationPanel = false;
    }
  }
  
  // Toggle between panels for mobile
  switchPanels() {
    if (this.isMobile) {
      this.showUnitPanel = !this.showUnitPanel;
      this.showReservationPanel = !this.showReservationPanel;
    }
  }
  
  // Get the animation trigger based on device type
  getPanelAnimation() {
    return this.isMobile ? 'mobileSlideIn' : 'slideIn';
  }
}