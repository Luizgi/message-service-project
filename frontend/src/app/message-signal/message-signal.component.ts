import { FormsModule } from "@angular/forms";
import { Component, input, Output, EventEmitter } from '@angular/core';

import { Message } from '../models/message.model';

@Component({
  selector: 'app-message-signal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './message-signal.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponentSignal{
  messageVarClasse = input<Message>(new Message("", "", "", ""));

  @Output() outputMessage = new EventEmitter<string>();

  onEdit(){
    this.outputMessage.emit("Text come by signal: came from (child) to (pai)");
  }
}
