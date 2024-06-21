import { Component } from '@angular/core';
import { InitialFormComponent } from '@shared/initial-form/initial-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [InitialFormComponent],
  styleUrls: ['./login.component.scss'],
  standalone: true,
})
export class LoginComponent {}
