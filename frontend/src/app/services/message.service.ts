import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mensagens`, {
      headers: this.getHeaders()
    });
  }

  sendMessage(texto: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/mensagem`, { texto }, {
      headers: this.getHeaders()
    });
  }

  deleteMessage(messageId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/mensagem/${messageId}`, {
      headers: this.getHeaders()
    });
  }

  updateMessage(messageId: string, texto: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/mensagem/${messageId}`, { texto }, {
      headers: this.getHeaders()
    });
  }
}