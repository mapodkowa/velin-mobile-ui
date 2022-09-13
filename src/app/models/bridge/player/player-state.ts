import {PlayerTrack} from './player-track';
import {PlayerSource} from './player-source';
import {RepeatMode} from './repeat-mode';
import {ShuffleMode} from './shuffle-mode';

export interface PlayerState {
    track: PlayerTrack;
    source: PlayerSource;
    playbackStatus: 'UNKNOWN' | 'PLAYING' | 'PAUSED';
    playbackPosition: number;
    trackDuration: number;
    queuePosition: number;
    repeatMode: RepeatMode;
    shuffleMode: ShuffleMode;
}
