import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantationForm } from './plantation-form';

describe('PlantationForm', () => {
  let component: PlantationForm;
  let fixture: ComponentFixture<PlantationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantationForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
