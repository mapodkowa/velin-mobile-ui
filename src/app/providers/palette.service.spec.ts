import {TestBed} from '@angular/core/testing';

import {PaletteService} from './palette.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('PaletteService', () => {
  let service: PaletteService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [ HttpClientTestingModule ]});
    service = TestBed.inject(PaletteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
