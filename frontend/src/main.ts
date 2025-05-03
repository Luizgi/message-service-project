import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/main/app.component';
import { routes } from '../src/app/core/routes/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes) // Adiciona as rotas aqui
  ]
}).catch(err => console.error(err));
