import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Meeting } from './table-model';
import { TableService } from './table.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-table-component',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    NavbarComponent,
    ToastModule,
    ButtonModule,
    RippleModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './table-component.component.html',
  styleUrl: './table-component.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class TableComponentComponent implements OnInit {
  displayedColumns: string[] = [
    'date',
    'description',
    'startTime',
    'userName',
    'userEmail',
    'userPhone',
    'actions',
  ];
  dataSource: Meeting[] = [];
  temp: any[] = [];

  constructor(
    private readonly tableService: TableService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.tableService.getMeetings().subscribe({
      next: (response) => {
        this.dataSource = response;
        console.log(this.dataSource);
      },
      error: (error) => {
        if (error.error.statusCode === 403) {
          this.tableService.getUserData().subscribe({
            next: (response) => {
              this.dataSource = response;
            },
          });
        }
      },
    });
  }

  show() {
    this.messageService.add({
      severity: 'info',
      summary: 'Confirmation',
      detail: 'Appoinment cancelled!',
    });
  }

  show2() {
    this.messageService.add({
      severity: 'error',
      summary: 'Process resumed',
      detail: 'Appoinment still exist!',
    });
  }

  confirm2(event: Event, id: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to cancel this appointment?',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.deleteMeeting(id);
        this.show();
      },
      reject: () => {
        this.show2();
      },
    });
  }

  deleteMeeting(id: string): void {
    this.tableService.deleteMeeting(id).subscribe({
      next: () => {
        const updatedDataSource: Meeting[] = [];

        for (const meeting of this.dataSource) {
          if (meeting.id !== id) {
            updatedDataSource.push(meeting);
          }
        }

        this.dataSource = updatedDataSource;

        this.loadMeetings();
      },
      error: (error) => {
        console.error('Error deleting meeting:', error);
      },
    });
  }
}
