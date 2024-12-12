import { Component, DestroyRef, inject, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ExtractErrorsDirective } from '../../directives/extract-errors.directive';
import { Appointment } from '../../models/appointment';
import { Store } from '@ngrx/store';
import * as actions from '../../store/actions/appointments.actions';
import { provideNativeDateAdapter } from '@angular/material/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

export interface AppointmentDialogData {
  date: Date;
  appointment?: Appointment;
}
export interface AppointmentDialogResult {
  appointmentId: string
  date: Date;
  time: string;
  description: string;
}

@Component({
  selector: 'app-appointment-dialog',
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    ReactiveFormsModule,

    ExtractErrorsDirective,

    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './appointment-dialog.component.html',
  styleUrl: './appointment-dialog.component.scss'
})
export class AppointmentDialogComponent implements OnInit {
  private destroyRef$ = inject(DestroyRef);

  form = new FormGroup({
    date: new FormControl<Date>(new Date(), {
      nonNullable: true,
      validators: [Validators.required]
    }),
    time: new FormControl<string>('10:25', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    })
  });


  constructor(
    private store: Store<{ appointments: Appointment[] }>,
    private dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppointmentDialogData) {
  }

  ngOnInit(): void {
    this.updateForm();

    this.form.valueChanges
      .pipe(
        debounceTime(100),
        takeUntilDestroyed(this.destroyRef$))
      .subscribe(formValue => {
        console.log(formValue);
      });
  }

  private updateForm() {
    this.form.patchValue({
      date: this.data.date,
    });

    const appointment = this.data?.appointment;
    if (!appointment) {
      return;
    }

    this.form.patchValue({
      date: appointment.date,
      time: appointment.time,
      description: appointment.description
    });
  }

  submit() {
    if (this.form.invalid) return;

    const result: AppointmentDialogResult = {
      // init if this is not an update
      appointmentId: new Date().getTime().toString(),
      // date: this.data.date,

      // override
      ...this.data?.appointment,
      ...this.form.getRawValue()
    };

    this.dialogRef.close(result);
  }

  cancel() {
    this.dialogRef.close();
  }

  onDelete() {
    this.store.dispatch(actions.appointmentsActions.removeAppointment({ appointmentId: this.data.appointment!.appointmentId }))
    this.dialogRef.close();
  }
}
