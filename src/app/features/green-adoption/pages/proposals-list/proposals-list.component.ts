import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proposals-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page-container">
      <div class="page-header">
        <h2>Adoption Proposals</h2>
        <button class="btn btn-primary">Submit Proposal</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Proposal No.</th>
              <th>Organization</th>
              <th>Site</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="6" class="text-center">Loading proposals...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-page-container {
      padding: 1.5rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .btn-primary {
      background-color: #2a5298;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      overflow: hidden;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    .text-center {
      text-align: center;
    }
  `]
})
export class ProposalsListComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Fetch proposals from backend API
  }
}
