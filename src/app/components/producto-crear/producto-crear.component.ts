import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService, Producto } from '../../services/producto.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-producto-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-crear.component.html',
  styleUrls: ['./producto-crear.component.css']
})
export class ProductoCrearComponent implements OnInit {
  productoForm: FormGroup;
  loading = false;
  error = '';
  familias = ['Informática', 'Electrónica', 'Telefonía', 'Audio/Video', 'Accesorios'];
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private productoService: ProductoService,
    private fileUploadService: FileUploadService
  ) {
    this.productoForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      codigoBarras: ['', [Validators.required, Validators.pattern('^[0-9]{12,13}$')]],
      familia: ['', [Validators.required]],
      fotografia: [''],
      precioVenta: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {}

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.previewImage();
    }
  }

  previewImage(): void {
    if (!this.selectedFile) {
      this.previewUrl = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  onSubmit() {
    if (this.productoForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    // Si hay un archivo seleccionado, súbelo primero
    if (this.selectedFile) {
      this.fileUploadService.uploadProductImage(this.selectedFile).subscribe({
        next: (imagePath) => {
          // Actualiza el formulario con la ruta de la imagen
          this.productoForm.patchValue({ fotografia: imagePath });
          this.crearProducto();
        },
        error: (error) => {
          this.error = 'Error al subir la imagen: ' + error.message;
          this.loading = false;
        }
      });
    } else {
      this.crearProducto();
    }
  }

  private crearProducto() {
    this.productoService.crearProducto(this.productoForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['/productos/listar']);
        },
        error: error => {
          this.error = error.error?.mensaje || 'Error al crear el producto';
          this.loading = false;
          console.error('Error al crear producto:', error);
        }
      });
  }

  volver() {
    this.router.navigate(['/productos']);
  }
}
