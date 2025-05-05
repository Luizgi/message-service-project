import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [MessageService, HttpClientModule]
})
export class FeedComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage: string = '';
  currentUserId: string = '';
  errorMessage: string = '';
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