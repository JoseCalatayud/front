import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface Usuario {
  username: string;
  rol: string;
  activo: boolean;
}

@Component({
  selector: 'app-usuario-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.css']
})
export class UsuarioListaComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  loading: boolean = true;
  error: string = '';
  filtroUsername: string = '';
  filtroRol: string = '';
  filtroEstado: string = '';
  mostrarTodos: boolean = false;

  constructor(private http: HttpClient, public authService: AuthService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.http.get<Usuario[]>('/api/usuarios').subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = [...data];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar usuarios: ' + (error.error?.mensaje || 'Error de conexión');
        this.loading = false;
        console.error('Error cargando usuarios:', error);
      }
    });
  }

  filtrarUsuarios(): void {
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const cumpleFiltroUsername = this.filtroUsername ?
        usuario.username.toLowerCase().includes(this.filtroUsername.toLowerCase()) : true;

      const cumpleFiltroRol = this.filtroRol ?
        usuario.rol === this.filtroRol : true;

      const cumpleFiltroEstado = this.filtroEstado ?
        (this.filtroEstado === 'activo' ? usuario.activo : !usuario.activo) : true;

      return cumpleFiltroUsername && cumpleFiltroRol && cumpleFiltroEstado;
    });
  }

  limpiarFiltros(): void {
    this.filtroUsername = '';
    this.filtroRol = '';
    this.filtroEstado = '';
    this.usuariosFiltrados = [...this.usuarios];
  }

  mostrarSoloActivos(): void {
    this.cargarUsuariosActivos();
    this.mostrarTodos = false;
  }

  cargarUsuariosActivos(): void {
    this.loading = true;
    this.http.get<Usuario[]>('/api/usuarios/activos').subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = [...data];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar usuarios: ' + (error.error?.mensaje || 'Error de conexión');
        this.loading = false;
      }
    });
  }

  mostrarTodosUsuarios(): void {
    this.cargarUsuarios();
    this.mostrarTodos = true;
  }

  desactivarUsuario(username: string): void {
    if (confirm('¿Estás seguro de que deseas desactivar este usuario?')) {
      this.http.put<Usuario>(`/api/usuarios/borrado/${username}`, {}).subscribe({
        next: () => {
          this.cargarUsuarios();
        },
        error: (error) => {
          this.error = 'Error al desactivar usuario: ' + (error.error?.mensaje || 'Error de conexión');
        }
      });
    }
  }

  reactivarUsuario(username: string): void {
    this.http.put<Usuario>(`/api/usuarios/activar/${username}`, {}).subscribe({
      next: () => {
        this.cargarUsuarios();
      },
      error: (error) => {
        this.error = 'Error al reactivar usuario: ' + (error.error?.mensaje || 'Error de conexión');
      }
    });
  }
}
