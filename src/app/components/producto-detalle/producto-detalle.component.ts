import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService, Producto } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { ImageUrlPipe } from '../../pipes/image-url.pipe';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageUrlPipe],
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent implements OnInit {
  producto: Producto | null = null;
  loading: boolean = true;
  error: string = '';
  username: string = '';
  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.username = user.username;
      this.isAdmin = user.rol === 'ADMIN';
    }
    this.cargarProducto();
  }

  cargarProducto(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;

    this.productoService.obtenerProductoPorId(id).subscribe({
      next: (data) => {
        this.producto = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el producto. Por favor, inténtelo de nuevo.';
        this.loading = false;
        console.error('Error al cargar producto:', err);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/productos/listar']);
  }
}
