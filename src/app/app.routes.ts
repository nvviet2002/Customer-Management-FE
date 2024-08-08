import { Routes } from '@angular/router';
import { CustomerComponent } from './pages/customer/customer.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/customer' },
  {
    path: 'customer',
    component: CustomerComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/customer',
  },
];
