import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="public-dashboard-container">
      <header class="hero-section">
        <h1>Mukhya Mantri Green Adoption Yojana</h1>
        <p>Join us in restoring our forests and adopting green spaces for a sustainable future.</p>
      </header>

      <div class="metrics-grid">
        <div class="metric-card">
          <h3>Total Sites Available</h3>
          <p class="number">--</p>
        </div>
        <div class="metric-card">
          <h3>Sites Adopted</h3>
          <p class="number">--</p>
        </div>
        <div class="metric-card">
          <h3>Total Contribution</h3>
          <p class="number">₹ --</p>
        </div>
        <div class="metric-card">
          <h3>Survival Rate</h3>
          <p class="number">-- %</p>
        </div>
      </div>

      <section class="gallery-section">
        <h2>Available Sites for Adoption</h2>
        <div class="site-list">
          <!-- Sites will be populated here -->
          <p>Loading sites...</p>
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
      padding: 4rem 2rem;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      border-radius: 12px;
      margin-bottom: 3rem;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    .metric-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      text-align: center;
    }
    .metric-card h3 {
      font-size: 1rem;
      color: #666;
      margin-bottom: 0.5rem;
    }
    .metric-card .number {
      font-size: 2rem;
      font-weight: bold;
      color: #2a5298;
    }
    .gallery-section h2 {
      margin-bottom: 1.5rem;
      color: #333;
    }
  `]
})
export class PublicDashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Fetch metrics from backend public API
  }
}
