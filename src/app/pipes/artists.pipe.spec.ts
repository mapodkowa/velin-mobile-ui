import {ArtistsPipe} from './artists.pipe';

describe('ArtistsPipe', () => {
  it('create an instance', () => {
    const pipe = new ArtistsPipe();
    expect(pipe).toBeTruthy();
  });
});
