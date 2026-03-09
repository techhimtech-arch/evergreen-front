import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurvivalReport } from './survival-report';

describe('SurvivalReport', () => {
  let component: SurvivalReport;
  let fixture: ComponentFixture<SurvivalReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurvivalReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurvivalReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
