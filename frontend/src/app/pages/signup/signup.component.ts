import { Component, inject } from '@angular/core';
import { InitialFormComponent } from '@shared/initial-form/initial-form.component';
import { User, UsersService } from 'src/services/users/users.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [InitialFormComponent],
  styleUrls: ['./signup.component.scss'],
  standalone: true,
})
export class SignupComponent {
  private usersService = inject(UsersService);
  private authService = inject(AuthService);

  constructor(private readonly router: Router) {}

  onFormSubmit(credentials: User) {
    this.usersService
      .createUser({
        email: credentials.email,
        password: credentials.password,
        firstName: credentials.firstName,
      })
      .subscribe({
        next: (response) => {
          console.log('Register successful');
          this.authService
            .login({ email: credentials.email, password: credentials.password })
            .subscribe({
              next: (response) => {
                console.log('Login successful');
                this.router.navigate([`${response.firstName}/boards`]);
              },
              error: (err) => {
                console.error('Login error', err);
              },
            });
        },
        error: (err) => {
          console.error('Register error', err);
        },
      });
  }
}
