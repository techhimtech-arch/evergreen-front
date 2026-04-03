import { Injectable, signal } from '@angular/core';
import { delay, of } from 'rxjs';

export interface User {
  id: string;
  name: string;
  role: 'super_admin' | 'admin' | 'group_leader' | 'verifier';
  district?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  currentUser = signal<User | null>(null);

  login(username: string, password: string) {
    // Mock Data for MVP based on final role structure
    const mockUser: User = {
      id: 'usr_1',
      name: 'State Admin',
      role: 'admin',
      district: 'Shimla',
      token: 'mock-jwt-token-123',
    };

    if (username === 'super_admin') {
      mockUser.name = 'Super Admin';
      mockUser.role = 'super_admin';
    } else if (username === 'group_leader') {
      mockUser.name = 'Pooja Devi (Mahila Mandal Leader)';
      mockUser.role = 'group_leader';
    } else if (username === 'verifier') {
      mockUser.name = 'Ramesh Kumar (Forest Guard)';
      mockUser.role = 'verifier';
    }

    this.currentUser.set(mockUser);
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    return of({ success: true, user: mockUser }).pipe(delay(800)); // Simulate network delay
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  checkAuth() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }
}
