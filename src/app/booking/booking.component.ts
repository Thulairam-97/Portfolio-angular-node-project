import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  constructor(private router:Router) { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { seats: number[] };
    this.seats = state?.seats || [];
    this.amount = this.seats.length * 500;
    this.generateSeatingArrangement(); 
  }

  ngOnInit(): void {
  }

  cities: string[] = ['New Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad'];
  source: string = '';
  destination: string = '';
  travelDate: Date | null = null;
  travelTime: string = '';
  currentStep = '';
  seats: number[] = [];
  amount: number = 0;
  transactionId = 'TXN123456789';
  bookingDate = new Date().toLocaleDateString();


  onSearch() {
    // if (this.source && this.destination && this.travelDate) {
    if(1) {
      console.log('Search Details:', {
        source: this.source,
        destination: this.destination,
        travelDate: this.travelDate,
        travelTime: this.travelTime
      });
      this.currentStep = 'seat_selection';
      alert('Searching buses for your journey!');
    } else {
      alert('Please fill out all required fields.');
    }
  }

  rows = 5; 
  seatsPerRow = 4; 

  seatingRows: { id: number; selected: boolean }[][] = [];

  generateSeatingArrangement() {
    let seatId = 1;
    for (let i = 0; i < this.rows; i++) {
      const row = [];
      for (let j = 0; j < this.seatsPerRow; j++) {
        row.push({ id: seatId++, selected: false });
      }
      this.seatingRows.push(row);
    }
  }

  toggleSeat(rowIndex: number, seatIndex: number) {
    this.seatingRows[rowIndex][seatIndex].selected =
      !this.seatingRows[rowIndex][seatIndex].selected;
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
    this.currentStep = 'payment_selection';
    if (selected.length === 0) {
      alert('Please select at least one seat!');
      return;
    }
    // Navigate to payment page
    this.router.navigate(['/payment'], { state: { seats: selected } });
  }

  makePayment() {
    this.currentStep = 'success_selection';
    alert('Payment successful! Thank you for booking.');
    this.router.navigate(['/']);
  }

  cancelPayment() {
    alert('Payment canceled.');
    this.router.navigate(['/']); 
  }

  downloadTicket(){
    
  }

  logout(){
    this.router.navigate(['/login']);
  }

}
