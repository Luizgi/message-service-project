import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../services/message.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [MessageService, HttpClientModule],  // Add HttpClientModule here
  template: `
    <div class="feed-container">
      <div class="feed-header">
        <h2>Message Feed</h2>
        <button (click)="logout()">Logout</button>
      </div>

      <div class="messages-list">
        <div *ngFor="let message of messages" class="message-item">
          <div class="message-content">
            <p>{{ message.texto }}</p>
            <small>{{ formatDate(message.data) }}</small>
          </div>
          <div class="message-actions" *ngIf="message.usuarioId === currentUserId">
            <button (click)="deleteMessage(message._id)">Delete</button>
          </div>
        </div>
      </div>

      <div class="message-input">
        <div class="error-message" *ngIf="errorMessage">{{ errorMessage }}</div>
        <input 
          type="text" 
          [(ngModel)]="newMessage" 
          placeholder="Type your message..."
          (keyup.enter)="sendMessage()"
          maxlength="500"
        >
        <button (click)="sendMessage()">Send</button>
      </div>
    </div>
  `,
  styles: [`
    .feed-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .feed-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .messages-list {
      height: calc(100vh - 200px);
      overflow-y: auto;
      border: 1px solid #ccc;
      padding: 10px;
      border-radius: 5px;
    }

    .message-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 10px;
      margin: 5px 0;
      background-color: #f5f5f5;
      border-radius: 5px;
    }

    .message-content {
      flex-grow: 1;
    }

    .message-content small {
      color: #666;
      display: block;
      margin-top: 5px;
    }

    .message-input {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }

    .message-input input {
      flex-grow: 1;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    button {
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-bottom: 8px;
    }
  `]
})
export class FeedComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage: string = '';
  currentUserId: string = '';
  errorMessage: string = ''; // Add this property
  private messageSubscription?: Subscription;

  constructor(
    private messageService: MessageService,
    private router: Router
  ) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.loadMessages();
    this.setupMessagePolling();
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  private setupMessagePolling() {
    this.messageSubscription = interval(5000)
      .pipe(
        switchMap(() => this.messageService.getAllMessages())
      )
      .subscribe({
        next: (messages) => {
          this.messages = messages;
        },
        error: (error) => {
          console.error('Error fetching messages:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
  }

  loadMessages() {
    this.messageService.getAllMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  sendMessage() {
    // Trim and validate message
    const messageText = this.newMessage.trim();
    
    if (!messageText) {
      this.errorMessage = 'Message cannot be empty';
      return;
    }

    if (messageText.length > 500) {
      this.errorMessage = 'Message is too long (max 500 characters)';
      return;
    }

    this.messageService.sendMessage(messageText).subscribe({
      next: () => {
        this.newMessage = '';
        this.errorMessage = '';
        this.loadMessages();
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.errorMessage = error.error?.erro || 'Failed to send message';
      }
    });
  }

  deleteMessage(messageId: string) {
    this.messageService.deleteMessage(messageId).subscribe({
      next: () => {
        this.loadMessages();
      },
      error: (error) => {
        console.error('Error deleting message:', error);
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
}