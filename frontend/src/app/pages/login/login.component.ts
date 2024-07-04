import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InitialFormComponent } from '@shared/initial-form/initial-form.component';
import { AuthService } from 'src/services/auth/auth.service';
import { UserData } from 'src/services/auth/interfaces/userData.interface';
import { User } from 'src/services/users/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [InitialFormComponent],
  styleUrls: ['./login.component.scss'],
  standalone: true,
})
export class LoginComponent {
  isPasswordValid: boolean;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      const userData: UserData = this.authService.getUserInfo();
      this.router.navigate([`${userData.username}/boards`]);
    }
  }

  onFormSubmit(credentials: User) {
    this.authService
      .login({ email: credentials.email, password: credentials.password })
      .subscribe({
        next: (response) => {
          console.log('Login successful');
          this.router.navigate([`${response.firstName}/boards`]);
        },
        error: (err) => {
          this.isPasswordValid = true;

          console.error('Login error', err);
        },
      });
  }
}
