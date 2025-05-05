import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SignupForm } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  countries: string[] = ['Brazil', 'USA', 'Germany', 'Japan'];
  interests: string[] = ['Tech', 'Music', 'Gaming', 'Travel'];
  isSubmitting = false;
  avatarPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      interests: this.fb.array([], Validators.required)
    }, { validators: this.passwordsMatchValidator });
  }

  get formControls() {
    return this.signupForm.controls;
  }

  get interestsInvalid() {
    return (this.signupForm.get('interests') as FormArray).length === 0;
  }

  get interestsTouched() {
    return this.signupForm.get('interests')?.touched;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.avatarPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onInterestChange(event: any) {
    const interestsArray = this.signupForm.get('interests') as FormArray;
    if (event.target.checked) {
      interestsArray.push(this.fb.control(event.target.value));
    } else {
      const index = interestsArray.controls.findIndex(x => x.value === event.target.value);
      interestsArray.removeAt(index);
    }
    interestsArray.markAsTouched();
  }

  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    this.isSubmitting = true;
    const formValue: SignupForm = this.signupForm.value;

    this.authService.signup(formValue).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.isSubmitting = false;
      }
    });
  }
}
