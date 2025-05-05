import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  { 
    path: 'signup', 
    loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'feed', 
    loadComponent: () => import('./pages/feed/feed.component').then(m => m.FeedComponent),
    canActivate: [authGuard]
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];