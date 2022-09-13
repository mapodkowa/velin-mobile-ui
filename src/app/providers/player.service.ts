import {EventEmitter, Injectable} from '@angular/core';
import {BridgeService} from './bridge/bridge.service';
import {PostMessage} from '../models/bridge/post-message';
import {PlayerState} from '../models/bridge/player/player-state';
import {AppConfig} from '../../environments/environment';
import {SampleData} from '../utils/sample-data';
import {ShuffleMode} from '../models/bridge/player/shuffle-mode';
import {RepeatMode} from '../models/bridge/player/repeat-mode';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    playerState: PlayerState;
    onPlayerStateChanged: EventEmitter<PlayerState>;

    constructor(
        private bridge: BridgeService
    ) {
        this.onPlayerStateChanged = new EventEmitter<PlayerState>();

        if (!AppConfig.production && !bridge.checkAvailable()) {
            this.playerState = SampleData.playerState;
            SampleData.attachState();
        }
    }

    startMessageListener(): void {
        this.bridge.onMessage.subscribe((msg: PostMessage<any>) => {
            if (msg.channel !== 'player_state') {
                return;
            }

            this.handlePlayerState(msg);
        });
    }

    private handlePlayerState(msg: PostMessage<PlayerState>): void {
        this.playerState = msg.object;
        this.onPlayerStateChanged.emit(msg.object);
    }

    public resumeMedia(): void {
        this.bridge.player.resumeMedia();
    }

    public pauseMedia(): void {
        this.bridge.player.pauseMedia();
    }

    public skipToNext(): void {
        this.bridge.player.skipToNext();
    }

    public skipToPrevious(): void {
        this.bridge.player.skipToPrevious();
    }

    public seekTo(position: number): void {
        this.bridge.player.seekTo(position);
    }

    public setShuffleMode(shuffleMode: ShuffleMode): void {
        this.bridge.player.setShuffleMode(shuffleMode);
    }

    public setRepeatMode(repeatMode: RepeatMode): void {
        this.bridge.player.setRepeatMode(repeatMode);
    }
}
