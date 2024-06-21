import { Component } from '@angular/core';
import { InitialFormComponent } from '@shared/initial-form/initial-form.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  imports: [InitialFormComponent],
  styleUrls: ['./signin.component.scss'],
  standalone: true,
})
export class SigninComponent {}
