import {Followers} from './followers';
import {User} from './user';
import {Paging} from './paging';
import {PlaylistTrack} from './playlist-track';
import {BaseItem} from './base-item';

export interface Playlist extends BaseItem{
    collaborative: boolean;
    description: string;
    followers: Followers;
    owner: User;
    public: boolean;
    snapshot_id: string;
    tracks: Paging<PlaylistTrack>;
    type: string;
}

export interface PlaylistModify {
    snapshot_id: string;
}
