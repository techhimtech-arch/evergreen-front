import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterOutlet } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  standalone: true,
  imports: [RouterOutlet, ToolbarModule, PanelMenuModule, ButtonModule]
})
export class AdminLayoutComponent {
  sidebarVisible = true;
  
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: ['/dashboard']
    },
    {
      label: 'Projects',
      icon: 'pi pi-briefcase',
      routerLink: ['/projects']
    },
    {
      label: 'Plantations',
      icon: 'pi pi-sitemap',
      routerLink: ['/plantations']
    },
    {
      label: 'Villages',
      icon: 'pi pi-users',
      routerLink: ['/villages']
    },
    {
      label: 'Map',
      icon: 'pi pi-map',
      routerLink: ['/map']
    },
    {
      label: 'Reports',
      icon: 'pi pi-chart-bar',
      routerLink: ['/reports']
    },
    {
      label: 'CSR',
      icon: 'pi pi-heart',
      routerLink: ['/csr']
    },
    {
      label: 'Admin',
      icon: 'pi pi-cog',
      routerLink: ['/admin']
    }
  ];

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
