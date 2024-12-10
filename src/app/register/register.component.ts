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
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LocalService } from '../local/local.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly phone = new FormControl('', [
    Validators.required,
    Validators.maxLength(10),
    Validators.minLength(10),
  ]);
  readonly name = new FormControl('', [Validators.required]);
  readonly password = new FormControl('', [Validators.required]);
  readonly confirmPassword = new FormControl('', [Validators.required]);
  errorMessage = signal('');
  constructor(
    private http: HttpClient,
    private router: Router,
    private localStore: LocalService
  ) {
    merge(
      this.email.statusChanges,
      this.email.valueChanges,
      this.phone.statusChanges,
      this.phone.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
    const token = this.localStore.getData('token');
    if (token) {
      this.router.navigate(['/book-slot']);
    }
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }

    if (this.phone.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.phone.hasError('minlength')) {
      this.errorMessage.set('Not a valid phone number');
    } else {
      this.errorMessage.set('');
    }
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  submit() {
    if (
      this.name.valid &&
      this.email.valid &&
      this.phone.valid &&
      this.password.valid &&
      this.confirmPassword.valid
    ) {
      const payload = {
        name: this.name.value,
        password: this.password.value,
        confirmPassword: this.confirmPassword.value,
        email: this.email.value,
        phone: this.phone.value,
      };

      this.http
        .post('http://172.20.1.91:3000/register/createUser', payload)
        .subscribe({
          next: (response) => {
            console.log('User registered successfully:', response);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Error registering user:', error);
          },
        });
    } else {
      console.error('Form is invalid');
    }
  }
}
