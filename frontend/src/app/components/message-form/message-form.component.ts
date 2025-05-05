import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.css'],
  standalone: true,
})
export class MessageFormComponent {
  @Output() send = new EventEmitter<string>();

  messageContent = '';
  maxLength = 280;

  sendMessage() {
    if (this.messageContent.trim()) {
      this.send.emit(this.messageContent);
      this.messageContent = '';
    }
  }
}
