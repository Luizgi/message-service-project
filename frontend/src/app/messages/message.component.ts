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

  @Input() messageVarClasse : Message = new Message("", "", "", "");
  @Output() outputMessage = new EventEmitter<string>();

  onEdit(){
    this.outputMessage.emit("Text returning: come from (child) to (pai)");
  }
}
