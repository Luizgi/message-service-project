export class Message {
  messageId: string;
  content: string;
  userId: string;
  username: string;


  constructor(messageId: string, content: string, userId: string, username: string)
  {
    this.messageId = messageId;
    this.content = content;
    this.userId = userId;
    this.username = username;
  }
}

