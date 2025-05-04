import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Message } from "../models/message.model";

@Component({
  selector: "app-message",
  standalone: true,
  imports: [FormsModule],
  templateUrl: './message.component.html',
  styleUrls: ["./message.component.css"],
})
export class MessageComponent {

  @Input() messageVarClasse: Message = new Message("", "", "", "");
  @Output() outputMessage = new EventEmitter<string>();

  onEdit() {
    this.outputMessage.emit("Text returning: come from (child) to (pai)");
  }

  onSave() {
    const messagePayload = {
      text: this.messageVarClasse.content,
      sender: this.messageVarClasse.username
    };

    fetch('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(messagePayload)
    })
    .then(response => {
      if (!response.ok) {
      throw new Error('Failed to save message');
      }
      return response.json();
    })
    .then(data => {
      console.log('Message saved successfully:', data);
    })
    .catch(error => {
      console.error('Error saving message:', error);
    });
  }
}
