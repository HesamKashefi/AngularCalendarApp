import { DestroyRef, Directive, ElementRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Directive({
  selector: '[extractErrors]',
  standalone: true
})
export class ExtractErrorsDirective implements OnInit {
  private destroyRef$ = inject(DestroyRef);

  @Input({ required: true, alias: 'extractErrors' })
  formControl!: AbstractControl;

  @Input({ alias: 'name' })
  formControlName?: string;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    this.formControl.statusChanges
      .pipe(
        debounceTime(200),
        takeUntilDestroyed(this.destroyRef$)
      ).subscribe(r => {
        const name = '';
        if (r === 'INVALID') {
          this.el.nativeElement.innerHTML = this.getErrorMessage(this.formControl, this.formControlName || '');
        }
        else if (r === 'VALID' || r === 'PENDING') {
          this.el.nativeElement.innerHTML = ''
        }
      })
  }


  private getErrorMessage(control: AbstractControl, name: string) {
    if (!control.errors) return '';

    if (control.errors['required']) {
      return `'${name}' is required`;
    }

    if (control.errors['min']) {
      return `'${name}' must have more than ${control.errors['min']['min']} characters`;
    }

    if (control.errors['max']) {
      return `'${name}' must have less than ${control.errors['max']['max']} characters`;
    }

    if (control.errors['minLength']) {
      return `'${name}' must have more than ${control.errors['minLength']['minLength']} characters`;
    }

    if (control.errors['maxLength']) {
      return `'${name}' must have less than ${control.errors['maxLength']['maxLength']} characters`;
    }


    if (control.errors['pattern']) {
      return `'${name}' must have this pattern: ${control.errors['pattern']['requiredPattern']}`;
    }

    return 'Invalid input';
  }

}
