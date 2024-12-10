import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BookSlotComponent } from './book-slot/book-slot.component';
import { authGuard } from './auth.guard';
import { TableComponentComponent } from './table-component/table-component.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'appointments',
    component: TableComponentComponent,
    canActivate: [authGuard],
  },
  { path: 'book-slot', component: BookSlotComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/book-slot', pathMatch: 'full' },
  { path: '**', redirectTo: '/book-slot' },
];
