import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Message } from '../models/message.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly STORAGE_KEY = 'zappy_messages';
  private messages: Message[] = [];

  constructor(private authService: AuthService) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const messagesData = localStorage.getItem(this.STORAGE_KEY);
    if (messagesData) {
      try {
        this.messages = JSON.parse(messagesData).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        console.error('Error parsing messages data', e);
        this.messages = [];
      }
    }
  }

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.messages));
  }

  getMessages(): Observable<Message[]> {
    // Sort messages by timestamp (newest first)
    const sortedMessages = [...this.messages].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return of(sortedMessages).pipe(delay(800)); // Simulate network delay
  }

  createMessage(messageData: Partial<Message>): Observable<Message> {
    const user = this.authService.currentUserSubject.value;
    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 15),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || '',
      content: messageData.content || '',
      timestamp: new Date()
    };
    
    this.messages.push(newMessage);
    this.saveToStorage();
    
    return of(newMessage).pipe(delay(500)); // Simulate network delay
  }

  updateMessage(id: string, content: string): Observable<Message> {
    const user = this.authService.currentUserSubject.value;
    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    const index = this.messages.findIndex(m => m.id === id);
    if (index === -1) {
      return throwError(() => new Error('Message not found'));
    }
    
    // Check if user owns the message
    if (this.messages[index].userId !== user.id) {
      return throwError(() => new Error('Unauthorized to update this message'));
    }
    
    const updatedMessage = {
      ...this.messages[index],
      content,
      // In a real app, you might set an 'edited' flag or timestamp
    };
    
    this.messages[index] = updatedMessage;
    this.saveToStorage();
    
    return of(updatedMessage).pipe(delay(500)); // Simulate network delay
  }

  deleteMessage(id: string): Observable<void> {
    const user = this.authService.currentUserSubject.value;
    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    const index = this.messages.findIndex(m => m.id === id);
    if (index === -1) {
      return throwError(() => new Error('Message not found'));
    }
    
    // Check if user owns the message
    if (this.messages[index].userId !== user.id) {
      return throwError(() => new Error('Unauthorized to delete this message'));
    }
    
    this.messages.splice(index, 1);
    this.saveToStorage();
    
    return of(undefined).pipe(delay(500)); // Simulate network delay
  }
}