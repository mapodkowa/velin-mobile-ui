import {Image} from './spotify/image';
import {Track} from './spotify/track';
import {Artist} from './spotify/artist';
import {Album} from './spotify/album';
import {Playlist} from './spotify/playlist';

export interface SearchItem {
    id: string;
    name: string;
    type: 'TRACK' | 'ARTIST' | 'ALBUM' | 'PLAYLIST';
    uri: string;
    subtitle: string;
    popularity: number;
    images: Image[];
    original: Track | Artist | Album | Playlist;
}
