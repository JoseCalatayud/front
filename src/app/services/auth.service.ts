import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtResponse } from '../models/jwt-response.model'; // Añade esta importación

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  public get isAdmin(): boolean {
    const isAdmin = this.currentUserValue && this.currentUserValue.rol === 'ADMIN';
    console.log('Usuario actual:', this.currentUserValue);
    console.log('¿Es administrador?:', isAdmin);
    return isAdmin;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<JwtResponse>('/api/auth/login', { username, password })
      .pipe(
        tap(jwt => {
          console.log('JWT respuesta:', jwt);

          // Asegurarse de que el rol sea exactamente como se espera (eliminar espacios)
          const rolNormalizado = jwt.rol.trim();

          // Almacenar datos del usuario y token JWT
          const userData = {
            username: jwt.username,
            rol: rolNormalizado,
            token: jwt.token
          };

          console.log('Guardando en localStorage:', userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          this.currentUserSubject.next(userData);

          // Verificar después de establecer los datos
          setTimeout(() => {
            console.log('Verificación después de login - Es admin:', this.isAdmin);
          }, 100);
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue && this.currentUserValue.token;
  }
}
