import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationCardComponent } from '../reservation-cards/reservation-cards.component';

@Component({
  selector: 'app-reservation-cards-sample',
  imports: [CommonModule, ReservationCardComponent],
  templateUrl: './reservation-cards-sample.component.html',
  styleUrl: './reservation-cards-sample.component.scss'
})
export class ReservationCardsSampleComponent {
  selectedCardId: number | null = null;
  
  reservationItems = [
    {
      id: 1,
      name: 'Edward Smith',
      shipmentType: 'Cube Van Shelf',
      tripType: 'Round Trip',
      price: true,
      highlighted: false
    },
    {
      id: 2,
      name: 'John Stone',
      shipmentType: 'Refrigerator',
      tripType: 'One Way',
      insurance: true,
      highlighted: true,
      trackingNumber: '#98765432',
      borderColor: '#4caf50'
    }
  ];
  
  // Additional items for calendar view demonstration
  calendarItems = [
    {
      id: 3,
      name: 'Maria Johnson',
      shipmentType: 'Express Delivery',
      tripType: 'One Way',
      price: true,
      highlighted: false
    },
    {
      id: 4,
      name: 'Robert Wilson',
      shipmentType: 'Flatbed Truck',
      tripType: 'Round Trip',
      insurance: true,
      highlighted: true,
      trackingNumber: '#87654321',
      borderColor: '#4caf50'
    },
    {
      id: 5,
      name: 'Sarah Davis',
      shipmentType: 'Moving Van',
      tripType: 'One Way',
      price: true,
      highlighted: false
    }
  ];
  
  onCardSelected(cardId: number) {
    if (this.selectedCardId === cardId) {
      // If selecting the already selected card, deselect it
      this.selectedCardId = null;
    } else {
      // Otherwise select the new card
      this.selectedCardId = cardId;
    }
  }
  
  // Helper method to distribute items across calendar days
  getItemsForDay(day: number): any[] {
    if (day === 1) return [this.reservationItems[0]];
    if (day === 2) return [this.reservationItems[1], this.calendarItems[0]];
    if (day === 3) return [this.calendarItems[1]];
    if (day === 4) return [this.calendarItems[2]];
    return [];
  }
}
