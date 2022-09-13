import {User} from './user';
import {Track} from './track';

export interface PlaylistTrack {
    id?: string;
    playlist_id?: string;
    playlist_position?: number;
    added_at: string;
    added_by: User;
    is_local: boolean;
    track: Track;
}
