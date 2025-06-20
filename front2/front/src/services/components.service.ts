import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface ComponentItem {
  id:         number;
  title:      string;
  category:   string;
  brand:      string;
  price:      number;
  // ajoute ici d’autres champs si nécessaire (description, specifications…)
}

// src/app/services/components.service.ts
@Injectable({ providedIn: 'root' })
export class ComponentsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

// src/app/services/components.service.ts
getCategories(): Observable<string[]> {
    return this.http
      .get<{ id: number; nom: string }[]>(`${this.baseUrl}/categories`)
      .pipe(
        map(arr => arr.map(c => c.nom))  // on ne conserve que le nom
      );
  }

  deleteComponent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/composants/${id}`);
  }

  getComponents(): Observable<ComponentItem[]> {
    return this.http.get<ComponentItem[]>(`${this.baseUrl}/composants`);
  }
}
