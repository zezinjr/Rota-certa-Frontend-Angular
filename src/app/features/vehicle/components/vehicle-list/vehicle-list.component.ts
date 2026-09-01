import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Vehicle, VehicleListResponse } from '../../models/vehicle';
import { VehicleService } from '../../service/vehicle.service';
import { extractPaginatedCount, extractPaginatedItems } from '../../../../shared/utils/paginated-response.util';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatPaginatorModule, MatTableModule],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss'
})
export class VehicleListComponent implements OnInit {
  private vehicleService = inject(VehicleService);

  vehicles: Vehicle[] = [];
  totalCount = 0;
  displayedColumns: string[] = ['plate_number', 'model', 'driver', 'capacity', 'is_active', 'actions'];
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize): void {
    this.vehicleService.getAll({ page: pageIndex + 1, page_size: pageSize }).subscribe({
      next: (response) => {
        const items = this.getVehiclesFromResponse(response);
        this.vehicles = items;
        this.totalCount = this.getTotalCountFromResponse(response, items.length);
      },
      error: (err) => {
        console.error('Erro ao carregar veículos:', err);
        this.totalCount = 0;
        this.vehicles = [];
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadVehicles(this.pageIndex, this.pageSize);
  }

  deleteVehicle(id: number): void {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      this.vehicleService.delete(id).subscribe({
        next: () => this.loadVehicles(),
        error: (err) => console.error('Erro ao excluir veículo:', err)
      });
    }
  }

  getDriverLabel(driver: Vehicle['driver']): string {
    if (!driver) return '-';
    if (typeof driver === 'object') return driver.name ?? String(driver.id ?? '-');
    return String(driver);
  }

  private getVehiclesFromResponse(response: VehicleListResponse | Vehicle[]): Vehicle[] {
    return extractPaginatedItems<Vehicle>(response);
  }

  private getTotalCountFromResponse(response: any, fallbackLength: number): number {
    return extractPaginatedCount(response, fallbackLength);
  }
}
