export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    country: string;
    interests: string[];
  }
  
  export interface SignupForm extends Omit<User, 'id'> {
    password: string;
    confirmPassword: string;
    avatarFile?: File;
  }
  
  export interface LoginForm {
    email: string;
    password: string;
  }