import { Component, OnInit,Inject,TemplateRef, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NODE_API_PATH } from '../app.module';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';



@Component({
  selector: 'app-add-bus',
  templateUrl: './add-bus.component.html',
  styleUrls: ['./add-bus.component.css']
})
export class AddBusComponent implements OnInit {
  addBusForm: FormGroup;
  isEditing: boolean = false;
  busData: any = {};
  busList : any[] = []; // Replace with your API data
  displayedColumns: string[] = ['travel_date', 'bus_number', 'starting_point', 'ending_point', 'departure_time', 'arrival_time', 'actions'];
  minDate: string;

  constructor(private fb: FormBuilder, private http: HttpClient,private snackBar: MatSnackBar,  @Inject(NODE_API_PATH) private baseUrl: string,private dialog: MatDialog,private cdr: ChangeDetectorRef) {
    this.addBusForm = this.fb.group({
      id:[null],
      bus_number: ['', Validators.required],
      operator: ['',Validators.required],
      starting_point: ['', Validators.required],
      ending_point: ['', Validators.required],
      departure_time: ['', Validators.required],
      arrival_time: ['', Validators.required],
      travel_date: ['', Validators.required],
      seats_available: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
    });
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]
  }
  cities: string[] = [
    'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 
    'Tirunelveli', 'Erode', 'Tirupur', 'Vellore', 'Thoothukudi'
  ];
  filteredCities: string[] = [...this.cities]; 

  onStartingPointChange(selectedCity: string) {
    this.filteredCities = this.cities.filter(city => city !== selectedCity);
    this.addBusForm.patchValue({ ending_point: null });
  }


  openAddBusDialog(dialogTemplate: any) {
    const dialogRef = this.dialog.open(dialogTemplate, {
      width: '600px',
      maxHeight: '90vh',
    });

    // Add class to disable scrolling on the body when the dialog opens
    document.body.classList.add('no-scroll');

    dialogRef.afterClosed().subscribe(() => {
      // Remove class when the dialog is closed
      document.body.classList.remove('no-scroll');
    });
  }


  ngOnInit(): void {
    this.fetchBuses('');
  }

  
  fetchBuses(id: string) {

    if(id){
      this.isEditing = true;
    }

    const url = `${this.baseUrl}api/login/fetchBuses`; 

    this.http.post(url,{id: id}).subscribe((data: any) => {
      if (data.status === 1) {
        if (id) {
          const busDetails = data.data[0];
          this.busData = { 
            id: id,
            bus_number: busDetails.bus_number,
            operator: busDetails.operator, 
            starting_point: busDetails.starting_point,
            ending_point: busDetails.ending_point,
            travel_date: busDetails.travel_date,
            seats_available: busDetails.seats_available,
            price: busDetails.price,
            arrival_time: busDetails.arrival_time,
            departure_time: busDetails.departure_time,
          };

          // Patch form values with bus data
          this.addBusForm.patchValue(this.busData);
          console.log("fetchBus",this.addBusForm);
          
        } else {
          this.busList = data.data;
        }
      }
      else {
        this.showErrorMessage(data.msg);
      }
      this.cdr.detectChanges();
      
    });
  }

  addBus() {
    this.isEditing = false;
    if (this.addBusForm.valid) {
      const newBus = this.addBusForm.value;

      this.http.post(this.baseUrl+'api/login/addBuses', newBus).subscribe((response: any) => {
        this.showErrorMessage(response.msg);
        this.fetchBuses('');
        this.dialog.closeAll();
        // this.addBusForm.reset();
      });
    }
  }


  editBus() {
        const newBus = this.addBusForm.value;
      console.log("this.addBusForm edit",this.addBusForm.value);
      
      this.http.post(this.baseUrl+'api/login/editBuses', newBus).subscribe((response: any) => {
        this.showErrorMessage(response.msg);
        this.fetchBuses('');
        this.isEditing = false;
        this.dialog.closeAll();
        this.addBusForm.reset();
      });
  }
  
  deleteBus(busId: string, busName: string) {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: { busId, busName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        this.http.post(this.baseUrl+'api/login/deleteBuses', {id: busId}).subscribe((response: any) => {
          this.showErrorMessage(response.msg);
          this.fetchBuses('');  // Refresh the list of buses
        }, (error) => {
          console.error('Error deleting bus:', error);
          this.showErrorMessage('Failed to delete bus. Please try again.');
        });
      }
    });
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, 
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'], 
    });
  }

}
