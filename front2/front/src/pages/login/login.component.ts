import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthResponse, AuthService } from '../../services/auth.service'; // ajuste le chemin si besoin

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    mot_de_passe: ['', Validators.required] // correspond à la BDD et au backend
  });

  }

 onSubmit() {
  if (this.loginForm.invalid) return;

  const formValue = this.loginForm.value;

  // Crée un objet avec les bonnes clés pour l'API
  const loginPayload = {
  email: formValue.email,
  mot_de_passe: formValue.mot_de_passe   // pas 'password' ni un hash
};

  console.log('Payload envoyé:', loginPayload);

  this.auth.login(loginPayload).subscribe({
    next: (res) => {
      this.router.navigate(['/home']);
    },
    error: (err) => {
      console.error('Erreur login:', err);
    }
  });
}


}
