import {ShuffleMode} from '../../../models/bridge/player/shuffle-mode';
import {RepeatMode} from '../../../models/bridge/player/repeat-mode';

export class PlayerInterface {

    public checkAvailable(): boolean {
        return typeof Player !== 'undefined';
    }

    public playPlaylist(playlistId: string, startPosition: number, snapshotId: string): void {
        if (!this.checkAvailable()) {
            return;
        }
        Player.playPlaylist(playlistId, startPosition, snapshotId);
    }

    public playArtist(artistId: string, artistName: string, startPosition: number): void {
        if (!this.checkAvailable()) {
            return;
        }
        Player.playArtist(artistId, artistName, startPosition);
    }

    public playAlbum(albumId: string, startPosition: number): void {
        if (!this.checkAvailable()) {
            return;
        }
        Player.playAlbum(albumId, startPosition);
    }

    public playTrack(trackId: string): void {
        if (!this.checkAvailable()) {
            return;
        }
        Player.playTrack(trackId);
    }

    public playSearch(searchText: string, trackId: string): void {
        if (!this.checkAvailable()) {
            return;
        }
        Player.playSearch(searchText, trackId);
    }

    public playSearchSingleTrack(searchText: string, trackId: string): void {
        if (!this.checkAvailable()) {
            return;
        }
        Player.playSearchSingleTrack(searchText, trackId);
    }

    public playTrackFromHistory(trackId: string): void {
        if (!this.checkAvailable()) {
            return;
        }
        Player.playTrackFromHistory(trackId);
    }

    public resumeMedia(): void {
        if (!this.checkAvailable()) {
            return;
        }
        Player.play();
    }

    public pauseMedia(): void {
        if (!this.checkAvailable()) {
            return;
        }
        Player.pause();
    }

    public skipToNext(): void {
        if (!this.checkAvailable()) {
            return;
        }
        Player.skipToNext();
    }

    public skipToPrevious(): void {
        if (!this.checkAvailable()) {
            return;
        }
        Player.skipToPrevious();
    }

    public seekTo(position: number): void {
        if (!this.checkAvailable()) {
            return;
        }
        Player.seekTo(position);
    }

    public setShuffleMode(shuffleMode: ShuffleMode): void {
        if (!this.checkAvailable()) {
            return;
        }
        Player.setShuffleMode(shuffleMode);
    }

    public setRepeatMode(repeatMode: RepeatMode): void {
        if (!this.checkAvailable()) {
            return;
        }
        Player.setRepeatMode(repeatMode);
    }
}
