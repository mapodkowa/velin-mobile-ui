import {Artist} from './artist';
import {Paging} from './paging';
import {Track} from './track';
import {Album} from './album';
import {Playlist} from './playlist';

export interface Search {
    artists?: Paging<Artist>;
    tracks?: Paging<Track>;
    albums?: Paging<Album>;
    playlists?: Paging<Playlist>;
}
