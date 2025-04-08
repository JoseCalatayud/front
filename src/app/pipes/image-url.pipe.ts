import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {
  transform(url: string | null): string {
    if (!url) return '/assets/no-image.png';

    // Corregir URLs con prefijo duplicado
    if (url.includes('http://localhost:4200http://')) {
      return url.replace('http://localhost:4200http://', 'http://');
    }

    // Asegurarse de que las URLs relativas apunten al backend
    if (url.startsWith('/images/')) {
      // Ya es una ruta relativa correcta, el proxy de Angular se encargará
      return url;
    }

    return url || '/assets/no-image.png';
  }
}
