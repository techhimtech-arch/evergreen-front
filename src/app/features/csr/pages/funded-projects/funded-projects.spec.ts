import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundedProjects } from './funded-projects';

describe('FundedProjects', () => {
  let component: FundedProjects;
  let fixture: ComponentFixture<FundedProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundedProjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundedProjects);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
