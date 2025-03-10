// reservations-dashboard.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

interface AccordionItem {
  header: string;
  content: string;
  isOpen?: boolean;
}

interface Event {
  id: number;
  title: string;
  refNumber?: string;
  status?: 'confirmed' | 'pending' | 'cancelled' | 'voided';
  isPlaceholder?: boolean;
}

interface Unit {
  id: number;
  type: string;
  year: string;
  distance: string;
  description: string;
  rentalStatus: string;
  pmDate: string;
  imageUrl: string;
}

@Component({
  selector: 'app-reservations-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule
  ],
  template: `
    <div class="dashboard-container" [class.expanded-view]="expandedTimeSlot !== null">
      <div class="grid-system">
        <!-- Main Accordion - Takes 12 cols by default, 5 when expanded -->
        <div class="accordion-section" [class.grid-5]="expandedTimeSlot !== null">

          <!-- Custom Accordion -->
          <div class="accordion-container">
            <div
              class="accordion-item"
              *ngFor="let item of accordionItems; let i = index"
            >
              <div
                class="accordion-header"
                [class.active]="item.isOpen"
                (click)="toggleItem(i)"
              >
                <div class="toggle-icon">
                  <i
                    class="icon"
                    [innerHTML]="item.isOpen ? '&#9660;' : '&#9654;'"
                  ></i>
                </div>
                <div class="header-text">
                  {{ item.header }} <span class="font-bold">Reading</span>
                </div>
              </div>
              <div
                class="accordion-content"
                [@collapseAnimation]="item.isOpen ? 'open' : 'closed'"
              >
                <!-- schedule.component.html -->
                <div class="schedule-container">
                  <div class="schedule-grid">
                    <ng-container *ngFor="let timeSlot of timeSlots">
                      <div class="time-row" [class.expanded]="expandedTimeSlot !== null">
                        <div class="time-cell">{{ timeSlot }}</div>
                        <div class="events-cell">
                          <div class="events-wrapper">
                            <!-- If any time slot is expanded, show all events in a single vertical column -->
                            <ng-container *ngIf="expandedTimeSlot !== null">
                              <div class="event-column">
                                <div
                                  *ngFor="let event of events[timeSlot]"
                                  class="event-container"
                                  (click)="toggleExpandTimeSlot(timeSlot, event)"
                                >
                                  <div class="event-card" [ngClass]="'event-status-' + event.status">
                                    <div class="event-icons">
                                      <span class="event-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                          <rect x="2" y="3" width="20" height="18" rx="2" ry="2"></rect>
                                          <line x1="8" y1="3" x2="8" y2="21"></line>
                                          <line x1="16" y1="3" x2="16" y2="21"></line>
                                          <line x1="2" y1="9" x2="22" y2="9"></line>
                                          <line x1="2" y1="15" x2="22" y2="15"></line>
                                        </svg>
                                      </span>
                                      <span class="event-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                          <path d="M5 12h14M12 5l7 7-7 7"></path>
                                        </svg>
                                      </span>
                                    </div>
                                    <div class="event-content">
                                      <div class="event-title">{{ event.title }}</div>
                                      <div class="event-reference">
                                        <span class="ref-symbol">#</span> {{ event.refNumber }}
                                      </div>
                                    </div>
                                    <div class="event-status">{{ event.status }}</div>
                                  </div>
                                </div>
                              </div>
                            </ng-container>

                            <!-- If no time slot is expanded, show events in grid layout -->
                            <ng-container *ngIf="expandedTimeSlot === null">
                              <ng-container
                                *ngFor="let row of getEventRows(timeSlot)"
                              >
                                <div class="event-row">
                                  <div
                                    *ngFor="let event of row"
                                    class="event-container"
                                    [style.visibility]="event.isPlaceholder ? 'hidden' : 'visible'"
                                    (click)="toggleExpandTimeSlot(timeSlot, event)"
                                  >
                                    <div *ngIf="!event.isPlaceholder" class="event-card" [ngClass]="'event-status-' + event.status">
                                      <div class="event-icons">
                                        <span class="event-icon">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="2" y="3" width="20" height="18" rx="2" ry="2"></rect>
                                            <line x1="8" y1="3" x2="8" y2="21"></line>
                                            <line x1="16" y1="3" x2="16" y2="21"></line>
                                            <line x1="2" y1="9" x2="22" y2="9"></line>
                                            <line x1="2" y1="15" x2="22" y2="15"></line>
                                          </svg>
                                        </span>
                                        <span class="event-icon">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                                          </svg>
                                        </span>
                                      </div>
                                      <div class="event-content">
                                        <div class="event-title">{{ event.title }}</div>
                                        <div class="event-reference">
                                          <span class="ref-symbol">#</span> {{ event.refNumber }}
                                        </div>
                                      </div>
                                      <div class="event-status">{{ event.status }}</div>
                                    </div>
                                  </div>
                                </div>
                              </ng-container>
                            </ng-container>
                          </div>
                        </div>
                      </div>
                    </ng-container>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Find Units Section - Only visible when expanded, takes 3 cols -->
        <div class="find-units-section" *ngIf="expandedTimeSlot !== null">
          <div class="section-content">
            <h3>Find Units</h3>
            
            <div class="search-box">
              <input type="text" pInputText placeholder="Search Fleet..." />
            </div>
            
            <div class="units-list">
              <div class="unit-card" *ngFor="let unit of units">
                <div class="available-tag">Available</div>
                <div class="unit-distance">{{ unit.distance }}</div>
                <div class="unit-title">{{ unit.type }} - {{ unit.year }}</div>
                <div class="unit-description">{{ unit.description }}</div>
                
                <div class="unit-image">
                  <img [src]="unit.imageUrl" alt="{{ unit.type }}" />
                </div>
                
                <div class="unit-details">
                  <div class="detail-group">
                    <div class="detail-label">Rental Status</div>
                    <div class="detail-value">{{ unit.rentalStatus }}</div>
                  </div>
                  
                  <div class="detail-group">
                    <div class="detail-label">PM Date</div>
                    <div class="detail-value">{{ unit.pmDate }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Customer Details Section - Only visible when expanded, takes 4 cols -->
        <div class="customer-details-section" *ngIf="expandedTimeSlot !== null">
        <div class="close-expanded-view" (click)="closeExpandedView()">
        <i class="pi pi-times"></i>
        </div>
          <div class="section-content">
            <div class="customer-header">
              <div class="customer-avatar">
                <div class="avatar-circle">JS</div>
                <span class="phone-icon"></span>
              </div>
              <div class="customer-info">
                <h3>Lorem</h3>
                <div class="customer-id"># #78432G</div>
              </div>
            </div>
            
            <div class="tab-navigation">
              <div class="tab active">Reservation</div>
              <div class="tab">Truck Info</div>
            </div>
            
            <div class="customer-details">
              <div class="detail-section">
                <h4>Notes</h4>
                <p class="note-content">
                  Lorem ipsum dolor sit amet consectetur. Blandit metus convallis ut vestibulum sit. Mi netus massa libero viverra laoreet ornare nibh. Molestie malesuada pretium purus con...
                </p>
              </div>
              
              <div class="info-grid">
                <div class="info-row">
                  <div class="info-label">Type</div>
                  <div class="info-value"></div>
                </div>
                
                <div class="info-row">
                  <div class="info-label">Length & Height</div>
                  <div class="info-value"></div>
                </div>
                
                <div class="info-row">
                  <div class="info-label">Towing</div>
                  <div class="info-value"></div>
                </div>
                
                <div class="info-row">
                  <div class="info-label">Trip Type</div>
                  <div class="info-value"></div>
                </div>
                
                <div class="info-row">
                  <div class="info-label">Insurance</div>
                  <div class="info-value">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polygon points="21 15 16 10 5 21"></polygon>
                    </svg>
                  </div>
                </div>
                
                <div class="info-row">
                  <div class="info-label">Rental</div>
                  <div class="info-value"></div>
                </div>
                
                <div class="info-row">
                  <div class="info-label">Duration</div>
                  <div class="info-value"></div>
                </div>
                
                <div class="info-row">
                  <div class="info-label">Distance</div>
                  <div class="info-value"></div>
                </div>
              </div>
              
              <div class="location-section">
                <div class="location-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 3h15v13H1z"></path>
                    <path d="M16 8h4v11H5v-4"></path>
                  </svg>
                  <h4>Pickup Location</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        width: 100%;
        height: calc(100vh - 60px); /* Adjust the 60px based on your header height */
        margin: 0 auto;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        transition: all 0.3s ease;
        background-color: #ffffff;
        overflow: hidden;
      }
      
      .grid-system {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        gap: 15px; /* Added gap between panels */
      }
      
      /* --- Main Accordion Section --- */
      .accordion-section {
        width: 100%; /* 12 columns by default */
        padding: 15px;
        transition: all 0.3s ease;
        background-color: #ffffff;
        height: 100%;
        overflow: auto; /* Enable scrolling */
        scrollbar-width: thin; /* Firefox */
        scrollbar-color: rgba(0, 0, 0, 0.2) transparent; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
      }
      
      /* Mac-style scrollbar for Windows */
      .accordion-section::-webkit-scrollbar {
        width: 8px;
        background-color: transparent;
        opacity: 0;
      }
      
      .accordion-section::-webkit-scrollbar-track {
        background-color: transparent;
      }
      
      .accordion-section::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: content-box;
      }
      
      .accordion-section:hover::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.25);
      }
      
      /* Only show scrollbar on hover/scroll for Windows */
      .accordion-section:not(:hover):not(:focus)::-webkit-scrollbar-thumb {
        opacity: 0;
        visibility: hidden;
      }
      
      .accordion-section.grid-5 {
        width: calc(41.66% - 15px); /* 5/12 columns when expanded, accounting for gap */
        background-color: #ffffff;
      }
      
      h2 {
        margin-bottom: 20px;
        color: #333;
        font-size: 22px;
      }
      
      .accordion-container {
        width: 100%;
      }
      
      .accordion-item {
        margin-bottom: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
        overflow: hidden;
      }
      
      .accordion-header {
        display: flex;
        align-items: center;
        background-color: #e3f2fd;
        height: 30px;
        padding: 0 10px;
        cursor: pointer;
        user-select: none;
      }
      
      .accordion-header.active {
        background-color: #bbdefb;
      }
      
      .toggle-icon {
        display: flex;
        align-items: center;
        margin-right: 10px;
      }
      
      .icon {
        font-size: 12px;
      }
      
      .header-text {
        font-weight: 500;
      }
      
      .accordion-content {
        overflow: hidden;
      }
      
      /* --- Schedule Styles --- */
      .schedule-container {
        width: 100%;
        margin: 0 auto;
        overflow-x: hidden;
        background-color: #ffffff;
      }
      
      .schedule-grid {
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      
      .time-row {
        display: flex;
        width: 100%;
        border-bottom: 1px solid #e9ecef;
        min-height: 60px;
        transition: all 0.3s ease;
      }
      
      .time-row.expanded {
        background-color: #f8f9fa;
      }
      
      .time-cell {
        width: 80px;
        min-width: 80px;
        font-weight: bold;
        padding: 0.75rem 0.5rem;
        display: flex;
        align-items: flex-start;
        border-right: 1px solid #e9ecef;
      }
      
      .events-cell {
        flex: 1;
        padding: 0.5rem;
        overflow: hidden;
      }
      
      .events-wrapper {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      /* --- Event Grid Layout --- */
      .event-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 10px;
        width: 100%;
      }
      
      /* --- Event Vertical Column Layout --- */
      .event-column {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 10px;
      }
      
      .event-container {
        min-width: 0;
        cursor: pointer;
        transition: transform 0.2s ease;
      }
      
      .event-column .event-container {
        width: 100%;
      }
      
      .event-container:hover {
        transform: translateY(-2px);
      }
      
      /* --- Event Card Styling --- */
      .event-card {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        background-color: #ffffff;
        border: 1px solid #dce3eb;
        border-radius: 6px;
        height: 100%;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        transition: box-shadow 0.2s ease;
      }
      
      .event-card:hover {
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      
      .event-icons {
        display: flex;
        margin-right: 10px;
      }
      
      .event-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 4px;
        color: #666;
      }
      
      .event-content {
        flex: 1;
        min-width: 0;
      }
      
      .event-title {
        font-weight: 500;
        color: #0a2472;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .event-reference {
        font-size: 12px;
        color: #666666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .ref-symbol {
        color: #888;
      }
      
      .event-status {
        font-size: 11px;
        font-weight: 500;
        text-transform: capitalize;
        margin-left: 8px;
        white-space: nowrap;
      }
      
      /* --- Status-specific styles --- */
      .event-status-confirmed {
        border-left: 3px solid #28a745;
      }
      
      .event-status-confirmed .event-status {
        color: #28a745;
      }
      
      .event-status-pending {
        border-left: 3px solid #ffc107;
      }
      
      .event-status-pending .event-status {
        color: #ffc107;
      }
      
      .event-status-cancelled {
        border-left: 3px solid #dc3545;
      }
      
      .event-status-cancelled .event-status {
        color: #dc3545;
      }
      
      .event-status-voided {
        border-left: 3px solid #dc3545;
      }
      
      .event-status-voided .event-status {
        color: #dc3545;
      }
      
      /* --- Find Units Section --- */
      .find-units-section {
        width: calc(25% - 15px); /* 3/12 columns, accounting for gap */
        padding: 15px;
        border-left: 1px solid #e9ecef;
        background-color: #ffffff;
        height: 100%;
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        -ms-overflow-style: none; /* IE and Edge */
      }
      
      /* Mac-style scrollbar for Windows */
      .find-units-section::-webkit-scrollbar {
        width: 8px;
        background-color: transparent;
        opacity: 0;
      }
      
      .find-units-section::-webkit-scrollbar-track {
        background-color: transparent;
      }
      
      .find-units-section::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: content-box;
      }
      
      .find-units-section:hover::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.25);
      }
      
      /* Only show scrollbar on hover/scroll for Windows */
      .find-units-section:not(:hover):not(:focus)::-webkit-scrollbar-thumb {
        opacity: 0;
        visibility: hidden;
      }
      
      .find-units-section h3 {
        font-size: 18px;
        margin-bottom: 15px;
        color: #333;
      }
      
      .search-box {
        margin-bottom: 20px;
      }
      
      .search-box input {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .units-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      
      .unit-card {
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 12px;
        background-color: #fff;
        position: relative;
      }
      
      .available-tag {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background-color: #e8f5e9;
        color: #2e7d32;
        text-align: center;
        font-size: 14px;
        padding: 4px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }
      
      .unit-distance {
        margin-top: 25px;
        font-size: 14px;
        color: #666;
      }
      
      .unit-title {
        font-size: 16px;
        font-weight: 500;
        color: #0a2472;
        margin: 5px 0;
      }
      
      .unit-description {
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
      }
      
      .unit-image {
        width: 100%;
        height: 120px;
        display: flex;
        justify-content: center;
        margin: 10px 0;
      }
      
      .unit-image img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      
      .unit-details {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
      }
      
      .detail-group {
        flex: 1;
      }
      
      .detail-label {
        font-size: 12px;
        color: #666;
      }
      
      .detail-value {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }
      
      /* --- Customer Details Section --- */
      .customer-details-section {
        width: calc(33.33% - 15px); /* 4/12 columns, accounting for gap */
        padding: 15px;
        border-left: 1px solid #e9ecef;
        position: relative;
        height: 100%;
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        -ms-overflow-style: none; /* IE and Edge */
      }
      
      /* Mac-style scrollbar for Windows */
      .customer-details-section::-webkit-scrollbar {
        width: 8px;
        background-color: transparent;
        opacity: 0;
      }
      
      .customer-details-section::-webkit-scrollbar-track {
        background-color: transparent;
      }
      
      .customer-details-section::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: content-box;
      }
      
      .customer-details-section:hover::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.25);
      }
      
      /* Only show scrollbar on hover/scroll for Windows */
      .customer-details-section:not(:hover):not(:focus)::-webkit-scrollbar-thumb {
        opacity: 0;
        visibility: hidden;
      }
      
      .customer-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .customer-avatar {
        position: relative;
        margin-right: 15px;
      }
      
      .avatar-circle {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #3f51b5;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 500;
      }
      
      .phone-icon {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 24px;
        height: 24px;
        background-color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #ddd;
      }
      
      .customer-info h3 {
        font-size: 18px;
        margin: 0 0 5px 0;
      }
      
      .customer-id {
        font-size: 14px;
        color: #666;
      }
      
      .tab-navigation {
        display: flex;
        border-bottom: 1px solid #ddd;
        margin-bottom: 20px;
      }
      
      .tab {
        padding: 10px 15px;
        font-size: 14px;
        cursor: pointer;
      }
      
      .tab.active {
        font-weight: 500;
        border-bottom: 2px solid #3f51b5;
        color: #3f51b5;
      }
      
      .detail-section {
        margin-bottom: 20px;
      }
      
      .detail-section h4 {
        font-size: 16px;
        margin-bottom: 10px;
        color: #333;
      }
      
      .note-content {
        font-size: 14px;
        color: #666;
        line-height: 1.5;
      }
      
      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-bottom: 20px;
      }
      
      .info-row {
        display: flex;
        flex-direction: column;
      }
      
      .info-label {
        font-size: 14px;
        color: #666;
        margin-bottom: 5px;
      }
      
      .info-value {
        font-size: 16px;
        color: #333;
        min-height: 20px;
      }
      
      .location-section {
        margin-top: 20px;
      }
      
      .location-header {
        display: flex;
        align-items: center;
      }
      
      .location-header svg {
        margin-right: 10px;
        color: #444;
      }
      
      .location-header h4 {
        font-size: 16px;
        margin: 0;
      }
      
      /* --- Responsive Styles --- */
      @media screen and (max-width: 992px) {
        .accordion-section.grid-5 {
          width: 100%;
        }
        
        .find-units-section,
        .customer-details-section {
          width: calc(50% - 7.5px);
        }
        
        .grid-system {
          flex-direction: column;
        }
      }
      
      @media screen and (max-width: 768px) {
        .dashboard-container {
          height: auto;
          min-height: 100vh;
        }
        
        .accordion-section.grid-5,
        .find-units-section,
        .customer-details-section {
          width: 100%;
          height: auto;
          max-height: 50vh;
        }
        
        .event-row {
          grid-template-columns: 1fr;
        }
      }

      /* Close button styles */
      .close-expanded-view {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 100;
      }
      
      .close-expanded-view:hover {
        background-color: #e9ecef;
      }
      
      /* Positioning for the close button in the customer section */
      .customer-details-section {
        position: relative;
      }
      .highlight-time-slot {
      background-color: rgba(63, 81, 181, 0.2);
      transition: background-color 0.5s ease;
    }
    
    .highlight-time-slot .time-cell {
      font-weight: bold;
      color: #3f51b5;
    }
    .accordion-header {
      position: sticky;
      top: 0;
      z-index: 10;
      background-color: #e3f2fd;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .accordion-header.active {
      background-color: #bbdefb;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }
    
    /* Highlight styles for current time slot */
    .highlight-time-slot {
      background-color: rgba(63, 81, 181, 0.2);
      transition: background-color 0.5s ease;
    }
    
    .highlight-time-slot .time-cell {
      font-weight: bold;
      color: #3f51b5;
    }

        /* Make sure the accordion section has proper scroll context */
        .accordion-section {
      width: 100%; /* 12 columns by default */
      padding: 15px;
      transition: all 0.3s ease;
      background-color: #ffffff;
      height: 100%;
      overflow: auto !important; /* Force overflow auto */
      scrollbar-width: thin; /* Firefox */
      scrollbar-color: rgba(0, 0, 0, 0.2) transparent; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
      position: relative; /* Create positioning context */
    }
    
    /* Enhanced sticky accordion header styles */
    .accordion-header {
      position: sticky !important; /* Force sticky positioning */
      top: 0 !important; /* Force top position */
      z-index: 100 !important; /* Higher z-index to ensure it's above other elements */
      background-color: #e3f2fd !important; /* Ensure background is opaque */
      box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
      margin-bottom: 0 !important; /* Remove any margin that might affect stickiness */
      width: 100% !important; /* Ensure full width */
    }
    
    /* Make sure there's no margin/padding interfering with the accordion items */
    .accordion-item {
      margin-bottom: 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
      overflow: hidden;
      display: block; /* Ensure block display */
    }
    
    /* Active header styling */
    .accordion-header.active {
      background-color: #bbdefb !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15) !important;
    }
    
    /* Highlight styles for current time slot */
    .highlight-time-slot {
      background-color: rgba(63, 81, 181, 0.2);
      transition: background-color 0.5s ease;
    }
    
    .highlight-time-slot .time-cell {
      font-weight: bold;
      color: #3f51b5;
    }
    `,
  ],
  animations: [
    trigger('collapseAnimation', [
      state(
        'open',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      state(
        'closed',
        style({
          height: '0',
          opacity: 0,
        })
      ),
      transition('open <=> closed', [animate('250ms ease-in-out')]),
    ]),
  ],
})
export class ReservationsDashboardComponent implements OnInit {
  // Sample accordion items
  accordionItems: AccordionItem[] = [
    {
      header: 'Header I',
      content: 'Content for accordion item 1',
      isOpen: true,
    },
    {
      header: 'Header II',
      content: 'Content for accordion item 2',
      isOpen: false,
    },
  ];

