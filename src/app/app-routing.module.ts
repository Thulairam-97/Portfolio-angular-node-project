import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageContentComponent } from './page-content/page-content.component';
import { LoginComponent } from './login/login.component';
import { SelectionPageComponent } from './selection-page/selection-page.component';
import { BookingComponent } from "./booking/booking.component";
import { AddBusComponent } from './add-bus/add-bus.component';


const routes: Routes = [
  // { path: '', component: PageContentComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'add_bus', component: AddBusComponent}, 
  {
    path: 'dashboard',
    component: PageContentComponent,
    children: [
      { path: 'bookings', component: BookingComponent },
      { path: 'add_bus', component: AddBusComponent },
      // { path: '', redirectTo: 'bookings', pathMatch: 'full' } // Default route for dashboard
    ],
  },
  { path: 'landing', component: SelectionPageComponent}, 
  { path: 'settings', component: PageContentComponent },
  { path: 'selection', component: SelectionPageComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
