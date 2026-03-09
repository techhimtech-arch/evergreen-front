import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurvivalUpdate } from './survival-update';

describe('SurvivalUpdate', () => {
  let component: SurvivalUpdate;
  let fixture: ComponentFixture<SurvivalUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurvivalUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurvivalUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
