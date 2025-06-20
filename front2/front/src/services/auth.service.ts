import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface RegisterDto {
  name:     string;
  email:    string;
  password: string;
}

export interface LoginDto {
  email:    string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user:  { id: string; name: string; role: string };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  /** Inscription */
  register(data: RegisterDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/register`,
      data
    );
  }

  /** Connexion */
  login(data: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/login`,
      data
    );
  }
}
