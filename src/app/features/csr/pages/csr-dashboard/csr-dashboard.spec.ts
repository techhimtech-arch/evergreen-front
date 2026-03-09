import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsrDashboard } from './csr-dashboard';

describe('CsrDashboard', () => {
  let component: CsrDashboard;
  let fixture: ComponentFixture<CsrDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsrDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsrDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
