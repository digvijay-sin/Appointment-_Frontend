import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { LocalService } from './local/local.service';

@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private localStore: LocalService
  ) {}

  canActivate(): Observable<any> {
    const token = this.localStore.getData('token');

    if (!token) {
      this.router.navigate(['/login']);
      return of(false);
    }

    return this.authService.verifyToken(token).pipe(
      map((response) => {
        if (response && response.valid) {
          return true;
        } else {
          return this.handleTokenRefresh();
        }
      }),
      catchError(() => this.handleTokenRefresh())
    );
  }

  private handleTokenRefresh(): Observable<boolean> {
    const refreshToken = this.localStore.getData('refreshtoken');
    console.log('Current Refresh Token:', refreshToken);

    if (!refreshToken) {
      this.router.navigate(['/login']);
      return of(false);
    }

    return new Observable<boolean>((observer) => {
      this.authService.refreshToken(refreshToken).subscribe({
        next: (newTokens) => {
          console.log('New Tokens Response:', newTokens);

          if (newTokens && newTokens.accessToken && newTokens.refreshToken) {
            console.log('Storing New Access Token:', newTokens.accessToken);
            console.log('Storing New Refresh Token:', newTokens.refreshToken);

            this.localStore.setData('token', newTokens.accessToken);
            this.localStore.setData('refreshtoken', newTokens.refreshToken);

            this.authService.verifyToken(newTokens.accessToken).subscribe({
              next: (response) => {
                if (response && response.valid) {
                  observer.next(true);
                } else {
                  console.log('Error verifying new access token');
                  this.router.navigate(['/login']);
                  observer.next(false);
                }
                observer.complete();
              },
              error: () => {
                console.log('Error verifying new access token');
                this.router.navigate(['/login']);
                observer.next(false);
                observer.complete();
              },
            });
          } else {
            console.log('Invalid new tokens received');
            this.router.navigate(['/login']);
            observer.next(false);
            observer.complete();
          }
        },
        error: () => {
          console.log('Error refreshing token');
          this.router.navigate(['/login']);
          observer.next(false);
          observer.complete();
        },
      });
    });
  }
}
