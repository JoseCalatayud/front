import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ventas-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ventas-menu.component.html',
  styleUrls: ['./ventas-menu.component.css']
})
export class VentasMenuComponent implements OnInit {
  username: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.username = user.username;
    }
  }
}
