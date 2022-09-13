import {Component, OnInit} from '@angular/core';
import {faPause, faPlay} from '@fortawesome/free-solid-svg-icons';
import {faHeart} from '@fortawesome/free-regular-svg-icons';
import {PlayerService} from '../../providers/player.service';
import {ImageSize} from '../../models/image-size';
import {PlayerState} from '../../models/bridge/player/player-state';
import {ModalService} from '../../providers/modal.service';
import {Modals} from '../../models/modal/modals';

@Component({
    selector: 'app-player-mini',
    templateUrl: './player-mini.component.html',
    styleUrls: ['./player-mini.component.scss']
})
export class PlayerMiniComponent implements OnInit {

    constructor(
        public player: PlayerService,
        private modal: ModalService
    ) {}

    faPlay = faPlay;
    faPause = faPause;
    faHeart = faHeart;

    trackImageSize = ImageSize.MEDIUM;
    position = 0;

    ngOnInit(): void {
        this.updateProgressBar(this.player.playerState);
        this.player.onPlayerStateChanged.subscribe((playerState: PlayerState) => {
            this.updateProgressBar(playerState);
        });
    }

    updateProgressBar(playerState: PlayerState): void {
        if (playerState === undefined) {
            this.position = 0;
            return;
        }

        if (playerState.track === undefined) {
            this.position = 0;
            return;
        }

        if (playerState.trackDuration === 0) {
            this.position = 0;
            return;
        }

        this.position = playerState.playbackPosition * 100.0 / playerState.trackDuration;
    }

    onPlayerClick(): void {
        this.modal.open(Modals.PLAYER);
    }

    onPlayClick(event: any): void {
        event.stopPropagation();
        this.player.resumeMedia();
    }

    onPauseClick(event: any): void {
        event.stopPropagation();
        this.player.pauseMedia();
    }

}
