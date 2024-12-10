import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://172.20.1.91:3000/register/verifytoken';
  private baseUrl = 'http://172.20.1.91:3000';

  constructor(private http: HttpClient) {}

  verifyToken(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Error verifying token:', error);
        return throwError(() => new Error('Error verifying token'));
      })
    );
  }

  refreshToken(
    refreshToken: string
  ): Observable<{ accessToken: string; refreshToken: string }> {
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.baseUrl}/register/refresh`,
      { refresh_token: refreshToken }
    );
  }
}
