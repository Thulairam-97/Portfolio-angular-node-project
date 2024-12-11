import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.css']
})
export class TitleBarComponent implements OnInit {

  constructor(private apiService: ApiService,private router: Router,    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.apiService.logout().subscribe(
      (response: any) => {
        if (response.status === 1) {
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('userData');

          this.router.navigate(['/login']);

          this.snackBar.open('Logged out successfully!', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Logout failed. Please try again.', 'Close', { duration: 3000 });
        }
      },
      (error) => {
        console.error('Logout Error:', error);
        this.snackBar.open('An error occurred. Please try again.', 'Close', { duration: 3000 });
      }
    );
  }

}
