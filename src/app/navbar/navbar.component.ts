import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { LocalService } from '../local/local.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  constructor(private router: Router, private localStore: LocalService) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: ['/book-slot'],
      },
      {
        label: 'My Appointment',
        icon: 'pi pi-star',
        routerLink: ['/appointments'],
      },

      {
        label: 'Log Out',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  logout() {
    this.localStore.removeData('token');
    this.router.navigate(['/login', { id: 1 }]);
  }
}
