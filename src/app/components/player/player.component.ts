import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {
    faAngleDown,
    faEllipsisV,
    faListAlt,
    faPauseCircle,
    faPlayCircle,
    faRandom,
    faStepBackward,
    faStepForward
} from '@fortawesome/free-solid-svg-icons';
import {PlayerService} from '../../providers/player.service';
import {ImageSize} from '../../models/image-size';
import {PlayerState} from '../../models/bridge/player/player-state';
import {BridgeService} from '../../providers/bridge/bridge.service';
import {playerAnimation} from '../../utils/animation/player.animation';
import {PaletteService} from '../../providers/palette.service';
import {ImagePipe} from '../../pipes/image.pipe';
import {ShuffleMode} from '../../models/bridge/player/shuffle-mode';
import {RepeatMode} from '../../models/bridge/player/repeat-mode';
import {ColorUtils} from '../../utils/color-utils';
import {Router} from '@angular/router';
import {CastService} from '../../providers/cast/cast.service';
import {Subscription} from 'rxjs';
import {ContextMenuService} from '../../providers/context-menu.service';
import {SpotifyService} from '../../providers/spotify/spotify.service';
import {SnackbarService} from '../../providers/snackbar.service';
import {ModalService} from '../../providers/modal.service';
import {Modals} from '../../models/modal/modals';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss'],
    animations: [playerAnimation]
})
export class PlayerComponent implements OnInit, OnDestroy {
    @HostBinding('@playerAnimation') playerAnimation;

    constructor(
        public bridge: BridgeService,
        private player: PlayerService,
        private palette: PaletteService,
        private router: Router,
        private cast: CastService,
        private contextMenu: ContextMenuService,
        private spotify: SpotifyService,
        private snackbar: SnackbarService,
        private modal: ModalService
    ) { }

    faAngleDown = faAngleDown;
    faEllipsisV = faEllipsisV;
    faRandom = faRandom;
    faStepBackward = faStepBackward;
    faStepForward = faStepForward;
    faPlayCircle = faPlayCircle;
    faPauseCircle = faPauseCircle;
    faListAlt = faListAlt;

    trackImageSize = ImageSize.BIG;
    playerState: PlayerState;
    durationProgress: number;
    seekActive = false;

    trackId: string;
    backgroundImage: string;
    backgroundColor = this.palette.defaultColor;
    backgroundColorInterval: number;

    isCastDeviceAvailable = false;
    isCastActive = false;
    castDeviceName = '';
    castSubscription: Subscription;

    ngOnInit(): void {
        this.updatePlayerState(this.player.playerState);
        this.player.onPlayerStateChanged.subscribe((playerState: PlayerState) => {
            this.updatePlayerState(playerState);
        });

        this.updateCastStatus();
        this.castSubscription = this.cast.onMessage.subscribe(() => {
            this.updateCastStatus();
        });
    }

    private updatePlayerState(playerState: PlayerState): void {
        if (playerState.track === undefined) {
            this.modal.close(Modals.PLAYER);
            return;
        }

        if (this.seekActive) {
            return;
        }

        this.playerState = playerState;

        // Track id change, updating album image and palette
        if (this.trackId !== playerState.track.id) {
            this.trackId = playerState.track.id;

            const imageUrl = ImagePipe.getImage(playerState.track.albumImages, this.trackImageSize).url;
            if (this.bridge.checkAvailable()) {
                this.backgroundImage = ImagePipe.urlToBridge(imageUrl);
            } else {
                this.backgroundImage = imageUrl;
            }

            this.generatePalette(imageUrl);
        }

        if (playerState.trackDuration > 0) {
            this.durationProgress = playerState.playbackPosition * 100.0 / playerState.trackDuration;
        } else {
            this.durationProgress = 0;
        }
    }

