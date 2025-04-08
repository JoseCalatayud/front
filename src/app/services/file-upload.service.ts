import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) {}

  uploadProductImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('/api/uploads/productos', formData, {
      responseType: 'text'
    });
  }
}
