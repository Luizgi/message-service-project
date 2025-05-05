import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.css'],
  standalone: true
})
export class UserAvatarComponent {
  @Input() avatarUrl: string | null = null;
  @Input() username: string = '';

  get initials(): string {
    if (!this.username) return '?';
    return this.username.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2);
  }
}
