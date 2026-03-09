import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeciesManagement } from './species-management';

describe('SpeciesManagement', () => {
  let component: SpeciesManagement;
  let fixture: ComponentFixture<SpeciesManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeciesManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeciesManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
