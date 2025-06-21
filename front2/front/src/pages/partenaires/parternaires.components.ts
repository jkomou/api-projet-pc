import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-partenaires',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './partenaires.component.html',
  styleUrls: ['./partenaires.component.scss']
})
export class PartenairesComponent {
  // Liste des partenaires existants
  partenaires = [
    { id: 1, nom: 'Site A', url: 'https://sitea.com', syncInfo: 'Synchronisation quotidienne', affiliation: '10% commission' },
    { id: 2, nom: 'Site B', url: 'https://siteb.com', syncInfo: 'Synchronisation hebdomadaire', affiliation: '15% commission' }
  ];

  // Objet pour stocker les données du nouveau partenaire en cours d'ajout
  nouveauPartenaire = {
    nom: '',
    url: '',
    syncInfo: '',
    affiliation: ''
  };

  ajouterPartenaire() {
    if (!this.nouveauPartenaire.nom || !this.nouveauPartenaire.url) {
      alert('Merci de remplir au minimum le nom et l\'URL du partenaire');
      return;
    }
    const newId = this.partenaires.length > 0 ? Math.max(...this.partenaires.map(p => p.id)) + 1 : 1;
    this.partenaires.push({ id: newId, ...this.nouveauPartenaire });
    // Réinitialiser le formulaire
    this.nouveauPartenaire = { nom: '', url: '', syncInfo: '', affiliation: '' };
  }

  supprimerPartenaire(id: number) {
    this.partenaires = this.partenaires.filter(p => p.id !== id);
  }
}


