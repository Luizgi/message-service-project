import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, SignupForm, LoginForm } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'zappy_auth';
  private readonly USERS_KEY = 'zappy_users';
  
  readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  
  private mockUsers: User[] = [];

  constructor(private router: Router) {
    this.loadFromStorage();
    this.loadMockUsers();
  }

  private loadFromStorage() {
    const authData = localStorage.getItem(this.STORAGE_KEY);
    if (authData) {
      try {
        const user = JSON.parse(authData);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
      } catch (e) {
        console.error('Error parsing auth data', e);
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  private loadMockUsers() {
    const usersData = localStorage.getItem(this.USERS_KEY);
    if (usersData) {
      try {
        this.mockUsers = JSON.parse(usersData);
      } catch (e) {
        console.error('Error parsing users data', e);
        this.mockUsers = [];
      }
    }
  }

  private saveMockUsers() {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(this.mockUsers));
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): Observable<User> {
    const user = this.currentUserSubject.value;
    if (!user) {
      return throwError(() => new Error('No authenticated user'));
    }
    return of(user).pipe(delay(500)); // Simulate network delay
  }

  signup(formData: SignupForm): Observable<User> {
    // Create a base64 URL for the avatar if provided
    let avatarUrl = '';
    if (formData.avatarFile) {
      // In a real app, this would upload to a server
      // Here we're using a mock URL
      avatarUrl = 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
    }
    
    // Create a new user object
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 15),
      name: formData.name,
      email: formData.email,
      avatar: avatarUrl,
      gender: formData.gender,
      country: formData.country,
      interests: formData.interests
    };
    
    // In a real app, this would make an API call
    // Here we're simulating with localStorage
    this.mockUsers.push(newUser);
    this.saveMockUsers();
    
    // Save to local storage and update subjects
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser));
    this.currentUserSubject.next(newUser);
    this.isLoggedInSubject.next(true);
    
    return of(newUser).pipe(delay(1000)); // Simulate network delay
  }

  login(formData: LoginForm): Observable<User> {
    // In a real app, this would be an API call
    // Here we're checking against our mock data
    const user = this.mockUsers.find(u => u.email === formData.email);
    
    if (!user) {
      return throwError(() => new Error('Invalid email or password'));
    }
    
    // In a real app, we would check the password hash
    // For this mock, we're just simulating success
    
    // Save to local storage and update subjects
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
    
    return of(user).pipe(delay(1000)); // Simulate network delay
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  updateProfile(user: User): Observable<User> {
    // In a real app, this would be an API call
    // Here we're updating our mock data
    const index = this.mockUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.mockUsers[index] = { ...user };
      this.saveMockUsers();
    }
    
    // Update local storage and current user
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
    
    return of(user).pipe(delay(1000)); // Simulate network delay
  }

  updateAvatar(file: File): Observable<User> {
    const user = this.currentUserSubject.value;
    if (!user) {
      return throwError(() => new Error('No authenticated user'));
    }
    
    // In a real app, this would upload the file to a server
    // Here we're just simulating success
    const updatedUser = {
      ...user,
      avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    };
    
    // Update in mock users
    const index = this.mockUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.mockUsers[index] = updatedUser;
      this.saveMockUsers();
    }
    
    // Update local storage and current user
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUser));
    this.currentUserSubject.next(updatedUser);
    
    return of(updatedUser).pipe(delay(1000)); // Simulate network delay
  }
}