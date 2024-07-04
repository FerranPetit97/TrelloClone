import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { BoardsComponent } from './pages/boards/boards.component';
import { AuthGuard } from 'src/services/auth/auth.guard';

export const routes: Routes = [
  { path: '**', redirectTo: 'home' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: ':user/boards',
    component: BoardsComponent,
    canActivate: [AuthGuard],
  },
];
