import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { Message } from '../models/message.model';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [ChatService],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  newMessage: string = '';
  userId: string = '';
  errorMessage: string = '';

  constructor(
    private chatService: ChatService,
    private router: Router
  ) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.loadMessages();
    // Reload messages every 5 seconds
    setInterval(() => {
      this.loadMessages();
    }, 5000);
  }

  loadMessages() {
    this.chatService.getMessages().subscribe({
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
    if (!this.newMessage.trim()) return;

    this.chatService.sendMessage(this.newMessage).subscribe({
      next: () => {
        this.newMessage = '';
        this.loadMessages();
      },
      error: (error) => {
        this.errorMessage = error.error.erro || 'Error sending message';
      }
    });
  }

  deleteMessage(id: string) {
    this.chatService.deleteMessage(id).subscribe({
      next: () => {
        this.loadMessages();
      },
      error: (error) => {
        this.errorMessage = error.error.erro || 'Error deleting message';
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  // Add this new method
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
