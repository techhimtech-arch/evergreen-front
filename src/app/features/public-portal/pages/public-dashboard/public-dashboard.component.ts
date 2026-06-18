import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ForestSite {
  id: string;
  name: string;
  location: string;
  area: number;
  imageUrl: string;
}

@Component({
  selector: 'app-public-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="public-dashboard-container">
      <header class="hero-section">
        <h1>Green Adoption Scheme</h1>
        <p>Join us in restoring our forests and adopting green spaces for a sustainable future.</p>
        <button class="cta-button">Explore Sites</button>
      </header>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon"><i class="pi pi-map-marker"></i></div>
          <h3>Total Sites Available</h3>
          <p class="number">24</p>
        </div>
        <div class="metric-card">
          <div class="metric-icon"><i class="pi pi-heart-fill"></i></div>
          <h3>Sites Adopted</h3>
          <p class="number">12</p>
        </div>
        <div class="metric-card">
          <div class="metric-icon"><i class="pi pi-chart-line"></i></div>
          <h3>Total Contribution</h3>
          <p class="number">₹ 150K+</p>
        </div>
        <div class="metric-card">
          <div class="metric-icon"><i class="pi pi-verified"></i></div>
          <h3>Survival Rate</h3>
          <p class="number">92 %</p>
        </div>
      </div>

      <section class="gallery-section">
        <div class="section-header">
          <h2>Available Sites for Adoption</h2>
          <p>Browse our beautiful green spaces waiting for your care</p>
        </div>
        <div class="site-grid">
          <div class="site-card" *ngFor="let site of availableSites">
            <div class="site-image" [style.background-image]="'url(' + site.imageUrl + ')'">
              <span class="area-badge">{{ site.area }} Hectares</span>
            </div>
            <div class="site-content">
              <h3>{{ site.name }}</h3>
              <p class="location"><i class="pi pi-map-marker"></i> {{ site.location }}</p>
              <button class="adopt-btn">Adopt Now</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .public-dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      font-family: 'Inter', sans-serif;
    }
    .hero-section {
      text-align: center;
      padding: 5rem 2rem;
      background: linear-gradient(135deg, #0f3443 0%, #34e89e 100%);
      color: white;
      border-radius: 16px;
      margin-bottom: 3rem;
      box-shadow: 0 10px 30px rgba(52, 232, 158, 0.2);
    }
    .hero-section h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }
    .hero-section p {
      font-size: 1.25rem;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }
    .cta-button {
      background: white;
      color: #0f3443;
      border: none;
      padding: 1rem 2.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 50px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 4rem;
    }
    .metric-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
      text-align: center;
      border: 1px solid rgba(0,0,0,0.05);
      transition: transform 0.2s;
    }
    .metric-card:hover {
      transform: translateY(-5px);
    }
    .metric-icon {
      width: 48px;
      height: 48px;
      background: #e8f5e9;
      color: #2e7d32;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      font-size: 1.5rem;
    }
    .metric-card h3 {
      font-size: 1rem;
      color: #64748b;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .metric-card .number {
      font-size: 2.5rem;
      font-weight: 800;
      color: #0f172a;
    }
    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    .section-header h2 {
      font-size: 2.25rem;
      color: #0f172a;
      margin-bottom: 0.5rem;
    }
    .section-header p {
      color: #64748b;
      font-size: 1.1rem;
    }
    .site-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }
    .site-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      transition: transform 0.3s, box-shadow 0.3s;
      border: 1px solid #f1f5f9;
    }
    .site-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }
    .site-image {
      height: 220px;
      background-size: cover;
      background-position: center;
      position: relative;
    }
    .area-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(255,255,255,0.95);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.875rem;
      color: #2e7d32;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .site-content {
      padding: 1.5rem;
    }
    .site-content h3 {
      font-size: 1.25rem;
      color: #0f172a;
      margin-bottom: 0.5rem;
    }
    .location {
      color: #64748b;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
    }
    .adopt-btn {
      width: 100%;
      background: #0f3443;
      color: white;
      border: none;
      padding: 0.875rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .adopt-btn:hover {
      background: #34e89e;
      color: #0f3443;
    }
  `]
})
export class PublicDashboardComponent implements OnInit {
  availableSites: ForestSite[] = [];

  constructor() {}

  ngOnInit(): void {
    // Mock data for functional UI presentation
    this.availableSites = [
      {
        id: '1',
        name: 'Pine Valley Reserve',
        location: 'Shimla District',
        area: 15.5,
        imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: '2',
        name: 'Oakwood Conservation Area',
        location: 'Kangra Valley',
        area: 8.2,
        imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800'
      },
      {
        id: '3',
        name: 'Riverfront Green Belt',
        location: 'Kullu',
        area: 12.0,
        imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=800'
      }
    ];
  }
}
