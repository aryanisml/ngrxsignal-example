import { Component } from '@angular/core';
import { ReservationsDashboardComponent } from '../reservations-dashboard/reservations-dashboard.component';
//import { ReservationsDashboardComponent, Reservation, ReservationAction, TimeSlotReservations }from './reservations-dashboard/reservations-dashboard.component';
@Component({
  selector: 'app-consumer-accordin',
  imports: [ReservationsDashboardComponent],
  template: `
    <div class="container">
      <app-reservations-dashboard>
      </app-reservations-dashboard>
    </div>
  `,
  styles: [`
    .container {
      width: 100%;
      margin: 0 auto;
    }
  `],
  standalone:true
})
export class ConsumerAccordinComponent {

  // location: string = 'Penske Reading ( 0666-10) | 05 Reservations';
  
  // reservationsData: TimeSlotReservations = {
  //   '07:00 AM': [
  //     { id: '98765432', name: 'Mia Wong', status: 'Confirmed', icon: 'pi pi-building' },
  //     { id: '97943200', name: 'John Doe', status: 'Started', icon: 'pi pi-home' },
  //     { id: '65321007', name: 'Robert Fox', status: 'Completed', icon: 'pi pi-search' },
  //     { id: '98762319', name: 'Albert Flora', status: 'Voided', icon: 'pi pi-building' },
  //     { id: '98888771', name: 'Rob Blake', status: 'Active', icon: 'pi pi-search' },
  //     { id: '95435589', name: 'Alan Scott', status: 'Active', icon: 'pi pi-building' },
  //     { 
  //       id: '98765432', 
  //       name: 'Mia Wong', 
  //       status: 'Active', 
  //       type: 'Refrigerator',
  //       isSpecial: true,
  //       icon: 'pi pi-building'
  //     }
  //   ],
  //   '08:00 AM': [
  //     { id: '97943200', name: 'John Doe', status: 'Active', icon: 'pi pi-home' },
  //     { 
  //       id: '87653209', 
  //       name: 'John Stone', 
  //       status: 'Started', 
  //       vehicleType: 'Box truck',
  //       icon: 'pi pi-home'
  //     }
  //   ],
  //   '09:00 AM': [
  //     { id: '98888771', name: 'Rob Blake', status: 'Confirmed', icon: 'pi pi-search' },
  //     { id: '98765432', name: 'Mia Wong', status: 'Confirmed', icon: 'pi pi-building' },
  //     { id: '98762319', name: 'Albert Flora', status: 'Voided', icon: 'pi pi-building' }
  //   ]
  // };
  
  // onReservationAction(event: ReservationAction): void {
  //   console.log('Reservation action:', event.action);
  //   console.log('Reservation:', event.reservation);
  //   console.log('Time slot:', event.timeSlot);
  // }

  // onViewChange(a: any){

  // }
}
