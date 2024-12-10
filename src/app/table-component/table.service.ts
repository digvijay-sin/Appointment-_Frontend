import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Meeting } from './table-model';
import { LocalService } from '../local/local.service';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private apiUrl = 'http://172.20.1.91:3000/appointment/userWithAppointment';
  private validateApi = 'http://172.20.1.91:3000/appointment/userData';
  private apiUrlDelete = 'http://172.20.1.91:3000/appointment';

  constructor(private http: HttpClient, private localStore: LocalService) {}

  getUserData(): Observable<Meeting[]> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      return throwError(() => new Error('User ID not found in local storage'));
    }

    const url = `${this.validateApi}?userId=${userId}`;

    return this.http.get<Meeting[]>(url);
  }

  getMeetings(): Observable<Meeting[]> {
    const token = this.localStore.getData('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
    });

    return this.http.get<Meeting[]>(this.apiUrl, { headers });
  }

  deleteMeeting(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlDelete}/delete?id=${id}`);
  }
}
