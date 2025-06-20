// src/app/app.routes.ts
import type { Routes } from '@angular/router';
import { LoginComponent }    from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { HomeComponent }     from '../pages/home/home.component';
import { ComponentsListComponent } from '../pages/components-list/components-list';

export const routes: Routes = [
  { path: '',         redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home',     component: HomeComponent },
  //{ path: '**',       redirectTo: 'login' },
  { path: 'components', component: ComponentsListComponent },
];
