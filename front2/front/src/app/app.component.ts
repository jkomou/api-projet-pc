// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterModule, RouterOutlet, NavbarComponent ],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>`
})
export class AppComponent {}
