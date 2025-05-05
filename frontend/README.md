# Message Service Frontend

An Angular-based frontend application for a real-time messaging system with user authentication and real-time message updates.

## Features

- User Authentication
- Real-time Message Updates
- Profile Picture Support
- Responsive Design
- Form Validation
- Route Protection
- Token-based Authentication

## Prerequisites

- Node.js (v14 or higher)
- Angular CLI (v17 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
```

## Development Server

Run the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Project Structure

```plaintext
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── feed/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── message.service.ts
│   │   └── app.component.ts
│   ├── assets/
│   └── styles.css
```

## Components

### Login Component
- User authentication
- Form validation
- Error handling
- Redirect to chat on successful login

### Signup Component
- New user registration
- Profile picture upload
- Form validation
- Password requirements

### Feed Component
- Real-time message display
- Message sending
- Auto-refresh functionality
- Token validation

## Styling

- Custom CSS for responsive design
- Clean and modern UI
- Form styling
- Error message display

## Security Features

- JWT token storage
- Route guards
- Form validation
- Secure password handling

## Build

To build the project for production:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Configuration

The application is configured to:
- Connect to backend at `http://localhost:3000`
- Handle JWT authentication
- Manage file uploads
- Support responsive design

## Error Handling

- Form validation errors
- API request errors
- Authentication failures
- Network issues

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC License
