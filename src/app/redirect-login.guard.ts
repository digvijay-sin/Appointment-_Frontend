// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { Observable, catchError, map, of } from 'rxjs';
// import { AuthService } from './auth.service';
// import { LocalService } from './local/local.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthRedirectGuard implements CanActivate {
//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private localStore: LocalService
//   ) {}
//   canActivate(): Observable<boolean> | Promise<boolean> | boolean {
//     const token = this.localStore.getData('token');
//     if (!token) {
//       this.router.navigate(['/login']);
//     } else if (this.authService.verifyToken(token)) {
//       this.router.navigate(['/book-slot']);
//       return false;
//     }
//     return true;
//   }
// }
