import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService, Producto } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-producto-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-editar.component.html',
  styleUrls: ['./producto-editar.component.css']
})
export class ProductoEditarComponent implements OnInit {
  productoForm: FormGroup;
  loading = false;
  error = '';
  id: number;
  familias = ['Informática', 'Electrónica', 'Telefonía', 'Audio/Video', 'Accesorios'];
  producto: Producto | null = null;
  username: string | undefined;
  isAdmin: boolean | undefined;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private authService: AuthService,
    private fileUploadService: FileUploadService
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.productoForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      familia: ['', [Validators.required]],
      fotografia: [''],
      precioVenta: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.username = user.username;
      this.isAdmin = user.rol === 'ADMIN';
    }
    this.cargarProducto();
  }

  cargarProducto(): void {
    this.loading = true;
    this.productoService.obtenerProductoPorId(this.id).subscribe({
      next: (producto) => {
        this.producto = producto;
        this.productoForm.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          familia: producto.familia,
          fotografia: producto.fotografia,
          precioVenta: producto.precioVenta
        });

        // Si hay una fotografía, mostrarla en la vista previa
        if (producto.fotografia) {
          this.previewUrl = producto.fotografia;
        }

        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar el producto';
        this.loading = false;
        console.error('Error al cargar producto:', error);
      }
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.productoForm.invalid || !this.producto) {
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.selectedFile) {
      // Corregir el método a llamar - usar uploadProductImage en lugar de uploadFile
      this.fileUploadService.uploadProductImage(this.selectedFile).subscribe({
        next: (imagePath: string) => {
          this.productoForm.patchValue({ fotografia: imagePath });
          this.actualizarProducto();
        },
        error: (error: any) => {
          this.error = 'Error al subir la imagen: ' + (error.message || 'Error desconocido');
          this.loading = false;
          console.error('Error al subir imagen:', error);
        }
      });
    } else {
      this.actualizarProducto();
    }
  }

  actualizarProducto(): void {
    this.productoService.actualizarProducto(this.id, this.productoForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['/productos/listar']);
        },
        error: (error) => {
          this.error = error.error?.mensaje || 'Error al actualizar el producto';
          this.loading = false;
          console.error('Error al actualizar producto:', error);
        }
      });
  }

  volver(): void {
    this.router.navigate(['/productos/listar']);
  }
}
