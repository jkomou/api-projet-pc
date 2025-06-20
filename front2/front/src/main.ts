// src/main.ts

import { bootstrapApplication }      from '@angular/platform-browser';
import { provideRouter }             from '@angular/router';
import { provideAnimations }         from '@angular/platform-browser/animations';
import { importProvidersFrom }       from '@angular/core';
import { HttpClientModule }          from '@angular/common/http';
import { ReactiveFormsModule }       from '@angular/forms';

import { AppComponent }              from './app/app.component';
import { routes }                    from './app/app.routes';

import { MatCardModule }             from '@angular/material/card';
import { MatFormFieldModule }        from '@angular/material/form-field';
import { MatInputModule }            from '@angular/material/input';
import { MatButtonModule }           from '@angular/material/button';
import { MatTableModule }            from '@angular/material/table';
import { MatSelectModule }           from '@angular/material/select';
import { MatButtonModule as Btn }    from '@angular/material/button';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(HttpClientModule, ReactiveFormsModule),
    importProvidersFrom(
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatTableModule,
      MatSelectModule,
      Btn
    )
  ]
})
.catch(err => console.error(err));