  // Track which time slot is expanded
  expandedTimeSlot: string | null = '01:00';

  constructor() {}

  ngOnInit(): void {
    this.updateScreenSize(window.innerWidth);
    if (!this.accordionItems.some(item => item.isOpen)) {
      this.accordionItems[0].isOpen = true;
    }
    setTimeout(() => {
      this.checkStickyHeaderStatus();
      this.scrollToCurrentTimeSlot();
      
        }, 500);
  }

  toggleItem(index: number): void {
    this.accordionItems[index].isOpen = !this.accordionItems[index].isOpen;
  }

  /**
   * Toggle the expanded state of a time slot
   */
  toggleExpandTimeSlot(timeSlot: string, event: Event): void {
    if (event.isPlaceholder) return;
    
    if (this.expandedTimeSlot !== null) {
      // If already expanded, collapse everything
      this.expandedTimeSlot = null;
    } else {
      // If not expanded, set the clicked time slot as expanded
      // This will now trigger all time slots to show in vertical mode
      this.expandedTimeSlot = timeSlot;
    }
  }

  timeSlots: string[] = ['1:00am', '2:00am', '3:00am','4:00am','5:00am',];
  
  events: { [key: string]: Event[] } = {
    '1:00am': [
      { id: 1, title: 'Albert Flora', refNumber: '98762319', status: 'voided' },
      { id: 2, title: 'John Smith', refNumber: '24589631', status: 'confirmed' },
      { id: 3, title: 'Maria Garcia', refNumber: '78453621', status: 'pending' },
      { id: 4, title: 'Robert Johnson', refNumber: '36521478', status: 'confirmed' },
      { id: 5, title: 'Sarah Wilson', refNumber: '12369854', status: 'cancelled' },
      { id: 6, title: 'David Thompson', refNumber: '45698732', status: 'pending' },
      { id: 7, title: 'Jennifer Adams', refNumber: '78965412', status: 'confirmed' },
      { id: 8, title: 'Michael Brown', refNumber: '32145698', status: 'voided' },
      { id: 9, title: 'Emily Wilson', refNumber: '15975364', status: 'confirmed' },
    ],
    '2:00am': [
      { id: 10, title: 'James Williams', refNumber: '78965321', status: 'confirmed' },
      { id: 11, title: 'Emma Davis', refNumber: '12398745', status: 'pending' }
    ],
    '3:00am': [
      { id: 12, title: 'Christopher Lee', refNumber: '65432198', status: 'voided' }
    ],
    '4:00am': [
      { id: 99, title: 'Albert Flora2', refNumber: '98762319', status: 'voided' },
      { id: 22, title: 'John Smith2', refNumber: '24589631', status: 'confirmed' },
      { id: 33, title: 'Maria Garcia3', refNumber: '78453621', status: 'pending' },
      { id: 44, title: 'Robert Johnson2', refNumber: '36521478', status: 'confirmed' },
      { id: 55, title: 'Sarah Wilson2', refNumber: '12369854', status: 'cancelled' },
      { id: 66, title: 'David Thompson2', refNumber: '45698732', status: 'pending' },
      { id: 77, title: 'Jennifer Adams2', refNumber: '78965412', status: 'confirmed' },
      { id: 88, title: 'Michael Brown2', refNumber: '32145698', status: 'voided' },
      { id: 99, title: 'Emily Wilson2', refNumber: '15975364', status: 'confirmed' },
    ],
    '5:00am': [
      { id: 144, title: 'Albert Flora44', refNumber: '98762319', status: 'voided' },
      { id: 244, title: 'John Smith44', refNumber: '24589631', status: 'confirmed' },
      { id: 344, title: 'Maria Garcia44', refNumber: '78453621', status: 'pending' },
      { id: 444, title: 'Robert Johnson44', refNumber: '36521478', status: 'confirmed' },
      { id: 544, title: 'Sarah Wilson44', refNumber: '12369854', status: 'cancelled' },
      { id: 644, title: 'David Thompson44', refNumber: '45698732', status: 'pending' },
      { id: 744, title: 'Jennifer Adams44', refNumber: '78965412', status: 'confirmed' },
      { id: 844, title: 'Michael Brown44', refNumber: '32145698', status: 'voided' },
      { id: 944, title: 'Emily Wilson44', refNumber: '15975364', status: 'confirmed' },
    ],
  };
  
