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
  userNames: Map<string, string> = new Map();
  userAvatars: Map<string, string> = new Map();

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
        // Carregar os nomes dos usuários para cada mensagem
        messages.forEach(message => {
          if (!this.userNames.has(message.usuarioId)) {
            this.chatService.getUserInfo(message.usuarioId).subscribe({
              next: (user) => {
                this.userNames.set(message.usuarioId, user.nome);
              },
              error: (error) => {
                console.error('Erro ao carregar informações do usuário:', error);
                this.userNames.set(message.usuarioId, 'Usuário desconhecido');
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  getUserName(userId: string): string  {
    return this.userNames.get(userId) || 'Loading...';
    this.chatService.getUserInfo(userId).subscribe({
      next: (user) => {
        this.userNames.set(userId, user.nome);
      },
      error: (error) => {
        console.error('Erro ao carregar informações do usuário:', error);
        this.userNames.set(userId, 'Usuário desconhecido');
      }
    });
  }

  getUserAvatar(userId: string): string {
    if (!this.userAvatars.has(userId)) {
      this.chatService.getUserInfo(userId).subscribe({
        next: (user) => {
          this.userAvatars.set(userId, user.foto || 'assets/default-avatar.png');
        },
        error: (error) => {
          console.error('Erro ao carregar foto do usuário:', error);
          this.userAvatars.set(userId, 'assets/default-avatar.png');
        }
      });
      return 'assets/default-avatar.png';
    }
    return this.userAvatars.get(userId) || 'assets/default-avatar.png';
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

  editMessage(id: string, newContent: string) {
    this.chatService.editMessage(id, newContent).subscribe({
      next: () => {
        this.loadMessages();
      },
      error: (error) => {
        this.errorMessage = error.error.erro || 'Error editing message';
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  startEdit(message: Message) {
    message.isEditing = true;
    message.editText = message.texto;
  }

  cancelEdit(message: Message) {
    message.isEditing = false;
    message.editText = '';
  }

  saveEdit(message: Message) {
    if (!message.editText || message.editText.trim() === '') {
      return;
    }

    this.chatService.editMessage(message._id, message.editText).subscribe({
      next: () => {
        message.isEditing = false;
        this.loadMessages();
      },
      error: (error) => {
        this.errorMessage = error.error.erro || 'Erro ao editar mensagem';
      }
    });
  }
}
