import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent {
  categories = ['CPU', 'GPU', 'RAM', 'Carte mère', 'Stockage'];
  selectedCategory = '';
  selectedBrand = '';
  
  components = [
    { id: 1, nom: 'Intel i7', type: 'CPU', marque: 'Intel', prix: 300 },
    { id: 2, nom: 'Nvidia RTX 3080', type: 'GPU', marque: 'Nvidia', prix: 800 },
    { id: 3, nom: 'Corsair 16GB', type: 'RAM', marque: 'Corsair', prix: 120 }
  ];

  filteredComponents = [...this.components];

  applyFilters() {
    this.filteredComponents = this.components.filter(c => {
      return (this.selectedCategory === '' || c.type === this.selectedCategory) &&
             (this.selectedBrand === '' || c.marque.toLowerCase().includes(this.selectedBrand.toLowerCase()));
    });
  }
}
