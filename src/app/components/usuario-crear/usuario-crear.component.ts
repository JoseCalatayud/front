import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuario-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-crear.component.html',
  styleUrls: ['./usuario-crear.component.css']
})
export class UsuarioCrearComponent implements OnInit {
  usuarioForm: FormGroup;
  loading = false;
  error = '';
  roles = ['ADMIN', 'USER'];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.usuarioForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]],
      rol: ['USER', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
  }

  // Validador personalizado para verificar que las contraseñas coinciden
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmarPassword = form.get('confirmarPassword')?.value;

    if (password !== confirmarPassword) {
      form.get('confirmarPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {
    if (this.usuarioForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const usuarioData = {
      username: this.usuarioForm.value.username,
      password: this.usuarioForm.value.password,
      rol: this.usuarioForm.value.rol
    };

    this.http.post('/api/usuarios', usuarioData).subscribe({
      next: () => {
        this.router.navigate(['/usuarios/listar']);
      },
      error: error => {
        this.error = error.error?.mensaje || 'Error al crear el usuario';
        this.loading = false;
        console.error('Error al crear usuario:', error);
      }
    });
  }

  volver() {
    this.router.navigate(['/usuarios']);
  }
}
