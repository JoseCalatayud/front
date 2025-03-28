import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isAdmin: boolean = false;
  username: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.username = user.username;

    // Cambiar esta línea - el rol ahora es una propiedad directa
    this.isAdmin = user.rol === 'ADMIN';

    // Depuración
    console.log('Usuario en Dashboard:', user);
    console.log('¿Es admin?:', this.isAdmin);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
