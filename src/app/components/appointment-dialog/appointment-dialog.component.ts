import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ExtractErrorsDirective } from '../../directives/extract-errors.directive';
import { Appointment } from '../../models/appointment';

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
  imports: [
    FormsModule,
    ReactiveFormsModule,

    ExtractErrorsDirective,

    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './appointment-dialog.component.html',
  styleUrl: './appointment-dialog.component.scss'
})
export class AppointmentDialogComponent implements OnInit {

  form = new FormGroup({
    time: new FormControl<string>('12:00', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    })
  });


  constructor(
    private dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppointmentDialogData) {
  }

  ngOnInit(): void {
    this.updateForm();
  }

  private updateForm() {
    const appointment = this.data?.appointment;
    if (!appointment) {
      return;
    }

    this.form.patchValue({
      time: appointment.time,
      description: appointment.description
    });
  }

  submit() {
    if (this.form.invalid) return;

    const result: AppointmentDialogResult = {
      // init if this is not an update
      appointmentId: new Date().getTime().toString(),
      date: this.data.date,

      // override
      ...this.data?.appointment,
      ...this.form.getRawValue()
    };

    this.dialogRef.close(result);
  }

  cancel() {
    this.dialogRef.close();
  }
}
