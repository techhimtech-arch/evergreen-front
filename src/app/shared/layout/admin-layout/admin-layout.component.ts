import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Auth, User } from '../../../core/services/auth';

import { USER_ROLES } from '../../../core/constants/roles';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  standalone: true,
  imports: [RouterOutlet, RouterLink, ToolbarModule, PanelMenuModule, ButtonModule, CommonModule],
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

    // Super Admin & Org Admin Menu
    if (role === USER_ROLES.SUPER_ADMIN || role === USER_ROLES.ORG_ADMIN) {
      baseMenu.push(
        { label: 'Dashboard', icon: 'pi pi-home', routerLink: ['/dashboard'] }, 
        { label: 'Group Management', icon: 'pi pi-users', routerLink: ['/admin/groups'] },
        { label: 'User Management', icon: 'pi pi-user-plus', routerLink: ['/admin/users'] },
        { label: 'Species Management', icon: 'pi pi-tags', routerLink: ['/admin/species'] },
        { label: 'Organization Management', icon: 'pi pi-building', routerLink: ['/admin/organizations'] },
        { label: 'Role Management', icon: 'pi pi-key', routerLink: ['/admin/roles'] },
        { label: 'Target Assignments', icon: 'pi pi-bullseye', routerLink: ['/admin/assignments'] },
        { label: 'Plantation Assignment', icon: 'pi pi-sitemap', routerLink: ['/plantations/assign'] },
        { label: 'Plantation Records', icon: 'pi pi-camera', routerLink: ['/plantations/records'] },
        { label: 'Inspection Management', icon: 'pi pi-clipboard', routerLink: ['/inspections'] },
        { label: 'Tree Monitoring', icon: 'pi pi-map', routerLink: ['/tree-monitoring'] },
        { label: 'Event Management', icon: 'pi pi-calendar', routerLink: ['/events'] },
        { label: 'Verification', icon: 'pi pi-check-circle', routerLink: ['/verification'] },
        { label: 'Survival Monitoring', icon: 'pi pi-eye', routerLink: ['/survival-monitoring'] },
        { label: 'Reports', icon: 'pi pi-chart-bar', routerLink: ['/reports'] },
        { label: 'System Settings', icon: 'pi pi-cog', routerLink: ['/admin/settings'] }
      );
    }

    // Volunteer Menu
    if (role === USER_ROLES.VOLUNTEER) {
      baseMenu.push(
        { label: 'My Plantations', icon: 'pi pi-sitemap', routerLink: ['/my-plantations'] },
        { label: 'Plantation Entry', icon: 'pi pi-camera', routerLink: ['/plantations/entry'] }
      );
    }

    // Citizen Menu
    if (role === USER_ROLES.CITIZEN) {
      baseMenu.push(
        { label: 'Public Events', icon: 'pi pi-calendar', routerLink: ['/events'] },
        { label: 'My Trees', icon: 'pi pi-check-square', routerLink: ['/my-trees'] }
      );
    }

    // Common logout
    baseMenu.push(
      { label: 'My Profile', icon: 'pi pi-user', routerLink: ['/admin/profile'] },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    );

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
