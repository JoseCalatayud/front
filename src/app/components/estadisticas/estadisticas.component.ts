// src/app/components/estadisticas/estadisticas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EstadisticasService, ProductoEstadistica, UsuarioVentas, VentasPorMes } from '../../services/estadisticas.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  isAdmin: boolean = false;
  loading: boolean = false;
  error: string = '';

  // Datos de estadísticas
  productosMasVendidos: ProductoEstadistica[] = [];
  mejoresVendedores: UsuarioVentas[] = [];
  ventasPorMes: VentasPorMes[] = [];
  productoEstrella: ProductoEstadistica | null = null;

  // Filtros
  filtroFechaInicio: string = '';
  filtroFechaFin: string = '';
  filtroYear: number = new Date().getFullYear();
  filtroMonth: number = new Date().getMonth() + 1;

  // Opciones de visualización
  meses: { value: number, nombre: string }[] = [
    { value: 1, nombre: 'Enero' },
    { value: 2, nombre: 'Febrero' },
    { value: 3, nombre: 'Marzo' },
    { value: 4, nombre: 'Abril' },
    { value: 5, nombre: 'Mayo' },
    { value: 6, nombre: 'Junio' },
    { value: 7, nombre: 'Julio' },
    { value: 8, nombre: 'Agosto' },
    { value: 9, nombre: 'Septiembre' },
    { value: 10, nombre: 'Octubre' },
    { value: 11, nombre: 'Noviembre' },
    { value: 12, nombre: 'Diciembre' }
  ];

  anios: number[] = [];

  constructor(
    private estadisticasService: EstadisticasService,
    private authService: AuthService
  ) {
    // Generar lista de años (últimos 5 años)
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.anios.push(currentYear - i);
    }
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin;
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.loading = true;
    this.error = '';

    // Cargar productos más vendidos
    this.estadisticasService.getProductosMasVendidos(this.filtroFechaInicio, this.filtroFechaFin)
      .subscribe({
        next: (data) => {
          this.productosMasVendidos = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar productos más vendidos: ' +
            (err.error?.mensaje || 'Error de conexión');
          this.loading = false;
        }
      });

    // Si es admin, cargar mejores vendedores
    if (this.isAdmin) {
      this.estadisticasService.getMejoresVendedores(this.filtroFechaInicio, this.filtroFechaFin)
        .subscribe({
          next: (data) => {
            this.mejoresVendedores = data;
          },
          error: (err) => {
            console.error('Error al cargar mejores vendedores:', err);
          }
        });
    }

    // Cargar ventas por mes
    this.estadisticasService.getVentasPorMes(this.filtroYear)
      .subscribe({
        next: (data) => {
          this.ventasPorMes = data;
        },
        error: (err) => {
          console.error('Error al cargar ventas por mes:', err);
        }
      });

    // Cargar producto estrella del mes
    this.cargarProductoEstrella();
  }

  cargarProductoEstrella(): void {
    this.estadisticasService.getProductoEstrellaMes(this.filtroYear, this.filtroMonth)
      .subscribe({
        next: (data) => {
          this.productoEstrella = data;
        },
        error: (err) => {
          console.error('Error al cargar producto estrella:', err);
        }
      });
  }

  filtrarEstadisticas(): void {
    this.cargarEstadisticas();
  }

  limpiarFiltros(): void {
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
    this.filtroYear = new Date().getFullYear();
    this.filtroMonth = new Date().getMonth() + 1;
    this.cargarEstadisticas();
  }

  cambiarMes(): void {
    this.cargarProductoEstrella();
  }

  cambiarAno(): void {
    this.cargarEstadisticas();
  }

  volver(): void {
    window.history.back();
  }
}
