import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //  private baseUrl: string = 'http://localhost:7000/'; //NodeJs
   private baseUrl: string = 'http://localhost:8080/';  // Java
   private userData: any;

  constructor(private http: HttpClient) { }


  login(email: string, password: string): Observable<any> {
    const loginUrl = `${this.baseUrl}api/login`; 
    console.log("loginUrl",loginUrl);
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    // });
    
    return this.http.post(loginUrl, { email, password }); 
  }

  setUserData(data: any) {
    this.userData = data;
    localStorage.setItem('userData', JSON.stringify(data));
  }

  getUserData() {
      const storedData = localStorage.getItem('userData');
      if (storedData) {
        this.userData = JSON.parse(storedData);
      }
      return this.userData;
  }


    logout(): Observable<any> {
      // const logoutUrl = `${this.baseUrl}api/login/logout`;  //node
      const logoutUrl = `${this.baseUrl}api/logout`; // java
      // const token = localStorage.getItem('jwtToken'); 
    
      // const headers = { Authorization: `Bearer ${token}` };
    
      // return this.http.post(logoutUrl, {}, { headers });
      const token = localStorage.getItem('jwtToken'); 
    
      const headers = { Authorization: `Bearer ${token}` };
    
      return this.http.post(logoutUrl, {}, );
    }
}


