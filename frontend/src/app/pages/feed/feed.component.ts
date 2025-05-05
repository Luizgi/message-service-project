import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageCardComponent } from '../../components/message-card/message-card.component';
import { MessageFormComponent } from '../../components/message-form/message-form.component';
import { UserAvatarComponent } from '../../components/user-avatar/user-avatar.component';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';
import { Message } from '../../models/message.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, MessageCardComponent, MessageFormComponent, UserAvatarComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  messages: Message[] = [];
  isLoading = true;
  currentUser: User | null = null;

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadMessages();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  loadMessages() {
    this.isLoading = true;
    this.messageService.getMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading messages', error);
        this.isLoading = false;
      }
    });
  }

  sendMessage(content: string) {
    if (!this.currentUser) return;
    
    const newMessage: Partial<Message> = {
      content,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userAvatar: this.currentUser.avatar || ''
    };
    
    this.messageService.createMessage(newMessage).subscribe({
      next: (message) => {
        this.messages.unshift(message);
      },
      error: (error) => {
        console.error('Error sending message', error);
      }
    });
  }

  updateMessage(data: { id: string, content: string }) {
    this.messageService.updateMessage(data.id, data.content).subscribe({
      next: (updatedMessage) => {
        const index = this.messages.findIndex(m => m.id === updatedMessage.id);
        if (index !== -1) {
          this.messages[index] = updatedMessage;
          this.messages = [...this.messages];
        }
      },
      error: (error) => {
        console.error('Error updating message', error);
      }
    });
  }

  deleteMessage(id: string) {
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.messages = this.messages.filter(m => m.id !== id);
      },
      error: (error) => {
        console.error('Error deleting message', error);
      }
    });
  }
}
