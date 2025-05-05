import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '../../models/message.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.css'],
  standalone: true,
  imports: [],
})
export class MessageCardComponent {
  @Input() message!: Message;
  @Output() delete = new EventEmitter<string>();
  @Output() update = new EventEmitter<{ id: string, content: string }>();

  isEditing = false;
  editContent = '';
  canEdit = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.editContent = this.message.content;
    this.authService.currentUser$.subscribe(user => {
      this.canEdit = user?.id === this.message.userId;
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.editContent = this.message.content;
  }

  cancelEdit() {
    this.isEditing = false;
    this.editContent = this.message.content;
  }

  saveEdit() {
    if (this.editContent.trim() !== '') {
      this.update.emit({
        id: this.message.id,
        content: this.editContent
      });
      this.isEditing = false;
    }
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this message?')) {
      this.delete.emit(this.message.id);
    }
  }
}
