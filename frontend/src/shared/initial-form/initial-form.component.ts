import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User, UsersService } from 'src/services/users/users.service';

@Component({
  selector: 'app-initial-form',
  templateUrl: './initial-form.component.html',
  styleUrls: ['./initial-form.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  standalone: true,
})
export class InitialFormComponent implements OnInit, OnDestroy {
  @Input() location: string;
  @Input() isPasswordValid: boolean;
  @Output() loginFormSubmit = new EventEmitter<User>();
  @Output() signUpFormSubmit = new EventEmitter<User>();
  private destroy$ = new Subject<void>();
  initialForm: FormGroup;
  submitted: boolean = false;
  isEmailValidSubmitted: boolean = false;
  isEmailValid: boolean = false;
  isEmailFocused: boolean = false;
  isPasswordFocused: boolean = false;
  isPasswordNotEqual: boolean;
  emailExist: boolean = false;
  signUpAttempt: string;
  formStep: number = 0;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly usersService: UsersService
  ) {
    this.initialForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.minLength(4), Validators.email],
      ],
      password: [null, [Validators.required, Validators.minLength(4)]],
      repeatPassword: [null, [Validators.minLength(4)]],
    });
    this.activatedRoute.queryParams.subscribe((params) => {
      this.signUpAttempt = params['infoCode'];
      this.form['email'].setValue(params['email']);
    });
  }

  ngOnInit() {
    if (this.signUpAttempt === 'existingUserSignupAttempt') {
      this.emailExist = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.submitted = true;
    if (!this.form) {
      return;
    }
    if (!this.initialForm.valid) {
      return;
    }
    if (
      this.location === 'signup' &&
      this.form['password'].value !== this.form['repeatPassword'].value
    ) {
      this.isPasswordNotEqual = true;
      return;
    }

    const firstName: string = this.form['email'].value.split('@')[0];

    //TODO: lastName puesto a cholon.

    const dataUser: User =
      this.location === 'login'
        ? this.initialForm.value
        : { firstName, lastName: '', ...this.initialForm.value };

    this.location === 'login'
      ? this.loginFormSubmit.emit(dataUser)
      : this.signUpFormSubmit.emit(dataUser);
  }

  get form() {
    return this.initialForm.controls;
  }

  onFocus(field: string): void {
    if (field === 'mail') {
      if (this.formStep === 1) {
        this.isEmailValid = false;
        this.formStep--;
      }
      this.isEmailFocused = true;
    }
    if (field === 'password') {
      this.isPasswordFocused = true;
    }
  }

  onBlur(field: string): void {
    if (field === 'email') {
      this.isEmailFocused = false;
    }
    if (field === 'password') {
      this.isPasswordFocused = false;
    }
  }

  isError(): string {
    return this.submitted && this.form['email'].errors
      ? 'margin-top: var(--space-100, 8px)'
      : '';
  }

  stepsForm(): void {
    this.isEmailValidSubmitted = true;
    this.formStep++;
    if (!this.form['email'].valid) {
      this.formStep--;
    }
    if (this.formStep === 1 && this.form['email'].valid) {
      this.isEmailValid = true;
      if (this.location === 'signup') {
        const email: string = this.form['email'].value;
        this.usersService
          .getUserByEmail(email)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              if (res) {
                this.router.navigate(['/login'], {
                  queryParams: {
                    infoCode: 'existingUserSignupAttempt',
                    email: this.form['email'].value,
                  },
                });
              }
            },
          });
      }
    }
  }

  passwordValidate() {}
}
