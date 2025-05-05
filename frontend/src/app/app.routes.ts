import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
  { path: '', component: SignupComponent },
  { path: 'signup', component: SignupComponent },   
  { path: 'login', component: LoginComponent },
  { path: 'chat', component: ChatComponent }
];
