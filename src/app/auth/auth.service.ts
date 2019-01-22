import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    return this.httpClient
      .post<{ message: string }>(BACKEND_URL + '/signup', authData)
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.httpClient
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
      }>(BACKEND_URL + '/login', authData)
      .subscribe(
        response => {
          console.log(response.message);
          this.token = response.token;
          if (response.token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(response.token, response.userId, expirationDate);

            this.router.navigate(['/']);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);

    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, userId: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      userId: userId,
      expirationDate: new Date(expirationDate)
    };
  }
}
