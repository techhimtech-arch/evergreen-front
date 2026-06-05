import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpService } from '../../../../core/services/http.service';
import { Api } from '../../../../core/services/api';

@Component({
  selector: 'app-survival-report',
  imports: [CommonModule],
  templateUrl: './survival-report.html',
  styleUrl: './survival-report.css',
})
export class SurvivalReport implements OnInit {
  private http = inject(HttpService);
  private api = inject(Api);

  groups = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.http.get<any>(`${this.api.URL}/reports/groups`).subscribe({
      next: (res) => {
        this.groups.set(res?.data?.groups || res?.groups || []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load group-wise survival report.');
        this.loading.set(false);
      }
    });
  }
}