  // Sample units data
  units: Unit[] = [
    {
      id: 1,
      type: "18' Flatbed Truck",
      year: "2023",
      distance: "2.4 miles away",
      description: "lorem TestData,sample 19898",
      rentalStatus: "Ready Line",
      pmDate: "02/27/25",
      imageUrl: "assets/flatbed-truck.png"
    },
    {
      id: 2,
      type: "26' Flatbed Truck",
      year: "2023",
      distance: "2.4 miles away",
      description: "lorem TestData,sample 19898",
      rentalStatus: "Ready Line",
      pmDate: "02/27/25",
      imageUrl: "assets/flatbed-truck.png"
    }
  ];
  
  // Configuration for event display
  maxEventsPerRow: number = 3;
  
  // Responsive configuration for different screen sizes
  screenSize: string = 'desktop';
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateScreenSize(window.innerWidth);
  }
  
  /**
   * Update screen size category based on width
   */
  updateScreenSize(width: number): void {
    if (width <= 576) {
      this.screenSize = 'mobile';
      this.maxEventsPerRow = 1;
    } else if (width <= 768) {
      this.screenSize = 'tablet';
      this.maxEventsPerRow = 2;
    } else if (width <= 992) {
      this.screenSize = 'desktop-small';
      this.maxEventsPerRow = 3;
    } else {
      this.screenSize = 'desktop';
      this.maxEventsPerRow = 3;
    }
  }

  /**
   * Get events organized in rows with consistent column structure
   */
  getEventRows(timeSlot: string): any[][] {
    const timeEvents = this.events[timeSlot];
    if (!timeEvents) return [];

    // Always use the configured column count
    const columns = this.maxEventsPerRow;
    
    const rows: any[][] = [];
    
    // Split events into chunks
    for (let i = 0; i < timeEvents.length; i += columns) {
      // Get events for this row
      const rowEvents = timeEvents.slice(i, i + columns);
      
      // If we don't have enough events to fill the row, add empty placeholder objects
      while (rowEvents.length < columns) {
        rowEvents.push({ id: -1, title: '', refNumber: '', status: 'confirmed', isPlaceholder: true });
      }
      
      rows.push(rowEvents);
    }
    
    return rows;
  }

  closeExpandedView(): void {
    this.expandedTimeSlot = null;
  }
  scrollToCurrentTimeSlot(): void {
    // Get current time
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    
    console.log(`Current time: ${currentHour}:${currentMinute}`);
    
    // Find the time slot closest to current time
    let closestTimeSlot: string | null = null;
    let minTimeDifference = Infinity;
    
    this.timeSlots.forEach(timeSlot => {
      // Parse the time slot (format: "1:00am", "2:00am", etc.)
      const matches = timeSlot.match(/(\d+):(\d+)(am|pm)/i);
      
      if (matches) {
        let hour = parseInt(matches[1], 10);
        const minute = parseInt(matches[2], 10);
        const period = matches[3].toLowerCase();
        
        // Convert to 24-hour format
        if (period === 'pm' && hour < 12) {
          hour += 12;
        } else if (period === 'am' && hour === 12) {
          hour = 0;
        }
        
        // Calculate absolute time difference in minutes
        const slotTotalMinutes = (hour * 60) + minute;
        const currentTotalMinutes = (currentHour * 60) + currentMinute;
        const timeDifferenceMinutes = Math.abs(slotTotalMinutes - currentTotalMinutes);
        
        console.log(`Time slot: ${timeSlot}, 24h format: ${hour}:${minute}, diff: ${timeDifferenceMinutes} minutes`);
        
        // Find the slot with minimum time difference
        if (timeDifferenceMinutes < minTimeDifference) {
          minTimeDifference = timeDifferenceMinutes;
          closestTimeSlot = timeSlot;
        }
      }
    });
    
    console.log(`Closest time slot: ${closestTimeSlot}, difference: ${minTimeDifference} minutes`);
    
    // Scroll to the closest time slot
    if (closestTimeSlot) {
      this.scrollToTimeSlot(closestTimeSlot);
    }
  }
  
  /**
   * Scrolls to a specific time slot
   */
  scrollToTimeSlot(timeSlot: string): void {
    // Find the time slot element
    setTimeout(() => {
      const timeSlotElements = document.querySelectorAll('.time-cell');
      let targetElement: Element | null |any = null;
      
      timeSlotElements.forEach(element => {
        if (element.textContent && element.textContent.trim() === timeSlot) {
          targetElement = element;
          console.log(`Found target element for time slot: ${timeSlot}`);
        }
      });
      
      if (targetElement) {
        // Try to find the closest accordion content container
        const accordionContent:any = targetElement instanceof Element ? 
          targetElement.closest('.accordion-content') : null;
        // Get parent accordion section for scrolling
        const accordionSection = document.querySelector('.accordion-section');
        
        if (accordionSection) {
          // Get the accordion header height more dynamically
          const accordionHeader = document.querySelector('.accordion-header');
          const headerHeight = accordionHeader ? accordionHeader.clientHeight : 30;
          
          // Calculate scroll position, accounting for sticky header height
          const targetTop = (targetElement as HTMLElement).getBoundingClientRect().top;
          const sectionTop = accordionSection.getBoundingClientRect().top;
          const relativePosition = targetTop - sectionTop;
          
          console.log(`Header height: ${headerHeight}, Target position: ${relativePosition}`);
          
          // Scroll to the element with smooth behavior
          accordionSection.scrollTo({
            top: accordionSection.scrollTop + relativePosition - headerHeight - 10,
            behavior: 'smooth'
          });
          
          // Highlight the time slot temporarily
          this.highlightTimeSlot(targetElement as HTMLElement);
        }
      }
    }, 500); // Increased delay to ensure DOM is fully ready
  }
  
  
  /**
   * Briefly highlights a time slot for visual feedback
   */
  highlightTimeSlot(element: HTMLElement): void {
    // Find the parent row element to highlight the entire row
    const timeRow = element.closest('.time-row');
    
    if (timeRow) {
      // Add a highlight class
      timeRow.classList.add('highlight-time-slot');
      
      // Remove the highlight after a short delay
      setTimeout(() => {
        timeRow.classList.remove('highlight-time-slot');
      }, 3000);
    }
  }

  checkStickyHeaderStatus(): void {
    console.log('Checking sticky header status...');
    
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach((header, index) => {
      const styles = window.getComputedStyle(header);
      console.log(`Header ${index}:`);
      console.log(`- position: ${styles.position}`);
      console.log(`- top: ${styles.top}`);
      console.log(`- z-index: ${styles.zIndex}`);
      
      // Check if parent has scroll
      const parent = header.parentElement;
      if (parent) {
        const parentStyles = window.getComputedStyle(parent);
        console.log(`- parent overflow: ${parentStyles.overflow}`);
        console.log(`- parent height: ${parentStyles.height}`);
        console.log(`- parent position: ${parentStyles.position}`);
      }
    });
  }

  
  
  

}