import {Artist} from './artist';
import {Paging} from './paging';
import {Track} from './track';
import {BaseItem} from './base-item';

export interface Album extends BaseItem {
    album_type: string;
    artists: Artist[];
    available_markets: string[];
    label: string;
    popularity: number;
    release_date: string;
    release_date_precision: string;
    type: string;
    genres: string[];
    tracks: Paging<Track>;
    total_tracks: number;
}
