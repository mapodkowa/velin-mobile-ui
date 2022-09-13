import {Component, OnDestroy, OnInit} from '@angular/core';
import {faHeart} from '@fortawesome/free-regular-svg-icons';
import {faArrowLeft, faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import {SpotifyService} from '../../providers/spotify/spotify.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Album} from '../../models/spotify/album';
import {Location} from '@angular/common';
import {ImageSize} from '../../models/image-size';
import {Track} from '../../models/spotify/track';
import {Artist} from '../../models/spotify/artist';
import {ShuffleMode} from '../../models/bridge/player/shuffle-mode';
import {RepeatMode} from '../../models/bridge/player/repeat-mode';
import {BridgeService} from '../../providers/bridge/bridge.service';
import {RandomUtils} from '../../utils/random-utils';
import {Subscription} from 'rxjs';
import {PlayerState} from '../../models/bridge/player/player-state';
import {PlayerService} from '../../providers/player.service';
import {Image} from '../../models/spotify/image';
import {ImagePipe} from '../../pipes/image.pipe';
import {PaletteService} from '../../providers/palette.service';
import {ContextMenuService} from '../../providers/context-menu.service';

@Component({
    selector: 'app-album',
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit, OnDestroy {

    constructor(
        private route: ActivatedRoute,
        private spotify: SpotifyService,
        private location: Location,
        private router: Router,
        private bridge: BridgeService,
        private player: PlayerService,
        private palette: PaletteService,
        private contextMenu: ContextMenuService
    ) {}

    faArrowLeft = faArrowLeft;
    faEllipsisV = faEllipsisV;
    faHeart = faHeart;

    mainImageSize = ImageSize.BIG;
    artistImageSize = ImageSize.MEDIUM;
    backgroundColor = 'rgba(0,0,0,0)';

    albumId: string;
    album: Album;
    artists: Artist[];

    isAlbumPlaying = false;
    playingTrackIndex = -1;

    paramsSubscription: Subscription;
    playerStateSubscription: Subscription;

    ngOnInit(): void {
        this.paramsSubscription = this.route.params.subscribe(params => {
            const id = params.id;

            if (this.albumId !== id) {
                this.loadAlbum(id);
            }
        });

        this.playerStateSubscription = this.player.onPlayerStateChanged.subscribe((state: PlayerState) => {
            if (!this.album) {
                // Album is not loaded, skip playing check
                return;
            }

            this.checkAlbumPlaying(this.album.id, state);
        });
    }

    private loadAlbum(id: string): void {
        this.albumId = id;

        // Reset variables to default
        this.album = undefined;
        this.artists = undefined;
        this.backgroundColor = 'rgba(0,0,0,0)';

        this.checkAlbumPlaying(id, this.player.playerState);

        this.spotify.getAlbum(id).then(result => {
            this.album = result;
            this.generatePalette(result.images);

            this.spotify.getArtists(result.artists.map(i => i.id)).then(result2 => {
                this.artists = result2.artists;
            }, (e) => console.error(e));
        }, (e) => console.error(e));
    }

    private generatePalette(images: Image[]): void {
        const image = ImagePipe.getImage(images, this.mainImageSize);
        this.palette.getPalette(image.url).then(colors => {
            this.backgroundColor = this.palette.selectColor(colors);
        }, () => {
            this.backgroundColor = this.palette.defaultColor;
        });
    }

    private checkAlbumPlaying(albumId: string, state: PlayerState): void {
        if (state === undefined || state.track === undefined) {
            this.isAlbumPlaying = false;
            this.playingTrackIndex = -1;
            return;
        }

        const uri = 'spotify:album:' + albumId;
        this.isAlbumPlaying = uri === state.source.uri;
        this.playingTrackIndex = this.isAlbumPlaying ? state.queuePosition : -1;
    }

    onBackClick(): void {
        this.location.back();
    }

    onPlayRandomClick(): void {
        this.bridge.player.setShuffleMode(ShuffleMode.SHUFFLE_MODE_ALL);
        this.bridge.player.setRepeatMode(RepeatMode.REPEAT_MODE_ALL);

        const randomPosition = RandomUtils.randomInteger(0, this.album.tracks.items.length - 1);
        this.bridge.player.playAlbum(this.album.id, randomPosition);
    }

    onTrackClick(track: Track, index: number): void {
        this.bridge.player.playAlbum(this.album.id, index);
    }

    onArtistClick(artist: Artist): void {
        this.router.navigate(['artist/' + artist.id]);
    }

    openContextMenu(): void {
        this.contextMenu.open(this.album);
    }

    openTrackContextMenu(track: Track): void {
        track.album = this.album;
        this.contextMenu.open(track, this.album);
    }

    ngOnDestroy(): void {
        if (this.paramsSubscription) {
            this.paramsSubscription.unsubscribe();
            this.paramsSubscription = undefined;
        }

        if (this.playerStateSubscription) {
            this.playerStateSubscription.unsubscribe();
            this.playerStateSubscription = undefined;
        }
    }

}
