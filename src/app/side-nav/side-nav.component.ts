import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  userData: any;
  constructor(private apiService: ApiService) { }
 

  ngOnInit(): void {
    // this.userData = history.state.userData;
    this.userData = this.apiService.getUserData();
    console.log('User data:', this.userData);
    console.log("this.userData",this.userData);

  }

}