    private generatePalette(imageUrl: string): void {
        if (this.backgroundColorInterval) {
            clearInterval(this.backgroundColorInterval);
            this.backgroundColorInterval = undefined;
        }

        this.palette.getPalette(imageUrl).then(colors => {
            const generatedColor = this.palette.selectColor(colors);

            // Update background color with animation only on track change
            if (this.backgroundColor === this.palette.defaultColor) {
                this.backgroundColor = generatedColor;
            } else {
                this.backgroundColorInterval = ColorUtils.transitionColors(this.backgroundColor, generatedColor, 400, color => {
                    this.backgroundColor = color;
                });
            }
        }, () => {
            this.backgroundColor = this.palette.defaultColor;
        });
    }

    private updateCastStatus(): void {
        this.isCastDeviceAvailable = this.cast.devices.length > 1;
        this.isCastActive = this.cast.activeDeviceId !== this.bridge.cast.phoneId;

        if (this.isCastActive) {
            const index = this.cast.devices.map(d => d.id).indexOf(this.cast.activeDeviceId);
            this.castDeviceName = this.cast.devices[index].name;
        } else {
            this.castDeviceName = '';
        }
    }

    onSeek(position: number): void {
        const posInMs = Math.round(position / 100 * this.playerState.trackDuration);

        this.playerState.playbackPosition = posInMs;
        this.durationProgress = position;

        this.player.seekTo(posInMs);
        this.seekActive = false;
    }

    onSeekUpdateTime(position: number): void {
        if (!this.seekActive) {
            this.seekActive = true;
        }

        this.playerState.playbackPosition = Math.round(position / 100 * this.playerState.trackDuration);
    }

    onBackClick(): void {
        this.modal.close(Modals.PLAYER);
    }

    onRandomClick(): void {
        if (this.playerState.shuffleMode === ShuffleMode.SHUFFLE_MODE_NONE) {
            this.player.setShuffleMode(ShuffleMode.SHUFFLE_MODE_ALL);
        } else {
            this.player.setShuffleMode(ShuffleMode.SHUFFLE_MODE_NONE);
        }
    }

    onStepBackwardClick(): void {
        this.player.skipToPrevious();
    }

    onPlayClick(): void {
        this.player.resumeMedia();
    }

    onPauseClick(): void {
        this.player.pauseMedia();
    }

    onStepForwardClick(): void {
        this.player.skipToNext();
    }

    onRepeatClick(): void {
        switch (this.playerState.repeatMode) {
            case RepeatMode.REPEAT_MODE_NONE:
                this.player.setRepeatMode(RepeatMode.REPEAT_MODE_ALL);
                break;
            case RepeatMode.REPEAT_MODE_ALL:
                this.player.setRepeatMode(RepeatMode.REPEAT_MODE_ONE);
                break;
            case RepeatMode.REPEAT_MODE_ONE:
                this.player.setRepeatMode(RepeatMode.REPEAT_MODE_NONE);
                break;
        }
    }

    openCastMenu(): void {
        this.modal.open(Modals.CAST);
    }

    async openContextMenu(): Promise<void> {
        if (!this.playerState.track) {
            return;
        }

        try {
            const track = await this.spotify.getTrack(this.playerState.track.id);
            this.contextMenu.open(track);
        } catch (e) {
            console.error(e);
            this.snackbar.open('Nie można uzyskać informacji o odtwarzanym utworze');
        }
    }

    openCurrentContext(): void {
        if (this.playerState.source.type === 'UNKNOWN') {
            this.snackbar.open('Nie znaleziono źródła odtwarzanego utworu');
            return;
        }

        this.modal.close(Modals.PLAYER);

        setTimeout(() => {
            const id = this.playerState.source.uri.split(':')[2];
            switch (this.playerState.source.type) {
                case 'PLAYLIST':
                    this.router.navigate(['playlist/' + id]);
                    break;
                case 'ALBUM':
                    this.router.navigate(['album/' + id]);
                    break;
                case 'ARTIST':
                    this.router.navigate(['artist/' + id]);
                    break;
                case 'SEARCH':
                    this.router.navigate(['search'], {queryParams: {q: id}});
                    break;
            }
        }, 150);
    }

    ngOnDestroy(): void {
        this.castSubscription.unsubscribe();
    }
}
