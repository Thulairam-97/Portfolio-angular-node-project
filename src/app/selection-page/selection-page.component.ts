import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selection-page',
  templateUrl: './selection-page.component.html',
  styleUrls: ['./selection-page.component.css']
})
export class SelectionPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSelect(option: string) {
    this.router.navigate(['/dashboard'], { queryParams: { option } });
  }

}
