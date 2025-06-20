import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select'; 
import { MatTableModule } from '@angular/material/table';
import { ComponentItem, ComponentsService } from '../../services/components.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule }       from '@angular/material/icon';


@Component({
  selector: 'app-components-list',
  templateUrl: './components-list.html',
  styleUrl: './components-list.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    FormsModule,
    MatIconModule,
    MatSnackBarModule
  ],
})
export class ComponentsListComponent implements OnInit {
  categories: string[] = [];
  components: ComponentItem[] = [];
  filteredComponents: ComponentItem[] = [];
  selectedCategory = '';
  selectedBrand = '';

  constructor(private svc: ComponentsService,
    private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.svc.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.svc.getComponents().subscribe(items => {
      console.log('raw items:', items);
      this.components = items;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredComponents = this.components.filter(item => {
      const matchesCategory = !this.selectedCategory || item.category === this.selectedCategory;
      const matchesBrand = !this.selectedBrand ||
        item.brand.toLowerCase().includes(this.selectedBrand.toLowerCase());
      return matchesCategory && matchesBrand;
    });
  }

  deleteComponent(id: number): void {
    this.svc.deleteComponent(id).subscribe({
      next: () => {
        this.snack.open('Composant supprimé', 'OK', { duration: 2000 });
        this.components = this.components.filter(c => c.id !== id);
        this.applyFilters();
      },
      error: err => {
        console.error(err);
        this.snack.open('Erreur lors de la suppression', 'OK', { duration: 2000 });
      }
    });
  }
}
