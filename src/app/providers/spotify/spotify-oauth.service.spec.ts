import {TestBed} from '@angular/core/testing';

import {SpotifyOAuthService} from './spotify-oauth.service';

describe('SpotifyOauthService', () => {
  let service: SpotifyOAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotifyOAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
