import { TestBed } from '@angular/core/testing';

import { Plantation } from './plantation';

describe('Plantation', () => {
  let service: Plantation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Plantation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
