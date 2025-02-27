export interface Reservation {
    id: string;
    name: string;
    status: 'Confirmed' | 'Started' | 'Completed' | 'Voided' | 'Active';
    type?: string;
    vehicleType?: string;
  }
  
  export interface TimeSlotReservations {
    [timeSlot: string]: Reservation[];
  }
  
  export interface ReservationAction {
    action: 'view' | 'edit' | 'start' | 'complete' | 'cancel' | 'toggle';
    reservation: Reservation;
    timeSlot?: string;
  }