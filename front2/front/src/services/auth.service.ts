import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  mot_de_passe: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string; name: string; role: string };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  /** Inscription */
  register(data: RegisterDto): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/signup`, data);
  }

  /** Connexion */
  login(data: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data).pipe(
      tap((res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  /** Déconnexion */
  logout(): void {
    const token = localStorage.getItem('refreshToken');
    if (token) {
      this.http.post(`${this.baseUrl}/logout`, { token }).subscribe();
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.isLoggedInSubject.next(false);
  }

  /** Vérifie s'il y a un token */
  hasToken(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  /** Observable pour savoir si connecté */
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  /** Récupère l'utilisateur connecté */
  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`);
  }

  /** Récupère accessToken actuel */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}
