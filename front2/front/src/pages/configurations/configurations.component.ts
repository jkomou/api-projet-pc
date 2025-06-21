import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent {
  // Exemple de données statiques pour test
  configurations = [
    {
      id: 1,
      user: 'Alice Dupont',
      date: new Date(),
      composants: ['CPU Intel i7', 'GPU Nvidia RTX 3080', 'RAM 16GB'],
      total: 1500
    },
    {
      id: 2,
      user: 'Bob Martin',
      date: new Date(),
      composants: ['CPU AMD Ryzen 5', 'GPU AMD Radeon RX 6700', 'RAM 32GB'],
      total: 1300
    }
  ];
}
