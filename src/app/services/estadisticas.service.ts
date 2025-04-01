import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductoEstadistica {
  id: number;
  nombre: string;
  codigoBarras: string;
  familia: string;
  precioVenta: number;
  cantidadVendida: number;
  totalVendido: number;
}

export interface ProductoVentas {
  id: number;
  nombre: string;
  codigoBarras: string;
  cantidadVendida: number;
  totalVendido: number;
  ventas: VentaDetalle[];
}

export interface VentaDetalle {
  ventaId: number;
  fecha: string;
  cantidad: number;
  subtotal: number;
  usuario: string;
}

export interface UsuarioVentas {
  id: number;
  username: string;
  cantidadVentas: number;
  cantidadProductos: number;
  totalVendido: number;
}

export interface VentasPorMes {
  mes: number;
  nombreMes: string;
  cantidadVentas: number;
  totalVendido: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor(private http: HttpClient) { }

  getProductosMasVendidos(fechaInicio?: string, fechaFin?: string): Observable<ProductoEstadistica[]> {
    let url = '/api/estadisticas/productos/mas-vendidos';

    // Agregar parámetros de fecha si están presentes
    const params: any = {};
    if (fechaInicio) params.fechaInicio = fechaInicio;
    if (fechaFin) params.fechaFin = fechaFin;

    // Convertir parámetros a cadena de consulta
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => queryParams.append(key, params[key]));

    if (Object.keys(params).length > 0) {
      url += `?${queryParams.toString()}`;
    }

    return this.http.get<ProductoEstadistica[]>(url);
  }

  getVentasProducto(productoId: number, fechaInicio?: string, fechaFin?: string): Observable<ProductoVentas> {
    let url = `/api/estadisticas/productos/${productoId}/ventas`;

    // Agregar parámetros de fecha si están presentes
    const params: any = {};
    if (fechaInicio) params.fechaInicio = fechaInicio;
    if (fechaFin) params.fechaFin = fechaFin;

    // Convertir parámetros a cadena de consulta
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => queryParams.append(key, params[key]));

    if (Object.keys(params).length > 0) {
      url += `?${queryParams.toString()}`;
    }

    return this.http.get<ProductoVentas>(url);
  }

  getMejoresVendedores(fechaInicio?: string, fechaFin?: string): Observable<UsuarioVentas[]> {
    let url = '/api/estadisticas/usuarios/mejores-vendedores';

    // Agregar parámetros de fecha si están presentes
    const params: any = {};
    if (fechaInicio) params.fechaInicio = fechaInicio;
    if (fechaFin) params.fechaFin = fechaFin;

    // Convertir parámetros a cadena de consulta
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => queryParams.append(key, params[key]));

    if (Object.keys(params).length > 0) {
      url += `?${queryParams.toString()}`;
    }

    return this.http.get<UsuarioVentas[]>(url);
  }

  getVentasPorMes(year?: number): Observable<VentasPorMes[]> {
    let url = '/api/estadisticas/ventas/por-mes';

    if (year) {
      url += `?year=${year}`;
    }

    return this.http.get<VentasPorMes[]>(url);
  }

  getProductoEstrellaMes(year?: number, month?: number): Observable<ProductoEstadistica> {
    let url = '/api/estadisticas/productos/estrella-del-mes';

    // Agregar parámetros si están presentes
    const params: any = {};
    if (year) params.year = year;
    if (month) params.month = month;

    // Convertir parámetros a cadena de consulta
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => queryParams.append(key, params[key]));

    if (Object.keys(params).length > 0) {
      url += `?${queryParams.toString()}`;
    }

    return this.http.get<ProductoEstadistica>(url);
  }
}
