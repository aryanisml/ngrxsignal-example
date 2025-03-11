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
    InputTextModule,
  ],
  template: `
    <!-- Template for reservations-dashboard.component.ts -->
    <div
      class="dashboard-container"
      [class.expanded-view]="expandedTimeSlot !== null"
    >
      <div class="grid-system">
        <!-- Main Accordion - Takes 12 cols by default, 5 when expanded -->
        <div
          class="accordion-section"
          [class.grid-5]="expandedTimeSlot !== null"
        >
          <!-- Custom Accordion -->
          <div class="accordion-container">
            <div
              class="accordion-item"
              *ngFor="let item of accordionItems; let i = index"
            >
              <!-- Accordion Header -->
              <div
                class="accordion-header"
                [class.active]="item.isOpen"
                (click)="toggleItem(i)"
              >
                <div class="toggle-icon">
                <svg *ngIf="!item.isOpen" class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
    <!-- Down-pointing arrow (when open) -->
    <svg *ngIf="item.isOpen" class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
                </div>
                <div class="header-text">
                  {{ item.header }} <span class="font-bold">Reading</span>
                </div>
              </div>
              <div *ngIf="stickyWarningTimeSlot" class="global-warning-message" >
                <div class="warning-content">
                  <i class="warning-icon">⚠️</i>
                  <span
                    >Please check availability before making a reservation</span
                  >
                  <span class="time-slot-ref">{{ stickyWarningTimeSlot }}</span>
                  <span
                    class="close-warning"
                    (click)="clearStickyWarning($event)"
                    >✕</span
                  >
                </div>
              </div>

              <!-- Accordion Content -->
              <div
                class="accordion-content"
                [@collapseAnimation]="item.isOpen ? 'open' : 'closed'"
              >
                <!-- Schedule Container -->
                <div class="schedule-container">
                  <div class="schedule-grid">
                    <ng-container *ngFor="let timeSlot of timeSlots">
                      <!-- Warning appears only above the current time slot -->
                      <div
                        *ngIf="
                          isCurrentTimeSlot(timeSlot) &&
                          !isWarningStickyFor(timeSlot)
                        "
                        class="time-slot-inline-warning"
                        (click)="toggleStickyWarning(timeSlot, $event)"
                      >
                        <div class="warning-content">
                          <i class="warning-icon">⚠️</i>
                          <span>
                            <strong>{{ getUnconfirmedCount(timeSlot) }}</strong>
                            unconfirmed
                            {{
                              getUnconfirmedCount(timeSlot) === 1
                                ? 'reservation'
                                : 'reservations'
                            }}
                            for this time slot
                          </span>
                          <span class="count-badge">{{
                            getUnconfirmedCount(timeSlot)
                          }}</span>
                        </div>
                      </div>

                      <!-- Time Row -->
                      <div
                        class="time-row"
                        [class.expanded]="expandedTimeSlot !== null"
                        [class.current-time-slot]="isCurrentTimeSlot(timeSlot)"
                        [attr.data-time-slot]="timeSlot"
                      >
                        <div class="time-cell">{{ timeSlot }}</div>
                        <div class="events-cell">
                          <div class="events-wrapper">
                            <!-- Expanded View: Vertical Column Layout -->
                            <ng-container *ngIf="expandedTimeSlot !== null">
                              <div class="event-column">
                                <div
                                  *ngFor="let event of events[timeSlot]"
                                  class="event-container"
                                  (click)="
                                    toggleExpandTimeSlot(timeSlot, event)
                                  "
                                >
                                  <div
                                    class="event-card"
                                    [ngClass]="'event-status-' + event.status"
                                  >
                                    <div class="event-icons">
                                      <span class="event-icon">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="18"
                                          height="18"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          stroke-width="2"
                                        >
                                          <rect
                                            x="2"
                                            y="3"
                                            width="20"
                                            height="18"
                                            rx="2"
                                            ry="2"
                                          ></rect>
                                          <line
                                            x1="8"
                                            y1="3"
                                            x2="8"
                                            y2="21"
                                          ></line>
                                          <line
                                            x1="16"
                                            y1="3"
                                            x2="16"
                                            y2="21"
                                          ></line>
                                          <line
                                            x1="2"
                                            y1="9"
                                            x2="22"
                                            y2="9"
                                          ></line>
                                          <line
                                            x1="2"
                                            y1="15"
                                            x2="22"
                                            y2="15"
                                          ></line>
                                        </svg>
                                      </span>
                                      <span class="event-icon">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="18"
                                          height="18"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          stroke-width="2"
                                        >
                                          <path
                                            d="M5 12h14M12 5l7 7-7 7"
                                          ></path>
                                        </svg>
                                      </span>
                                    </div>
                                    <div class="event-content">
                                      <div class="event-title">
                                        {{ event.title }}
                                      </div>
                                      <div class="event-reference">
                                        <span class="ref-symbol">#</span>
                                        {{ event.refNumber }}
                                      </div>
                                    </div>
                                    <div class="event-status">
                                      {{ event.status }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </ng-container>

                            <!-- Collapsed View: Grid Layout -->
                            <ng-container *ngIf="expandedTimeSlot === null">
                              <ng-container
                                *ngFor="let row of getEventRows(timeSlot)"
                              >
                                <div class="event-row">
                                  <div
                                    *ngFor="let event of row"
                                    class="event-container"
                                    [style.visibility]="
                                      event.isPlaceholder ? 'hidden' : 'visible'
                                    "
                                    (click)="
                                      toggleExpandTimeSlot(timeSlot, event)
                                    "
                                  >
                                    <div
                                      *ngIf="!event.isPlaceholder"
                                      class="event-card"
                                      [ngClass]="'event-status-' + event.status"
                                    >
                                      <div class="event-icons">
                                        <span class="event-icon">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                          >
                                            <rect
                                              x="2"
                                              y="3"
                                              width="20"
                                              height="18"
                                              rx="2"
                                              ry="2"
                                            ></rect>
                                            <line
                                              x1="8"
                                              y1="3"
                                              x2="8"
                                              y2="21"
                                            ></line>
                                            <line
                                              x1="16"
                                              y1="3"
                                              x2="16"
                                              y2="21"
                                            ></line>
                                            <line
                                              x1="2"
                                              y1="9"
                                              x2="22"
                                              y2="9"
                                            ></line>
                                            <line
                                              x1="2"
                                              y1="15"
                                              x2="22"
                                              y2="15"
                                            ></line>
                                          </svg>
                                        </span>
                                        <span class="event-icon">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                          >
                                            <path
                                              d="M5 12h14M12 5l7 7-7 7"
                                            ></path>
                                          </svg>
                                        </span>
                                      </div>
                                      <div class="event-content">
                                        <div class="event-title">
                                          {{ event.title }}
                                        </div>
                                        <div class="event-reference">
                                          <span class="ref-symbol">#</span>
                                          {{ event.refNumber }}
                                        </div>
                                      </div>
                                      <div class="event-status">
                                        {{ event.status }}
                                      </div>
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

        <!-- Find Units Section - Only visible when expanded -->
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

        <!-- Customer Details Section - Only visible when expanded -->
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
                  Lorem ipsum dolor sit amet consectetur. Blandit metus
                  convallis ut vestibulum sit. Mi netus massa libero viverra
                  laoreet ornare nibh. Molestie malesuada pretium purus con...
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
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
      /* CSS for reservations-dashboard.component.ts */

      /* === Main Layout === */
      .dashboard-container {
        width: 100%;
        height: calc(100vh - 60px);
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
        gap: 15px;
      }

      /* === Accordion Section === */
      .accordion-section {
        width: 100%;
        padding: 15px;
        transition: all 0.3s ease;
        background-color: #ffffff;
        height: 100%;
        overflow: auto !important;
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        position: relative;
      }

      .accordion-section::-webkit-scrollbar {
        width: 8px;
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

      .accordion-section.grid-5 {
        width: calc(41.66% - 15px);
      }

      .accordion-container {
        width: 100%;
      }

      .accordion-item {
        margin-bottom: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
        overflow: hidden;
        display: block;
      }

      .accordion-header {
        display: flex;
        align-items: center;
        background-color: #e3f2fd;
        height: 30px;
        padding: 0 10px;
        cursor: pointer;
        user-select: none;
        position: sticky !important;
        top: 0 !important;
        z-index: 100 !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        width: 100% !important;
      }

      .accordion-header.active {
        background-color: #bbdefb !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
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

      /* === Schedule Grid === */
      .schedule-container {
        width: 100%;
        margin: 0 auto;
        overflow-x: hidden;
        background-color: #ffffff;
        position: relative;
        z-index: 1;
      }

      .schedule-grid {
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      /* === Time Slots === */
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

      /* === Warning Message === */
      /* Styles for the warning message */
      /* Style for the global warning that appears at the top */
      /* Enhanced styles for the warnings with count badge */

      /* Count badge styles */
      .count-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        height: 24px;
        background-color: #dc3545;
        color: white;
        font-weight: bold;
        font-size: 12px;
        border-radius: 12px;
        padding: 0 6px;
        margin-left: 10px;
        line-height: 1;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }

      /* Time slot inline warning with enhanced content */
      .time-slot-inline-warning {
        background-color: #fff3cd;
        border: 1px solid #ffeeba;
        border-left: 4px solid #ffc107;
        color: #856404;
        padding: 10px 15px;
        margin-bottom: 5px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        font-size: 14px;
        font-weight: 500;
        width: 100%;
        animation: fadeIn 0.5s ease-in-out;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
      }

      .time-slot-inline-warning:hover {
        background-color: #ffecb5;
        transform: translateY(-1px);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
      }

      .time-slot-inline-warning .warning-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .time-slot-inline-warning .warning-icon {
        margin-right: 10px;
        font-size: 16px;
      }

      /* Global warning message with enhanced content */
      .global-warning-message {
        position: sticky;
        top: 30px; /* Just below the accordion header */
        z-index: 90;
        background-color: #fff8e1;
        border: 1px solid #ffeeba;
        border-left: 4px solid #ff9800;
        color: #856404;
        padding: 10px 15px;
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
        font-size: 14px;
        font-weight: 500;
        width: calc(100% - 2px);
        animation: slideDown 0.3s ease-out;
      }

      .global-warning-message .warning-content {
        display: flex;
        align-items: center;
      }

      .global-warning-message .warning-icon {
        margin-right: 10px;
        font-size: 16px;
        flex-shrink: 0;
      }

      .global-warning-message .time-slot-ref {
        font-weight: bold;
        background-color: rgba(255, 255, 255, 0.5);
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 12px;
        margin: 0 4px;
      }

      .global-warning-message .close-warning {
        margin-left: auto;
        cursor: pointer;
        font-size: 16px;
        color: #856404;
        opacity: 0.7;
        transition: opacity 0.2s ease;
        flex-shrink: 0;
        padding-left: 10px;
      }

      .global-warning-message .close-warning:hover {
        opacity: 1;
      }

      /* Animation for the warning appearing */
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Animation for the global warning appearing */
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Responsive adjustments */
      @media screen and (max-width: 768px) {
        .time-slot-inline-warning,
        .global-warning-message {
          padding: 8px 10px;
          font-size: 13px;
        }

        .count-badge {
          min-width: 20px;
          height: 20px;
          font-size: 11px;
        }
      }
      /* Sticky warning styles - positioned at the top */
      .sticky-warning {
        position: sticky !important;
        top: 30px !important; /* Just below the accordion header */
        z-index: 90 !important; /* Below header but above other content */
        margin-bottom: 15px;
        background-color: #fff8e1; /* Slightly different color when sticky */
        border-left: 4px solid #ff9800;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
        animation: pulsateOnce 0.5s ease-in-out;
      }

      /* Animation for when the warning becomes sticky */
      @keyframes pulsateOnce {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.03);
        }
        100% {
          transform: scale(1);
        }
      }

      /* Add a visual indicator showing it's pinned */
      .sticky-warning:after {
        content: '📌';
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }

      .warning-content {
        display: flex;
        align-items: center;
      }

      .warning-icon {
        margin-right: 10px;
        font-size: 16px;
      }

      .time-slot-inline-warning + .time-row {
        margin-top: 2px;
      }

      /* Highlight styles for current time slot */
      .current-time-slot {
        background-color: rgba(63, 81, 181, 0.08);
        border-left: 3px solid #3f51b5;
      }

      .current-time-slot .time-cell {
        font-weight: bold;
        color: #3f51b5;
      }

      /* === Event Layout === */
      .event-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 10px;
        width: 100%;
      }

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

      /* === Event Cards === */
      .event-card {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        background-color: #ffffff;
        border: 1px solid #dce3eb;
        border-radius: 6px;
        height: 100%;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        transition: box-shadow 0.2s ease;
      }

      .event-card:hover {
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

      /* Event status colors */
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

      .event-status-cancelled,
      .event-status-voided {
        border-left: 3px solid #dc3545;
      }

      .event-status-cancelled .event-status,
      .event-status-voided .event-status {
        color: #dc3545;
      }

      /* === Find Units Section === */
      .find-units-section {
        width: calc(25% - 15px);
        padding: 15px;
        border-left: 1px solid #e9ecef;
        background-color: #ffffff;
        height: 100%;
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
      }

      .find-units-section::-webkit-scrollbar {
        width: 8px;
        background-color: transparent;
      }

      .find-units-section::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: content-box;
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

      /* === Customer Details Section === */
      .customer-details-section {
        width: calc(33.33% - 15px);
        padding: 15px;
        border-left: 1px solid #e9ecef;
        position: relative;
        height: 100%;
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
      }

      .customer-details-section::-webkit-scrollbar {
        width: 8px;
        background-color: transparent;
      }

      .customer-details-section::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: content-box;
      }

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

      /* === Responsive Styles === */
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
  stickyWarningTimeSlot: string | null = null;

  // Add this method to check if warning should be sticky for a specific time slot
  isWarningStickyFor(timeSlot: string): boolean {
    return this.stickyWarningTimeSlot === timeSlot;
  }

  /**
   * Toggles the sticky state of a warning message and scrolls it to the top
   */
  toggleStickyWarning(timeSlot: string, event?: MouseEvent): void {
    // Prevent event propagation to avoid triggering other click handlers
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    try {
      // Set the sticky warning time slot
      this.stickyWarningTimeSlot = timeSlot;

      // Force a refresh to update the DOM
      this.forceRefresh();

      // Scroll to the top of the accordion section after a short delay
      setTimeout(() => {
        const accordionSection = document.querySelector('.accordion-section');

        if (accordionSection) {
          // Scroll to the top
          accordionSection.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }, 50);
    } catch (error) {
      console.error('Error making warning sticky:', error);
    }
  }
  clearStickyWarning(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    this.stickyWarningTimeSlot = null;
  }
  // Property to track which time slot should show warning
  currentTimeSlotForWarning: string | null = null;

  // Accordion items data
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

  // Expanded time slot tracking
  expandedTimeSlot: string | null = '01:00';

  // Available time slots
  timeSlots: string[] = ['6:00am', '8:30am', '10:00am', "11:30am", "1:00pm","4:30pm", "5:00pm", "5:30pm","6:00pm"];

  // Event display configuration
  maxEventsPerRow: number = 3;
  screenSize: string = 'desktop';

  // Events data organized by time slot
  events: { [key: string]: Event[] } = {
    "6:00am": [
      {
        "id": 1,
        "title": "Person 1",
        "refNumber": "48176399",
        "status": "cancelled"
      },
      {
        "id": 2,
        "title": "Person 2",
        "refNumber": "75154133",
        "status": "cancelled"
      },
      {
        "id": 3,
        "title": "Person 3",
        "refNumber": "88400987",
        "status": "confirmed"
      },
      {
        "id": 4,
        "title": "Person 4",
        "refNumber": "83424146",
        "status": "pending"
      }
    ],
    "8:30am": [
      {
        "id": 5,
        "title": "Person 5",
        "refNumber": "58587939",
        "status": "cancelled"
      },
      {
        "id": 6,
        "title": "Person 6",
        "refNumber": "77582252",
        "status": "cancelled"
      },
      {
        "id": 7,
        "title": "Person 7",
        "refNumber": "20416926",
        "status": "voided"
      },
      {
        "id": 8,
        "title": "Person 8",
        "refNumber": "30947146",
        "status": "voided"
      },
      {
        "id": 9,
        "title": "Person 9",
        "refNumber": "77094037",
        "status": "confirmed"
      },
      {
        "id": 10,
        "title": "Person 10",
        "refNumber": "48457564",
        "status": "confirmed"
      }
    ],
    "10:00am": [
      {
        "id": 11,
        "title": "Person 11",
        "refNumber": "52293922",
        "status": "pending"
      },
      {
        "id": 12,
        "title": "Person 12",
        "refNumber": "25189289",
        "status": "pending"
      },
      {
        "id": 13,
        "title": "Person 13",
        "refNumber": "84338452",
        "status": "cancelled"
      },
      {
        "id": 14,
        "title": "Person 14",
        "refNumber": "52512063",
        "status": "voided"
      }
    ],
    "11:30am": [
      {
        "id": 15,
        "title": "Person 15",
        "refNumber": "31617881",
        "status": "voided"
      },
      {
        "id": 16,
        "title": "Person 16",
        "refNumber": "14466970",
        "status": "pending"
      },
      {
        "id": 17,
        "title": "Person 17",
        "refNumber": "41419909",
        "status": "cancelled"
      },
      {
        "id": 18,
        "title": "Person 18",
        "refNumber": "51356077",
        "status": "confirmed"
      },
      {
        "id": 19,
        "title": "Person 19",
        "refNumber": "84688913",
        "status": "confirmed"
      }
    ],
    "1:00pm": [
      {
        "id": 20,
        "title": "Person 20",
        "refNumber": "60125507",
        "status": "confirmed"
      },
      {
        "id": 21,
        "title": "Person 21",
        "refNumber": "53339434",
        "status": "confirmed"
      }
    ],
    "4:30pm": [
      {
        "id": 22,
        "title": "Person 22",
        "refNumber": "27185946",
        "status": "cancelled"
      },
      {
        "id": 23,
        "title": "Person 23",
        "refNumber": "83499768",
        "status": "pending"
      }
    ],
    "5:00pm": [
      {
        "id": 24,
        "title": "Person 24",
        "refNumber": "22219046",
        "status": "voided"
      },
      {
        "id": 25,
        "title": "Person 25",
        "refNumber": "24028857",
        "status": "pending"
      },
      {
        "id": 26,
        "title": "Person 26",
        "refNumber": "76218843",
        "status": "cancelled"
      },
      {
        "id": 27,
        "title": "Person 27",
        "refNumber": "59021810",
        "status": "confirmed"
      },
      {
        "id": 28,
        "title": "Person 28",
        "refNumber": "71446562",
        "status": "confirmed"
      },
      {
        "id": 29,
        "title": "Person 29",
        "refNumber": "22661995",
        "status": "cancelled"
      }
    ],
    "5:30pm": [
      {
        "id": 30,
        "title": "Person 30",
        "refNumber": "71484136",
        "status": "cancelled"
      },
      {
        "id": 31,
        "title": "Person 31",
        "refNumber": "85519780",
        "status": "cancelled"
      },
      {
        "id": 32,
        "title": "Person 32",
        "refNumber": "11886653",
        "status": "confirmed"
      },
      {
        "id": 33,
        "title": "Person 33",
        "refNumber": "86551233",
        "status": "confirmed"
      },
      {
        "id": 34,
        "title": "Person 34",
        "refNumber": "22817176",
        "status": "confirmed"
      },
      {
        "id": 35,
        "title": "Person 35",
        "refNumber": "63421649",
        "status": "cancelled"
      }
    ],
    "6:00pm": [
      {
        "id": 36,
        "title": "Person 36",
        "refNumber": "41300256",
        "status": "cancelled"
      },
      {
        "id": 37,
        "title": "Person 37",
        "refNumber": "26266581",
        "status": "pending"
      }
    ]
  };

  // Sample units data
  units: Unit[] = [
    {
      id: 1,
      type: "18' Flatbed Truck",
      year: '2023',
      distance: '2.4 miles away',
      description: 'lorem TestData,sample 19898',
      rentalStatus: 'Ready Line',
      pmDate: '02/27/25',
      imageUrl: 'assets/flatbed-truck.png',
    },
    {
      id: 2,
      type: "26' Flatbed Truck",
      year: '2023',
      distance: '2.4 miles away',
      description: 'lorem TestData,sample 19898',
      rentalStatus: 'Ready Line',
      pmDate: '02/27/25',
      imageUrl: 'assets/flatbed-truck.png',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    // Set initial screen size
    this.updateScreenSize(window.innerWidth);
    this.accordionItems.forEach(item => item.isOpen = false);
  
    // Then open only the first one
    if (this.accordionItems.length > 0) {
      this.accordionItems[0].isOpen = true;
    }
  

    // Initialize with auto-scroll to current time
    setTimeout(() => {
      this.scrollToCurrentTimeSlot();
    }, 100);
  }

  /**
   * Toggles accordion items open/closed
   */
  toggleItem(index: number): void {
    // Toggle the current accordion item
     // Check if this accordion is already open
  const isCurrentlyOpen = this.accordionItems[index].isOpen;
  
  // First close all accordions
  this.accordionItems.forEach((item, i) => {
    item.isOpen = false;
  });
  
  // If the clicked accordion wasn't already open, open it
  // If it was open, it will remain closed (toggle behavior)
  if (!isCurrentlyOpen) {
    this.accordionItems[index].isOpen = true;
  } else {
    // If we're closing the last open accordion, clear any sticky warnings
    if (!this.isAnyAccordionOpen()) {
      this.stickyWarningTimeSlot = null;
    }
  }
  }

  /**
   * Toggles expansion of a time slot
   */
  toggleExpandTimeSlot(timeSlot: string, event: Event): void {
    if (event.isPlaceholder) return;

    if (this.expandedTimeSlot !== null) {
      // If already expanded, collapse it
      this.expandedTimeSlot = null;
    } else {
      // Otherwise, expand the clicked time slot
      this.expandedTimeSlot = timeSlot;
    }
  }

  /**
   * Updates responsive layout based on window size
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateScreenSize(window.innerWidth);
  }

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
   * Organizes events into rows for grid display
   */
  getEventRows(timeSlot: string): any[][] {
    const timeEvents = this.events[timeSlot];
    if (!timeEvents) return [];

    const columns = this.maxEventsPerRow;
    const rows: any[][] = [];

    // Split events into chunks
    for (let i = 0; i < timeEvents.length; i += columns) {
      // Get events for this row
      const rowEvents = timeEvents.slice(i, i + columns);

      // If we don't have enough events to fill the row, add empty placeholder objects
      while (rowEvents.length < columns) {
        rowEvents.push({
          id: -1,
          title: '',
          refNumber: '',
          status: 'confirmed',
          isPlaceholder: true,
        });
      }

      rows.push(rowEvents);
    }

    return rows;
  }

  /**
   * Closes the expanded view
   */
  closeExpandedView(): void {
    this.expandedTimeSlot = null;
    this.stickyWarningTimeSlot = null;
  }

  /**
   * Forces a UI refresh by triggering change detection
   */
  private forceRefresh(): void {
    this.expandedTimeSlot = this.expandedTimeSlot;
  }

  /**
   * Scrolls to the time slot closest to current time
   */
  scrollToCurrentTimeSlot(): void {
    setTimeout(() => {
      try {
        // Get current time
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();

        // Find the time slot closest to current time
        let closestTimeSlot: string | null | any = null;
        let minTimeDifference = Infinity;

        this.timeSlots.forEach((timeSlot) => {
          // Parse the time slot (format: "7:00am", "8:00am", etc.)
          const matches = timeSlot.match(/(\d+):(\d+)(am|pm)/i);

          if (matches) {
            let hour = parseInt(matches[1], 10);
            const minute = parseInt(matches[2], 10);
            const period = matches[3].toLowerCase();

            // Convert to 24-hour format for accurate comparison
            if (period === 'pm' && hour < 12) {
              hour += 12;
            } else if (period === 'am' && hour === 12) {
              hour = 0;
            }

            // Calculate absolute time difference in minutes
            const slotTotalMinutes = hour * 60 + minute;
            const currentTotalMinutes = currentHour * 60 + currentMinute;
            const timeDifferenceMinutes = Math.abs(
              slotTotalMinutes - currentTotalMinutes
            );

            // Find the slot with minimum time difference
            if (timeDifferenceMinutes < minTimeDifference) {
              minTimeDifference = timeDifferenceMinutes;
              closestTimeSlot = timeSlot;
            }
          }
        });

        // Set the current time slot for warning and scroll to it
        if (closestTimeSlot) {
          this.currentTimeSlotForWarning = closestTimeSlot;
          this.forceRefresh();
          setTimeout(() => this.scrollToTimeSlot(closestTimeSlot), 100);
        }
      } catch (error) {
        console.error('Error in scrollToCurrentTimeSlot:', error);
      }
    }, 50);
  }

  /**
   * Scrolls to a specific time slot
   */
  scrollToTimeSlot(timeSlot: string): void {
    try {
      console.log(`Scrolling to time slot: "${timeSlot}"`);

      // Update the current time slot for warning
      this.currentTimeSlotForWarning = timeSlot;

      // Use setTimeout to ensure DOM is updated before calculating positions
      setTimeout(() => {
        // Find relevant elements
        const accordionSection = document.querySelector('.accordion-section');
        const timeRows = document.querySelectorAll('.time-row');
        let targetRow: Element | null = null;

        // Find the matching time row
        for (let i = 0; i < timeRows.length; i++) {
          const timeCell = timeRows[i].querySelector('.time-cell');
          if (
            timeCell &&
            timeCell.textContent &&
            timeCell.textContent.trim() === timeSlot
          ) {
            targetRow = timeRows[i];
            break;
          }
        }

        if (targetRow && accordionSection) {
          // Find the warning that should be above this time slot
          const warningElement = targetRow.previousElementSibling;

          // Calculate scroll position
          const headerHeight =
            document.querySelector('.accordion-header')?.clientHeight || 30;
          let targetPosition = 0;

          // If there's a warning, and it's sticky, adjust scroll position
          if (
            warningElement &&
            warningElement.classList.contains('time-slot-inline-warning')
          ) {
            // If we're making this warning sticky
            if (this.stickyWarningTimeSlot === timeSlot) {
              targetPosition =
                (warningElement as HTMLElement).offsetTop - headerHeight - 10;
            } else {
              // Normal scroll behavior when not sticky
              targetPosition =
                (targetRow as HTMLElement).offsetTop - headerHeight - 10;
            }
          } else {
            // Otherwise just scroll to the time slot row
            targetPosition =
              (targetRow as HTMLElement).offsetTop - headerHeight - 10;
          }

          // Perform the scroll
          accordionSection.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });

          // Add visual feedback
          targetRow.classList.add('current-time-slot');

          // Remove highlight from other rows
          timeRows.forEach((row) => {
            if (row !== targetRow) {
              row.classList.remove('current-time-slot');
            }
          });
        }
      }, 50); // Short delay to ensure DOM updates
    } catch (error) {
      console.error('Error in scrollToTimeSlot:', error);
    }
  }
  /**
   * Checks if a warning is currently sticky for a specific time slot
   */

  /**
   * Counts unconfirmed reservations for a given time slot
   * @param timeSlot The time slot to count unconfirmed reservations for
   * @returns The number of unconfirmed reservations
   */
  getUnconfirmedCount(timeSlot: string): number {
    // If there are no events for this time slot, return 0
    if (!this.events[timeSlot]) {
      return 0;
    }

    // Count events with status other than 'confirmed'
    // (pending, cancelled, and voided are considered unconfirmed)
    return this.events[timeSlot].filter((event) => event.status !== 'confirmed')
      .length;
  }

  /**
   * Determines if a warning should be shown for a time slot
   * This can be used to modify when warnings appear based on unconfirmed count
   */
  shouldShowWarningFor(timeSlot: string): boolean {
    // Get the count of unconfirmed reservations
    const unconfirmedCount = this.getUnconfirmedCount(timeSlot);

    // Only show warning if there's at least one unconfirmed reservation
    return unconfirmedCount > 0;
  }

  /**
   * Checks if a time slot is the current one showing warning
   * Update this to consider unconfirmed count
   */
  isCurrentTimeSlot(timeSlot: string): boolean {
    return (
      this.currentTimeSlotForWarning === timeSlot &&
      this.shouldShowWarningFor(timeSlot)
    );
  }

/**
 * Checks if any accordion is currently open
 */
isAnyAccordionOpen(): boolean {
  return this.accordionItems.some(item => item.isOpen);
}
}
