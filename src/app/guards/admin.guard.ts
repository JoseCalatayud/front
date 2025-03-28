import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usar directamente la propiedad isAdmin del servicio
  if (authService.isAdmin) {
    return true;
  }

  // Alternativamente, si prefieres la lógica explícita:
  // if (authService.currentUserValue && authService.currentUserValue.rol === 'ADMIN') {
  //   return true;
  // }

  // No es admin, redirigir al Dashboard o productos
  router.navigate(['/dashboard']);
  return false;
};
