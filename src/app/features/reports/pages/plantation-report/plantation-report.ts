import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpService } from '../../../../core/services/http.service';
import { Api } from '../../../../core/services/api';

@Component({
  selector: 'app-plantation-report',
  imports: [CommonModule],
  templateUrl: './plantation-report.html',
  styleUrl: './plantation-report.css',
})
export class PlantationReport implements OnInit {
  private http = inject(HttpService);
  private api = inject(Api);

  report = signal<any | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.http.get<any>(`${this.api.URL}/reports/summary`).subscribe({
      next: (res) => {
        this.report.set(res?.data || res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load plantation summary report.');
        this.loading.set(false);
      }
    });
  }
}
