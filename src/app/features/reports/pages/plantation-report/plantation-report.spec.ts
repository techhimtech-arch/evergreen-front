import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantationReport } from './plantation-report';

describe('PlantationReport', () => {
  let component: PlantationReport;
  let fixture: ComponentFixture<PlantationReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantationReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantationReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
