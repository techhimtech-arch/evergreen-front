import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationManagement } from './organization-management';

describe('OrganizationManagement', () => {
  let component: OrganizationManagement;
  let fixture: ComponentFixture<OrganizationManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
