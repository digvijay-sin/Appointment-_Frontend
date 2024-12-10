import { Component } from '@angular/core';
import {
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MatDatepickerIntl,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import moment from 'moment';
import { HttpClient } from '@angular/common/http';
import 'moment/locale/fr';
import 'moment/locale/ja';
import { CommonModule, NgClass } from '@angular/common';
import { AppointmentService } from './book-slot.service';
import {
  FormControl,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-book-slot',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    provideMomentDateAdapter(),
    MessageService,
  ],
  imports: [
    ProgressSpinnerModule,
    ReactiveFormsModule,
    NavbarComponent,
    NgClass,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    RouterLink,
    ToastModule,
    ButtonModule,
    RippleModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './book-slot.component.html',
  styleUrls: ['./book-slot.component.scss'],
})
export class BookSlotComponent {
  readonly desc = new FormControl('', [Validators.required]);
  readonly datepick = new FormControl('', [Validators.required]);

  private readonly _adapter =
    inject<DateAdapter<unknown, unknown>>(DateAdapter);
  private readonly _intl = inject(MatDatepickerIntl);
  private readonly _http = inject(HttpClient);
  private readonly _locale = signal(inject<unknown>(MAT_DATE_LOCALE));
  slots: any[] = [];
  date: any = null;
  description: string = '';
  selectedSlot: { startTime: string; endTime: string } | null = null;
  userId: any = localStorage.getItem('userId');
  errorMessage: string = '';
  errorMessage1: string = '';
  readonly dateFormatString = computed(() => 'YYYY-MM-DD');

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onDateChange(event: any) {
    const formattedDate = moment(event.value).format('YYYY-MM-DD');
    this.date = formattedDate;
    this.slots.length = 0;
    this.errorMessage = '';
    this._http
      .get<{ slots: any[] }>(
        `http://172.20.1.91:3000/appointment/availableSlots?date=${formattedDate}`
      )
      .subscribe({
        next: (response) => {
          for (let val of Object.values(response)) {
            this.slots.push(val);
          }
        },
        error: (error) => {
          this.errorMessage =
            error.error.message || 'An unexpected error occurred';
          this.showSuccess(this.errorMessage);
        },
      });
  }

  updateCloseButtonLabel(label: string) {
    this._intl.closeCalendarLabel = label;
    this._intl.changes.next();
  }

  onSlotSelect(slot: { startTime: string; endTime: string }) {
    this.selectedSlot = slot;
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'error',
      detail: message,
    });
  }

  submit(): void {
    if (this.date && this.description && this.selectedSlot) {
      this.appointmentService
        .bookSlot(
          this.userId,
          this.date,
          this.description,
          this.selectedSlot.startTime,
          this.selectedSlot.endTime
        )
        .subscribe(
          (response) => {
            this.router.navigate(['/appointments']);
          },
          (error) => {
            this.showSuccess(error);
            console.log('Error booking appointment:', error);
          }
        );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter all the fields ',
      });
    }
  }

  isSelected(slot: { startTime: string; endTime: string }): boolean {
    return this.selectedSlot === slot;
  }
}
