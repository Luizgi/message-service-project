import { Component } from '@angular/core';
import { FormComponent } from '../../app/form/form.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [FormComponent]
})
export class SignupComponent {
  onFormSubmit(formData: any): void {
    console.log('Signup Data:', formData);
    // Aqui você pode enviar os dados para o backend ou realizar outras ações
  }
}
