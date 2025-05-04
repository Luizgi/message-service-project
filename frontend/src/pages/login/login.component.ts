import { Component } from '@angular/core';
import { FormComponent } from '../../app/form/form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormComponent]
})
export class LoginComponent {
  onFormSubmit(formData: any): void {
    console.log('Login Data:', formData);
  }
}
