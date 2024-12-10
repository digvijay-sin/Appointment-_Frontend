import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocalService } from '../local/local.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ToastModule,
    ButtonModule,
    RippleModule,
    RouterLink,
    MatListModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  errorMessage = signal('');

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStore: LocalService,
    private messageService: MessageService
  ) {
    const token = this.localStore.getData('token');
    if (token) {
      this.router.navigate(['/book-slot']);
    }
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'error',
      detail: message,
    });
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }

    if (this.password.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.password.hasError('minlength')) {
      this.errorMessage.set('You must enter at least 3 characters');
    } else {
      this.errorMessage.set('');
    }
  }

  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  submitLogin() {
    if (this.email.valid && this.password.valid) {
      const payload = {
        email: this.email.value,
        password: this.password.value,
      };

      this.http
        .post<{
          accesstoken: string;
          refreshToken: string;
          user: { _id: string };
        }>('http://172.20.1.91:3000/register/login', payload)
        .subscribe({
          next: (response) => {
            localStorage.clear();
            console.log(response);
            localStorage.setItem('token', response.accesstoken);
            localStorage.setItem('refreshtoken', response.refreshToken);
            localStorage.setItem('userId', response.user._id);

            this.router.navigate(['/book-slot']);
          },
          error: (error) => {
            this.showSuccess(error.error.message);
            if (error.error && error.error.message) {
              this.errorMessage.set(error.error.message);
            } else {
              this.errorMessage.set('An unexpected error occurred');
            }
          },
        });
    } else {
      this.updateErrorMessage();
    }
  }
}
