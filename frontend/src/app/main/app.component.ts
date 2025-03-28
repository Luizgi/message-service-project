import { TextSizeComponent } from './../textsize/textsize.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MessageComponent } from '../messages/message.component';
import { Person } from '../models/person.model';
import { Message } from '../models/message.model';
import { MessageComponentSignal } from '../message-signal/message-signal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MessageComponent, MessageComponentSignal, TextSizeComponent, TextSizeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  messageBinding: Message = new Message('1', "Texto da Mensagem via Input", "Luiz Guilherme", '1');

  title = 'frontend';

  textSize: number = 14;
}
