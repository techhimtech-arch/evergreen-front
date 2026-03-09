import { TestBed } from '@angular/core/testing';

import { Village } from './village';

describe('Village', () => {
  let service: Village;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Village);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
