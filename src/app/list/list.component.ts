import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { OverlayPanel } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';

interface DataGroup {
  id: string;
  title: string;
  subtitle: string;
  items: any[];
  expanded: boolean;
}


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    OverlayPanelModule,
    CheckboxModule,
    PanelModule,
    InputTextModule,
    RouterLink
],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  @ViewChild('op') overlayPanel!: OverlayPanel;
  
  groupedData: DataGroup[] = [];

  // Add to your component
yourData = [
  {
    unit: '324538',
    pickup: '0666-10',
    dropoff: '0660-44',
    length: '10ft',
    vehicleType: 'Reefer trailer',
    insurance: 'Y',
    reservation: 'R-123456',
    customerName: 'Albert Flores',
    tripType: 'One-way',
    rentalType: 'Standard',
    status: 'Confirmed',
    hikeStatus: 'Y',
    towingEquipments: 'Y', 
    payNow: 'Y'
  },
  {
    unit: 'Unassigned',
    pickup: '0666-10',
    dropoff: '0660-10',
    length: '14ft',
    vehicleType: 'Flatbed',
    insurance: 'Y',
    reservation: 'R-234567',
    customerName: 'Thomas Webb',
    tripType: 'Round-trip',
    rentalType: 'Premium',
    status: 'Booked',
    hikeStatus: 'N',
    towingEquipments: 'N',
    payNow: 'N'
  },
  {
    unit: '287430',
    pickup: '0666-10',
    dropoff: '0666-10',
    length: '12ft',
    vehicleType: 'Trailer',
    insurance: 'N',
    reservation: 'R-890123',
    customerName: 'Robert Fox',
    tripType: 'Interim',
    rentalType: 'Standard',
    status: 'Postponed',
    hikeStatus: 'N',
    towingEquipments: 'Y',
    payNow: 'Y'
  },
  {
    unit: '247916',
    pickup: '0666-10',
    dropoff: '0660-44',
    length: '12ft',
    vehicleType: 'High roof van',
    insurance: 'Y',
    reservation: 'R-123456',
    customerName: 'Eleanor Pena',
    tripType: 'One-way',
    rentalType: 'Standard',
    status: 'Urgent',
    hikeStatus: 'N',
    towingEquipments: 'Y',
    payNow: 'N'
  },
  {
    unit: '448136',
    pickup: '0666-10',
    dropoff: '0666-10',
    length: '14ft',
    vehicleType: 'T/A Sleeper',
    insurance: 'Y',
    reservation: 'R-234567',
    customerName: 'Ronald Richards',
    tripType: 'Substitute',
    rentalType: 'Premium',
    status: 'Booked',
    hikeStatus: 'N',
    towingEquipments: 'Y',
    payNow: 'N'
  }
];

// Update column definitions
cols: any[] = [
  { field: 'status', header: 'Reservation status' },
  { field: 'customerName', header: 'Customer Name' },
  { field: 'reservation', header: 'Reservation #' },
  { field: 'tripType', header: 'Trip Type' },
  { field: 'pickup', header: 'Pickup Date' },
  { field: 'unit', header: 'Unit #' },
  { field: 'pickupTime', header: 'Pick up' },
  { field: 'dropoff', header: 'Drop off' },
  { field: 'length', header: 'Length' },
  { field: 'vehicleType', header: 'Vehicle Type' },
  { field: 'insurance', header: 'Insurance' },
  { field: 'hikeStatus', header: 'Hike Status' },
  { field: 'towingEquipments', header: 'Towing equipments' },
  { field: 'payNow', header: 'Pay Now' }
];


processGroupedData() {
  // Define multiple groups
  const groups: {[key: string]: DataGroup} = {
    'NewDataTestData': {
      id: '0666-10',
      title: '0666-10 NewData TestData',
      subtitle: 'LIS - TestLocation- TestData Unit Administration',
      items: [],
      expanded: true // Start expanded by default
    },
    'richmondCenter': {
      id: '0667-05',
      title: '0667-05 Richmond Center',
      subtitle: 'LIS - Virginia - Richmond Branch Office',
      items: [],
      expanded: true // Start expanded by default
    },
    'bostonDowntown': {
      id: '0668-22',
      title: '0668-22 Boston Downtown',
      subtitle: 'LIS - Massachusetts - Boston Regional Center',
      items: [],
      expanded: true // Start expanded by default
    }
  };
  
  // Distribute data items to groups based on some criteria
  // For example, split the data for demonstration purposes
  this.yourData.forEach((item, index) => {
    // Assign to different groups based on index (just for demonstration)
    if (index < 2) {
      groups['NewDataTestData'].items.push(item);
    } else if (index < 4) {
      groups['richmondCenter'].items.push(item);
    } else {
      groups['bostonDowntown'].items.push(item);
    }
  });
  
  // Convert to array format for template
  this.groupedData = Object.values(groups);
}


toggleGroup(group: DataGroup) {
  group.expanded = !group.expanded;
}

