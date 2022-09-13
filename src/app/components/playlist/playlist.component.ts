import {Component, OnDestroy, OnInit} from '@angular/core';
import {BridgeService} from '../../providers/bridge/bridge.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SpotifyService} from '../../providers/spotify/spotify.service';
import {Playlist} from '../../models/spotify/playlist';
import {ImageSize} from '../../models/image-size';
import {faArrowLeft, faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import {Track} from '../../models/spotify/track';
import {Location} from '@angular/common';
import {Image} from '../../models/spotify/image';
import {PaletteService} from '../../providers/palette.service';
import {ImagePipe} from '../../pipes/image.pipe';
import {PlayerService} from '../../providers/player.service';
import {PlayerState} from '../../models/bridge/player/player-state';
import {ShuffleMode} from '../../models/bridge/player/shuffle-mode';
import {RandomUtils} from '../../utils/random-utils';
import {RepeatMode} from '../../models/bridge/player/repeat-mode';
import {Subscription} from 'rxjs';
import {ScrollHelperService} from '../../providers/scroll-helper.service';
import {ContextMenuService} from '../../providers/context-menu.service';
import {SnackbarService} from '../../providers/snackbar.service';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnDestroy {

    constructor(
        public bridge: BridgeService,
        private route: ActivatedRoute,
        private location: Location,
        private spotify: SpotifyService,
        private scroll: ScrollHelperService,
        private palette: PaletteService,
        private player: PlayerService,
        private contextMenu: ContextMenuService,
        private router: Router,
        private snackbar: SnackbarService
    ) {}

    faArrowLeft = faArrowLeft;
    faEllipsisV = faEllipsisV;

    playlistId: string;
    playlist: Playlist;
    isFollowed = false;
    isPublic = false;

    backgroundColor = 'rgba(0,0,0,0)';
    mainImageSize = ImageSize.BIG;
    trackImageSize = ImageSize.MEDIUM;

    topBarAlpha = 0;
    topBarHeight = document.documentElement.clientHeight * 0.2;

    isPlaylistPlaying = false;
    playingTrackIndex = -1;

    paramsSubscription: Subscription;
    scrollSubscription: Subscription;
    playerStateSubscription: Subscription;
    contextMenuSubscription: Subscription;

    ngOnInit(): void {
        this.paramsSubscription = this.route.params.subscribe(params => {
            const id: string = params.id;

            if (this.playlistId !== id) {
                this.loadPlaylist(id);
            }
        });

        this.scrollSubscription = this.scroll.onContentScroll.subscribe(value => {
            let alpha = value / this.topBarHeight;

            if (alpha > 1) {
                alpha = 1;
            }

            if (this.topBarAlpha !== alpha) {
                this.topBarAlpha = alpha;
            }
        });

        this.playerStateSubscription = this.player.onPlayerStateChanged.subscribe((state: PlayerState) => {
            if (!this.playlist) {
                // Playlist is not loaded, skip playing check
                return;
            }

            this.checkPlaylistPlaying(this.playlist.id, state);
        });

        this.contextMenuSubscription = this.contextMenu.actionEvent.subscribe(action => {
            if (!this.playlist) {
                // Playlist is not loaded, skip following check
                return;
            }

            if (action.item.id === this.playlist.id || (action.context && action.context.id === this.playlist.id)) {
                this.checkPlaylistFollowed(this.playlist.id);
            }
        });
    }

    private loadPlaylist(id: string): void {
        this.playlistId = id;

        // Reset variables to default
        this.playlist = undefined;
        this.backgroundColor = 'rgba(0,0,0,0)';

        this.checkPlaylistPlaying(id, this.player.playerState);
        this.checkPlaylistFollowed(id);

        this.spotify.getPlaylist(id, this.spotify.DEFAULT_MARKET).then(result => {
            this.fixInvalidTracks(result);
            this.playlist = result;

            this.isPublic = result.owner.id !== this.spotify.userProfile.id;

            this.generatePalette(this.playlist.images);
        }, (e) => console.error(e));
    }

    private checkPlaylistPlaying(playlistId: string, state: PlayerState): void {
        if (state === undefined || state.track === undefined) {
            this.isPlaylistPlaying = false;
            this.playingTrackIndex = -1;
            return;
        }

        const uri = 'spotify:playlist:' + playlistId;
        this.isPlaylistPlaying = uri === state.source.uri;
        this.playingTrackIndex = this.isPlaylistPlaying ? state.queuePosition : -1;
    }

    private checkPlaylistFollowed(playlistId: string): void {
        this.isFollowed = this.spotify.playlistsCache.map(p => p.id).indexOf(playlistId) > -1;
    }

    private generatePalette(images: Image[]): void {
        const image = ImagePipe.getImage(images, this.mainImageSize);
        this.palette.getPalette(image.url).then(colors => {
            this.backgroundColor = this.palette.selectColor(colors);
        }, () => {
            this.backgroundColor = this.palette.defaultColor;
        });
    }

    private fixInvalidTracks(playlist: Playlist): void {
        for (let i = playlist.tracks.items.length - 1; i >= 0; i--) {
            if (playlist.tracks.items[i].track === null) {
                playlist.tracks.items.splice(i, 1);
            }
        }
    }

    followPlaylist(): void {
        if (!this.playlist) {
            return;
        }

        this.spotify.followPlaylist(this.playlist.id).then(() => {
            this.isFollowed = true;
            this.spotify.playlistsCache.unshift(this.playlist);

            this.snackbar.open('Ok, teraz obserwujesz playlistę ' + this.playlist.name);
        }, error => {
            console.error('Playlist follow failed, id = ' + this.playlist.id + ', error =', error);
            this.snackbar.open('O nie! Wystąpił błąd w trakcie obserwowania playlisty ' + this.playlist.name);
        });
    }

    unFollowPlaylist(): void {
        if (!this.playlist) {
            return;
        }

        this.spotify.unFollowPlaylist(this.playlist.id).then(() => {
            this.isFollowed = false;

            const index = this.spotify.playlistsCache.map(p => p.id).indexOf(this.playlist.id);
            if (index > -1) {
                this.spotify.playlistsCache.splice(index, 1);
            }

            this.snackbar.open('Ok, przestałeś obserwować playlistę ' + this.playlist.name);
        }, error => {
            console.error('Playlist un-follow/delete failed, id = ' + this.playlist.id + ', error =', error);
            this.snackbar.open('O nie! Wystąpił błąd w trakcie usuwania obserwowania playlisty ' + this.playlist.name);
        });
    }

    onBackClick(): void {
        this.location.back();
    }

    onTrackClick(track: Track, position: number): void {
        this.bridge.player.playPlaylist(this.playlist.id, position, this.playlist.snapshot_id);
    }

    onPlayRandomClick(): void {
        this.bridge.player.setShuffleMode(ShuffleMode.SHUFFLE_MODE_ALL);
        this.bridge.player.setRepeatMode(RepeatMode.REPEAT_MODE_ALL);

        const randomPosition = RandomUtils.randomInteger(0, this.playlist.tracks.items.length - 1);
        this.bridge.player.playPlaylist(this.playlist.id, randomPosition, this.playlist.snapshot_id);
    }

    openContextMenu(): void {
        this.contextMenu.open(this.playlist);
    }

    openTrackContextMenu(track: Track): void {
        this.contextMenu.open(track, this.playlist);
    }

    ngOnDestroy(): void {
        this.paramsSubscription.unsubscribe();
        this.playerStateSubscription.unsubscribe();
        this.scrollSubscription.unsubscribe();
        this.contextMenuSubscription.unsubscribe();
    }
}
