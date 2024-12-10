import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { NODE_API_PATH } from '../app.module';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  phoneNumber: string = '';
  emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
  phonePattern: string = '^(\\+91|0)?[6789]\\d{9}$'; 
  passwordPattern: string = '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$';
  role: string = '';
  isRegistering: boolean = false;

  toggleMode(): void {
    this.isRegistering = !this.isRegistering;
  }

  constructor(private router: Router,private apiService: ApiService,private snackBar: MatSnackBar, private http: HttpClient, @Inject(NODE_API_PATH) private baseUrl: string) { }

  ngOnInit(): void {
  }

  showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, 
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'], 
    });
  }




  onSubmit(register : boolean,authForm: any): void {
    if(register){
      if (this.email.trim() && this.password.trim() && this.phoneNumber && this.role) {

        const encodedEmail = btoa(this.email);
        const encodedPassword = btoa(this.password);
        const encodedPhoneNumber = btoa(this.phoneNumber);
        console.log("this.baseUrl",this.baseUrl);
        
        const api_name = 'api/login/register';
        const user = { email: encodedEmail, password: encodedPassword, phoneNumber: encodedPhoneNumber, role: this.role };
        
        this.http.post(`${this.baseUrl}${api_name}`, user).subscribe(
          (response : any) => {
            localStorage.setItem('token', response['token']);
            this.showErrorMessage(response.msg);
            authForm.resetForm();
            this.router.navigate(['/']);
          },
          (error) => {
            this.errorMessage = 'Unable to connect. Please check your internet.';
            this.showErrorMessage(this.errorMessage);
          }
        );
       
      } else {
        this.showErrorMessage('Invalid credentials');
      }

    }
    else {
        if (this.email.trim() && this.password.trim()) {

          const encodedEmail = btoa(this.email);
          const encodedPassword = btoa(this.password);
          this.apiService.login(encodedEmail, encodedPassword).subscribe(
            (res) => {
              localStorage.setItem('token', res.token);
              if (res.status === 1) {
                this.apiService.setUserData(res.data);
                authForm.resetForm();
                this.showErrorMessage(res.msg);
                if(res.data['role'] == 'Admin'){
                   this.router.navigate(['/dashboard/add_bus'],{
                    state: { userData: res.data }
                   });
                } else {
                   this.router.navigate(['/landing'],{
                    state: { userData: res.data }
                   });
                }
                
              } else {
                this.showErrorMessage(res.msg);
              }
            },
            (error) => {
              console.error('Login error:', error);
              this.errorMessage = 'Unable to connect. Please check your internet.';
              this.showErrorMessage(this.errorMessage);
            }
          );
        
        } else {
          this.showErrorMessage('Invalid credentials');
        }
    }

  }

}
