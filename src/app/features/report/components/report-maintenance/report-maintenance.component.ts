import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-report-maintenance',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './report-maintenance.component.html',
  styleUrl: './report-maintenance.component.scss'
})
export class ReportMaintenanceComponent {
  private route = inject(ActivatedRoute);

  title = this.route.snapshot.data['title'] ?? 'Página em manutenção';
  description = this.route.snapshot.data['description'] ?? 'Esta funcionalidade ainda não está disponível.';
}
