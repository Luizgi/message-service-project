import { Routes } from '@angular/router';
import { LoginComponent } from '../../../pages/login/login.component';
import { SignupComponent } from '../../../pages/signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Página inicial redirecionando para login
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];
