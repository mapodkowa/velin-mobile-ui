import {Playlist} from './playlist';
import {Paging} from './paging';

export interface FeaturedPlaylists {
    message: string;
    playlists: Paging<Playlist>;
}
