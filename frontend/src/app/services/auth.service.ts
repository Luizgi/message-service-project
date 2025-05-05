import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupData } from '../models/signup.model';
import { LoginData } from '../models/login.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  signup(userData: SignupData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, userData);
  }

  login(loginData: LoginData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }
}