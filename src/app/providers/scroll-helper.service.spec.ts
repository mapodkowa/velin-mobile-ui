import {TestBed} from '@angular/core/testing';

import {ScrollHelperService} from './scroll-helper.service';

describe('ScrollHelperService', () => {
  let service: ScrollHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
