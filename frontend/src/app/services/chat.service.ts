import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/mensagens`);
  }

  sendMessage(texto: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/mensagem`, { texto }, {
      headers: this.getHeaders()
    });
  }

  editMessage(id: string, texto: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/mensagem/${id}`, { texto }, {
      headers: this.getHeaders()
    });
  }

  deleteMessage(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/mensagem/${id}`, {
      headers: this.getHeaders()
    });
  }
}