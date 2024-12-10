import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = 'http://172.20.1.91:3000/appointment/bookSlot';

  constructor(private http: HttpClient) {}

  bookSlot(
    userId: string,
    date: string,
    description: string,
    startTime: string,
    endTime: string
  ): Observable<any> {
    const payload = {
      userId,
      date,
      description,
      startTime,
      endTime,
    };

    return this.http.post<any>(this.apiUrl, payload);
  }
}
