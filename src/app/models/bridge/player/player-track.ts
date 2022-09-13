import {Image} from '../../spotify/image';

export interface PlayerTrack {
    id: string;
    name: string;
    artists: string;
    albumName: string;
    albumImages: Image[];
}