// Add this method to get row class based on status
getRowStatusClass(rowData: any): string {
  switch(rowData.status.toLowerCase()) {
    case 'confirmed': return 'status-row-confirmed';
    case 'booked': return 'status-row-booked';
    case 'postponed': return 'status-row-postponed';
    case 'urgent': return 'status-row-urgent';
    default: return '';
  }
}

  // // Column definitions
  // cols: any[] = [
  //   { field: 'reservation', header: 'Reservation #' },
  //   { field: 'customerName', header: 'Customer Name' },
  //   { field: 'tripType', header: 'Trip Type' },
  //   { field: 'rentalType', header: 'Rental Type' },
  //   { field: 'vehicleType', header: 'Vehicle Type' },
  //   { field: 'unit', header: 'Unit #' },
  //   { field: 'dropoff', header: 'Drop-off Date' },
  //   { field: 'pickup', header: 'Pick-up date' },
  //   { field: 'length', header: 'Length' },
  //   { field: 'insurance', header: 'Insurance' }
  // ];
  
  // Track visible columns
  visibleCols: {[key: string]: boolean} = {};
  
  // Track hidden columns
  hiddenColumns: string[] = [];
  
  // Track selected row for details panel
  selectedRow: any = null;
  detailsPanelVisible = false;
  
  ngOnInit() {
    // Initialize all columns as visible
    this.cols.forEach(col => {
      this.visibleCols[col.field] = true;
    });
    
    // Initialize hidden columns as empty
    this.hiddenColumns = [];
    this.processGroupedData();
  }
  
  // Toggle column visibility
  toggleColumnVisibility(field: string) {
    console.log('Toggling visibility for:', field);
    this.visibleCols[field] = !this.visibleCols[field];
    
    // Update hidden columns list for display
    if (!this.visibleCols[field]) {
      if (!this.hiddenColumns.includes(field)) {
        this.hiddenColumns.push(field);
      }
    } else {
      this.hiddenColumns = this.hiddenColumns.filter(col => col !== field);
    }
  }
  
  // Check if column is hidden
  isColumnHidden(field: string): boolean {
    return !this.visibleCols[field];
  }
  
  // Get visible columns as array
  getVisibleColumns() {
    return [...this.cols.filter(col => this.visibleCols[col.field])];
  }
  
  // Show column toggler
  showColumnToggler(event: Event) {
    console.log('Showing column toggler');
    this.overlayPanel.toggle(event);
    event.stopPropagation();
  }
  
  // Helper method to get header for a field
  getHeaderForField(field: string): string {
    const column = this.cols.find(c => c.field === field);
    return column ? column.header : '';
  }
  
  // Handle row selection to show details panel
  onRowSelect(rowData: any) {
    console.log('Row selected:', rowData);
    this.selectedRow = rowData;
    this.detailsPanelVisible = true;
  }
  
  // Close details panel
  closeDetailsPanel() {
    this.detailsPanelVisible = false;
    this.selectedRow = null;
  }

  // Add these properties to your ListComponent
editingField: string | null = null;
editingValue: string = '';

// Add these methods to handle editing
startEditing(field: string, value: string) {
  this.editingField = field;
  this.editingValue = value;
}

cancelEditing() {
  this.editingField = null;
}

saveEditing() {
  if (this.editingField && this.selectedRow) {
    this.selectedRow[this.editingField] = this.editingValue;
    this.editingField = null;
  }
}

// Add these properties to the component
expandedAccordions: {[key: string]: boolean} = {
  'tripInformation': true,
  'unitInformation': true
};

// Add unit data
unitData = [
  {
    unitId: '544387',
    unitType: '16\' Flatbed Truck',
    status: 'Available',
    rentalStatus: 'Ready Line',
    pmDate: '02/27/25',
    image: 'assets/flatbed-truck.png'
  },
  {
    unitId: '544387',
    unitType: '16\' Flatbed Truck',
    status: 'Available',
    rentalStatus: 'Ready Line',
    pmDate: '02/27/25',
    image: 'assets/flatbed-truck.png'
  },
  {
    unitId: '544387',
    unitType: '16\' Flatbed Truck',
    status: 'Due-In',
    rentalStatus: 'Ready Line',
    pmDate: '02/27/25',
    image: 'assets/flatbed-truck.png'
  },
  {
    unitId: '544387',
    unitType: '16\' Flatbed Truck',
    status: 'Delay',
    rentalStatus: 'Ready Line',
    pmDate: '02/27/25',
    image: 'assets/flatbed-truck.png'
  },
  {
    unitId: '544387',
    unitType: '16\' Flatbed Truck',
    status: 'Available',
    rentalStatus: 'Ready Line',
    pmDate: '02/27/25',
    image: 'assets/flatbed-truck.png'
  }
];

// Method to toggle accordion
toggleAccordion(accordionName: string) {
  this.expandedAccordions[accordionName] = !this.expandedAccordions[accordionName];
}

// Method to get status class for unit cards
getUnitStatusClass(status: string): string {
  switch(status.toLowerCase()) {
    case 'available': return 'status-available';
    case 'due-in': return 'status-due-in';
    case 'delay': return 'status-delay';
    default: return '';
  }
}
}