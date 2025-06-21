// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterModule, RouterOutlet, NavbarComponent, MatCardModule, MatButtonModule ],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>`
})
export class AppComponent {
  constructor(private router: Router) {}

  logout() {
    // Tu peux ici supprimer le token, effacer la session, etc.
    localStorage.removeItem('accessToken'); // ou ton système d'auth
    this.router.navigate(['/login']);
  }
}


