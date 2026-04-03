import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterOutlet, Router } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Auth, User } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  standalone: true,
  imports: [RouterOutlet, ToolbarModule, PanelMenuModule, ButtonModule, CommonModule]
})
export class AdminLayoutComponent implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);

  sidebarVisible = true;
  menuItems: MenuItem[] = [];
  currentUser: User | null = null;

  ngOnInit() {
    this.currentUser = this.authService.currentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.setupMenu();
  }

  setupMenu() {
    const role = this.currentUser?.role;

    const baseMenu: MenuItem[] = [];

    // Admin & Super Admin Menu
    if (role === 'admin' || role === 'super_admin') {
      baseMenu.push(
        { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/dashboard'] }, 
        { label: 'Group Management', icon: 'pi pi-users', routerLink: ['/admin/groups'] },
        { label: 'User Management', icon: 'pi pi-user-plus', routerLink: ['/admin/users'] },
        { label: 'Species Management', icon: 'pi pi-tags', routerLink: ['/admin/species'] },
        { label: 'Plantation Assignment', icon: 'pi pi-sitemap', routerLink: ['/plantations/assign'] },
        { label: 'Plantation Records', icon: 'pi pi-camera', routerLink: ['/plantations/records'] },
        { label: 'Verification', icon: 'pi pi-check-circle', routerLink: ['/verification'] },
        { label: 'Survival Monitoring', icon: 'pi pi-eye', routerLink: ['/survival-monitoring'] },
        { label: 'Reports', icon: 'pi pi-chart-bar', routerLink: ['/reports'] }
      );
    }

    // Group Leader Menu
    if (role === 'group_leader') {
      baseMenu.push(
        { label: 'My Plantations', icon: 'pi pi-sitemap', routerLink: ['/my-plantations'] },
        { label: 'Plantation Entry', icon: 'pi pi-camera', routerLink: ['/plantations/entry'] }
      );
    }

    // Verifier Menu
    if (role === 'verifier') {
      baseMenu.push(
        { label: 'Pending Inspections', icon: 'pi pi-check-square', routerLink: ['/inspections'] },
        { label: 'Survival Monitoring', icon: 'pi pi-eye', routerLink: ['/survival-monitoring'] }
      );
    }

    // Common logout
    baseMenu.push({
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    });

    this.menuItems = baseMenu;
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
