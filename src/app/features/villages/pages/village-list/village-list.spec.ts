import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillageList } from './village-list';

describe('VillageList', () => {
  let component: VillageList;
  let fixture: ComponentFixture<VillageList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VillageList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VillageList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
