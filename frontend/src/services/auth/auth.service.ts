import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LogInData } from './interfaces/logInData.interface';
import { LogInDataCallBack } from './interfaces/logInDataCallBack.interface';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private expiration: number = 300;
  private tokenExpirationTimer: any;

  private userSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public user = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    if (this.isLoggedIn()) {
      this.setAutoLogout(this.expiration);
    }
  }

  login(credentials: LogInData): Observable<LogInDataCallBack> {
    return this.http
      .post<LogInDataCallBack>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((res) => {
          this.setToken(res.access_token, res.expiresIn);
          this.setRefreshToken(res.refresh_token);
          this.setAutoLogout(res.expiresIn);
          this.userSubject.next(jwtDecode(res.access_token));
        })
      );
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError('No refresh token available');
    }

    return this.http
      .post(`${this.apiUrl}/refresh`, {
        refresh_token: this.getRefreshToken(),
      })
      .pipe(
        tap((res: any) => {
          this.setToken(res.access_token, res.expiresIn);
          this.setAutoLogout(res.expiresIn);
          this.userSubject.next(jwtDecode(res.access_token));
        }),
        catchError((error) => {
          this.logout();
          throw error;
        })
      );
  }

  private setToken(token: string, expiresIn: number): void {
    localStorage.setItem(this.tokenKey, token);
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private setAutoLogout(expirationDuration: number): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = setTimeout(() => {
      this.refreshToken().subscribe({
        next: (res) => {
          console.log('Token refreshed successfully');
        },
        error: (err) => {
          console.log('Refresh token expired. Logging out...');
          this.logout();
        },
      });
    }, expirationDuration * 1000);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem('expiration');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  logout() {
    this.clearToken();
    this.userSubject.next(null);
    // this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    const expiration = localStorage.getItem('expiration');
    if (!expiration || new Date(expiration) <= new Date()) {
      return false;
    }
    return true;
  }

  private getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const expiration = localStorage.getItem('expiration');
    if (!expiration || new Date(expiration) <= new Date()) {
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  getUserInfo(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }
}
