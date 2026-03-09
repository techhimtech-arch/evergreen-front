import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillageDetails } from './village-details';

describe('VillageDetails', () => {
  let component: VillageDetails;
  let fixture: ComponentFixture<VillageDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VillageDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VillageDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
