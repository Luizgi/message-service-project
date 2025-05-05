import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MessageService } from '../services/message.service'; // Verify this path

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Make sure these are correct
  providers: [MessageService, HttpClientModule]
})
export class FeedComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage: string = '';
  currentUserId: string = '';
  errorMessage: string = '';
  private messageSubscription?: Subscription;
  editingMessageId: string | null = null;
  editMessageText: string = '';
  selectedMessageId: string | null = null;
  openMenuId: string | null = null;

  constructor(
    private messageService: MessageService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/login']);
      }
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
        console.log('Messages:', messages); // Check if user_id exists
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

  editMessage(messageId: string, currentText: string) {
    this.editingMessageId = messageId;
    this.editMessageText = currentText;
  }

  cancelEdit() {
    this.editingMessageId = null;
    this.editMessageText = '';
  }

  saveEdit(messageId: string) {
    const messageText = this.editMessageText.trim();

    if (!messageText) {
      this.errorMessage = 'Message cannot be empty';
      return;
    }

    if (messageText.length > 500) {
      this.errorMessage = 'Message is too long (max 500 characters)';
      return;
    }

    this.messageService.updateMessage(messageId, messageText).subscribe({
      next: () => {
        this.editingMessageId = null;
        this.editMessageText = '';
        this.errorMessage = '';
        this.loadMessages();
      },
      error: (error) => {
        console.error('Error updating message:', error);
        this.errorMessage = error.error?.erro || 'Failed to update message';
      }
    });
  }

  deleteMessage(messageId: string) {
    if (confirm('Are you sure you want to delete this message?')) {
      this.messageService.deleteMessage(messageId).subscribe({
        next: () => {
          this.loadMessages();
        },
        error: (error) => {
          console.error('Error deleting message:', error);
          this.errorMessage = error.error?.erro || 'Failed to delete message';
        }
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  toggleMenu(messageId: string) {
    this.openMenuId = this.openMenuId === messageId ? null : messageId;
  }
}