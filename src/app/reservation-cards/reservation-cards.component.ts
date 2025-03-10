// reservation-card.component.ts
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { RippleModule } from 'primeng/ripple';

interface ReservationItem {
  name: string;
  shipmentType: string;
  tripType: string;
  phone?: boolean;
  price?: boolean;
  insurance?: boolean;
  trackingNumber?: string;
  highlighted?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  id: number;
}

@Component({
  selector: 'app-reservation-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TagModule, RippleModule],
  template: `
    <div class="card-container" 
         [ngClass]="{'highlighted-container': item.highlighted}"
         (click)="selectCard()">
      <!-- First style for Edward Smith card with stripe pattern -->
      <div *ngIf="!item.highlighted" class="card-with-pattern" 
           [class.selected]="selected">
        <div class="diagonal-stripe-pattern"></div>
        <div class="card-content">
          <h2 class="name">{{ item.name }}</h2>
          <div class="details">
            <span>{{ item.shipmentType }}</span>
            <span class="divider">|</span>
            <span>{{ item.tripType }}</span>
            
            <ng-container *ngIf="item.price">
              <span class="divider">|</span>
              <span class="icon price-icon">
                <i class="pi pi-dollar"></i>
              </span>
            </ng-container>
            
            <ng-container *ngIf="item.insurance">
              <span class="divider">|</span>
              <span class="icon insurance-icon">
                <i class="pi pi-shield"></i>
              </span>
            </ng-container>
          </div>
          
          <button 
            pButton 
            icon="pi pi-plus" 
            class="p-button-rounded p-button-text add-button"
            (click)="$event.stopPropagation(); addItem()">
          </button>
        </div>
      </div>
      
      <!-- Second style for John Stone card with green left border -->
      <div *ngIf="item.highlighted" class="card-with-border" 
           [class.selected]="selected"
           [ngStyle]="{'border-left-color': item.borderColor || '#4caf50'}">
        <div class="card-content highlighted-content">
          <div class="highlighted-header">
            <h2 class="name">{{ item.name }}</h2>
            <span *ngIf="item.trackingNumber" class="tracking-number">{{ item.trackingNumber }}</span>
          </div>
          <div class="details highlighted-details">
            <span>{{ item.shipmentType }}</span>
            <span class="divider">|</span>
            <span>{{ item.tripType }}</span>
            
            <ng-container *ngIf="item.insurance">
              <span class="divider">|</span>
              <span class="icon insurance-icon">
                <i class="pi pi-shield"></i>
              </span>
            </ng-container>
          </div>
          
          <button 
            pButton 
            icon="pi pi-plus" 
            class="p-button-rounded p-button-text add-button highlighted-button"
            (click)="$event.stopPropagation(); addItem()">
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-container {
      position: relative;
      margin-bottom: 0.5rem;
      cursor: pointer;
      max-width: 410px;
    }
    
    /* Edward Smith card styles */
    .card-with-pattern {
      position: relative;
      display: flex;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background-color: white;
      overflow: hidden;
      min-height: 70px;
    }
    
    .card-with-pattern.selected {
      background-color: #e8f5fe !important;
      border: 1px solid #bce0fd;
    }
    
    .diagonal-stripe-pattern {
      width: 20px;
      flex-shrink: 0;
      background-color: #f5f5f5;
      background-image: repeating-linear-gradient(
        -45deg,
        #a0a0a0,
        #a0a0a0 1px,
        transparent 1px,
        transparent 6px
      );
      opacity: 0.8;
    }
    
    /* John Stone card styles */
    .card-with-border {
      border: 1px solid #e0e0e0;
      border-left-width: 20px;
      border-radius: 4px;
      background-color: white;
      overflow: hidden;
      position: relative;
      min-height: 70px;
    }
    
    .card-with-border.selected {
      background-color: #e8f5fe !important;
      border: 1px solid #bce0fd;
      border-left-width: 20px;
    }
    
    .card-content {
      padding: 0.75rem;
      flex: 1;
      position: relative;
    }
    
    .highlighted-content {
      position: relative;
      padding: 0.75rem;
    }
    
    .name {
      font-size: 1rem;
      font-weight: 500;
      margin: 0 0 0.25rem 0;
      padding-right: 30px; /* Make room for button */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #333;
    }
    
    .highlighted-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
    }
    
    .highlighted-header .name {
      font-size: 1rem;
      font-weight: 500;
      margin: 0;
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .tracking-number {
      font-size: 0.875rem;
      font-weight: 500;
      color: #333;
      white-space: nowrap;
      margin-left: 0.5rem;
    }
    
    .details {
      display: flex;
      align-items: center;
      color: #555;
      font-size: 0.875rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .highlighted-details {
      display: flex;
      align-items: center;
      color: #555;
      font-size: 0.875rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .divider {
      margin: 0 0.25rem;
      color: #aaa;
    }
    
    .icon {
      display: inline-flex;
    }
    
    .price-icon {
      background-color: #e53935;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
    }
    
    .insurance-icon {
      color: white;
      background-color: #e53935;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
    }
    
    .add-button {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      color: #888;
      background-color: #f1f1f1;
      border-radius: 50%;
      width: 24px;
      height: 24px;
    }
    
    .add-button .pi {
      font-size: 0.75rem;
    }
    
    .highlighted-button {
      top: 0.5rem;
      right: 0.5rem;
    }
  `]
})
export class ReservationCardComponent implements OnInit {
  @Input() item!: ReservationItem;
  @Input() selectedId: number | null = null;
  @Output() selectionChange = new EventEmitter<number>();
  
  constructor() {}
  
  ngOnInit() {}
  
  get selected(): boolean {
    return this.selectedId === this.item.id;
  }
  
  selectCard() {
    this.selectionChange.emit(this.item.id);
  }
  
  addItem() {
    console.log('Add button clicked for:', this.item.name);
    // Prevent event bubbling to avoid triggering the card selection
    event?.stopPropagation();
  }
}