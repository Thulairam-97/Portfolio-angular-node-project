import { Router } from '@angular/router';
import { Component, OnInit,Inject,TemplateRef, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NODE_API_PATH } from '../app.module';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { ApiService } from '../api.service';




@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  providers: [DatePipe],
})
export class BookingComponent implements OnInit {

  constructor(private router:Router,private fb: FormBuilder, private http: HttpClient,private snackBar: MatSnackBar,  @Inject(NODE_API_PATH) private baseUrl: string,private dialog: MatDialog,private cdr: ChangeDetectorRef, private datePipe: DatePipe,private apiService: ApiService) { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { seats: any[] };
    this.seats = state?.seats || [];
    this.minDate = new Date();
  }

  ngOnInit(): void {
     this.userData = this.apiService.getUserData();
  }

  cities: string[] = [
    'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 
    'Tirunelveli', 'Erode', 'Tirupur', 'Vellore', 'Thoothukudi'
  ];
  filteredCities: string[] = [...this.cities]; 
  busList : any[] = [];
  source: string = '';
  destination: string = '';
  travelDate: Date | null = null;
  travelTime: string = '';
  currentStep = '';
  seats: any[] = [];
  amount: any = 0;
  minDate : Date;
  selectedBusDetails : any;
  userData : any;
  selectedSeat: any[] = [];

  // this.userData = this.apiService.getUserData();

  onStartingPointChange(selectedCity: string) {
    this.filteredCities = this.cities.filter(city => city !== selectedCity);
  }

  fetchBuses() {

    // const url = `${this.baseUrl}api/login/fetchBuses`; //node
    const url = `${this.baseUrl}api/fetchBuses`;  //java
    let input = {
        source : this.source,
        destination: this.destination,
        travel_date : this.datePipe.transform(this.travelDate, 'yyyy-MM-dd')
    }

    this.http.post(url,input).subscribe((data: any) => {
      if (data.status === 1) {
          this.busList = data.data;
      }
      else {
        this.showErrorMessage(data.msg);
      }
      this.cdr.detectChanges();
      
    });
  }

  calculateDuration(departure: string, arrival: string): string {
    const [depHours, depMinutes] = departure.split(':').map(Number);
    const [arrHours, arrMinutes] = arrival.split(':').map(Number);

    const depTotalMinutes = depHours * 60 + depMinutes;
    let arrTotalMinutes = arrHours * 60 + arrMinutes;

    if (arrTotalMinutes < depTotalMinutes) {
      arrTotalMinutes += 1440; 
    }

    const durationMinutes = arrTotalMinutes - depTotalMinutes;

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours}h ${minutes}min`;
  }
 

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, 
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'], 
    });
  }



  onSearch() {
    if (this.source && this.destination && this.travelDate) {
      this.fetchBuses();
      console.log('Search Details:', {
        source: this.source,
        destination: this.destination,
        travelDate: this.travelDate,
        travelTime: this.travelTime
      });
      this.currentStep = 'bus_selection';
    } else {
      this.showErrorMessage('Please fill out all required fields.');
    }
  }

  rows = 5; 
  seatsPerRow = 4; 

  seatingRows: { id: number; selected: boolean; disabled: boolean; }[][] = [];

  generateSeatingArrangement() {
    this.seatingRows = [];
    let seatId: any = 1;

    for (let i = 0; i < this.rows; i++) {
      const row = [];
      for (let j = 0; j < this.seatsPerRow; j++) {       
        row.push({ id: seatId, selected: false, disabled: this.selectedSeat?.includes(seatId), });
        seatId++;
      }
      this.seatingRows.push(row);
    }
  }

  toggleSeat(rowIndex: number, seatIndex: number) {
    const seat = this.seatingRows[rowIndex][seatIndex];
    if (!seat.disabled) {
      seat.selected = !seat.selected;
    }
  }  

  isEvenIndex(index: number): boolean {
    return index % 2 === 1;
  }

  get selectedSeats() {
    const selected = this.seatingRows
      .flatMap((row) => row.filter((seat) => seat.selected))
      .map((seat) => seat.id);
    return selected.join(', ');
  }

  proceedToPayment() {
    const selected = this.selectedSeats;
    let seatArray = selected.split(",");  
    this.seats =  selected.split(",");
    this.selectedBusDetails.seats_selected = this.seats;
    this.amount = seatArray.length * Number(this.selectedBusDetails.price);
    this.selectedBusDetails.amount = this.amount;
    this.currentStep = 'payment_selection';
    if (selected.length === 0) {
      this.showErrorMessage('Please select at least one seat!');
      return;
    } else {
      // this.router.navigate(['/'], { state: { seats: selected } });
    }
  }

  seatChoose(bus: any){   
    this.currentStep = 'seat_selection';
    // const url = `${this.baseUrl}api/login/fetchSeats`;  //node
    const url = `${this.baseUrl}api/fetchSeats`; //java   
    // let input = {
    //     bus
    // }

    this.http.post(url,bus).subscribe((data: any) => {
      if (data.status === 1) {
          // this.busList = data.data;
          this.seatingRows = [];
          this.selectedSeat = data.seats?.map((seat: string) => Number(seat));
          console.log("selected",this.selectedSeat);
          
          this.generateSeatingArrangement(); 
      }
      else {
        this.showErrorMessage(data.msg);
      }
      this.cdr.detectChanges();
      
    });
    
    this.selectedBusDetails = bus;
  }

  goBack(){
    if(this.currentStep === 'bus_selection'){
      this.currentStep = '';
    } else if(this.currentStep === 'seat_selection'){
      this.currentStep = 'bus_selection';
      this.seatingRows.forEach((row) => {
        row.forEach((seat) => {
          seat.selected = false; // Reset the 'selected' property
        });
      });
    } else if(this.currentStep === 'payment_selection'){
      this.currentStep = 'seat_selection';
    } else if (this.currentStep === 'success_selection'){
      this.currentStep = 'payment_selection'
    } else {
      this.currentStep = '';
    }
    
  }

  makePayment() {
    this.currentStep = 'success_selection';
    this.showErrorMessage('Payment successful! Thank you for booking.');
    // const url = `${this.baseUrl}api/login/addPassenger`; //node
    const url = `${this.baseUrl}api/addPassenger`;  //java
    
    let input = {
        user : this.userData,
        bus: this.selectedBusDetails
    }

    this.http.post(url,input).subscribe((data: any) => {
      if (data.status === 1) {
          this.busList = data.data;
      }
      else {
        this.showErrorMessage(data.msg);
      }
      this.cdr.detectChanges();
      
    });

  }

  cancelPayment() {
    this.showErrorMessage('Payment canceled.');
    this.goBack();
  }

  downloadTicket(){
    
  }

  logout(){
    this.router.navigate(['/login']);
  }

}
