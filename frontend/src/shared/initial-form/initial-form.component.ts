import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-initial-form',
  templateUrl: './initial-form.component.html',
  styleUrls: ['./initial-form.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  standalone: true,
})
export class InitialFormComponent {
  @Input() location: string = 'login';
  initialForm: FormGroup;
  submitted: boolean = false;
  isMailFocused = false;

  constructor(private formBuilder: FormBuilder) {
    this.initialForm = this.formBuilder.group({
      mail: [
        '',
        [Validators.required, Validators.minLength(4), Validators.email],
      ],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.initialForm.valid) {
      console.log('Form Submitted', this.initialForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  get form() {
    return this.initialForm.controls;
  }

  onFocus(field: string): void {
    if (field === 'email') {
      this.isMailFocused = true;
    }
  }

  onBlur(field: string): void {
    if (field === 'email') {
      this.isMailFocused = false;
    }
  }

  isError(): string {
    return this.submitted && this.form['mail'].errors
      ? 'margin-top: var(--space-100, 8px)'
      : '';
  }
}
