// src/app/app.routes.ts
import type { Routes } from '@angular/router';

import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { HomeComponent } from '../pages/home/home.component';
import { ComponentsListComponent } from '../pages/components-list/components-list';

// ✅ Corriger les chemins des nouveaux composants
import { CatalogueComponent } from '../pages/catalogue/catalogue.component';
import { ConfigurationsComponent } from '../pages/configurations/configurations.component';
import { PartenairesComponent } from '../pages/partenaires/parternaires.components';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'components', component: ComponentsListComponent },
  { path: 'catalogue', component: CatalogueComponent },
  { path: 'configurations', component: ConfigurationsComponent },
  { path: 'partenaires', component: PartenairesComponent },
];
