import {Component, OnDestroy, OnInit} from '@angular/core';
import {faArrowLeft, faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute, Router} from '@angular/router';
import {SpotifyService} from '../../providers/spotify/spotify.service';
import {Artist} from '../../models/spotify/artist';
import {ImageSize} from '../../models/image-size';
import {Track} from '../../models/spotify/track';
import {Location} from '@angular/common';
import {Album} from '../../models/spotify/album';
import {ScrollHelperService} from '../../providers/scroll-helper.service';
import {PaletteService} from '../../providers/palette.service';
import {Image} from '../../models/spotify/image';
import {ImagePipe} from '../../pipes/image.pipe';
import {BridgeService} from '../../providers/bridge/bridge.service';
import {PlayerState} from '../../models/bridge/player/player-state';
import {PlayerService} from '../../providers/player.service';
import {Subscription} from 'rxjs';
import {ColorUtils} from '../../utils/color-utils';
import {ContextMenuService} from '../../providers/context-menu.service';

@Component({
    selector: 'app-artist',
    templateUrl: './artist.component.html',
    styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit, OnDestroy {

    constructor(
        private route: ActivatedRoute,
        private spotify: SpotifyService,
        private location: Location,
        private scroll: ScrollHelperService,
        private palette: PaletteService,
        private bridge: BridgeService,
        private player: PlayerService,
        private router: Router,
        private contextMenu: ContextMenuService
    ) {}

    faArrowLeft = faArrowLeft;
    faEllipsisV = faEllipsisV;

    mainImageSize = ImageSize.BIG;
    trackImageSize = ImageSize.MEDIUM;

    artistId: string;
    artist: Artist;
    topTracks: Track[];
    albums: Album[];

    topBarAlpha = 0;
    topBarBackgroundColor = 'rgba(0, 0, 0, 0)';
    topBarDefaultColor = '#4E4E59';
    topBarHeight = document.documentElement.clientHeight * 0.2;

    isPlaying = false;
    playingTrackIndex = -1;

    paramsSubscription: Subscription;
    scrollSubscription: Subscription;
    playerStateSubscription: Subscription;

    ngOnInit(): void {
        this.topBarBackgroundColor = ColorUtils.convertHexToRGBA(this.topBarDefaultColor, this.topBarAlpha);

        this.paramsSubscription = this.route.params.subscribe(params => {
            const id = params.id;

            if (this.artistId !== id) {
                this.loadArtist(id);
            }
        });

        this.scrollSubscription = this.scroll.onContentScroll.subscribe(value => {
            let alpha = value / this.topBarHeight;

            if (alpha > 1) {
                alpha = 1;
            }

            if (this.topBarAlpha !== alpha) {
                this.updateTopBarOpacity(alpha);
            }
        });

        this.playerStateSubscription = this.player.onPlayerStateChanged.subscribe((state: PlayerState) => {
            if (!this.artist) {
                // Artist is not loaded, skip playing check
                return;
            }

            this.checkIfPlaying(this.artist.id, state);
        });
    }

    private loadArtist(id: string): void {
        this.artistId = id;

        // Reset variables to default
        this.artist = undefined;
        this.topTracks = undefined;
        this.albums = undefined;

        this.checkIfPlaying(id, this.player.playerState);
        this.topBarDefaultColor = '#4E4E59';
        this.topBarBackgroundColor = ColorUtils.convertHexToRGBA(this.topBarDefaultColor, this.topBarAlpha);

        this.spotify.getArtist(id).then(result => {
            this.artist = result;
            this.generatePalette(result.images);
        }, (e) => console.error(e));

        this.spotify.getArtistTopTracks(id).then(result => {
            this.topTracks = result.tracks;
        }, (e) => console.error(e));

        this.spotify.getArtistAlbums(id, 'album', this.spotify.DEFAULT_MARKET, 10).then(result => {
            this.filterAndLimitAlbums(result.items);
            this.albums = result.items;
        }, (e) => console.error(e));
    }

    private generatePalette(images: Image[]): void {
        const image = ImagePipe.getImage(images, this.mainImageSize);
        this.palette.getPalette(image.url).then(colors => {
            this.topBarDefaultColor = this.palette.selectColor(colors);
            this.updateTopBarOpacity(this.topBarAlpha);
        }, () => {
            this.topBarDefaultColor = this.palette.defaultColor;
            this.updateTopBarOpacity(this.topBarAlpha);
        });
    }

    private updateTopBarOpacity(alpha: number): void {
        this.topBarAlpha = alpha;
        this.topBarBackgroundColor = ColorUtils.convertHexToRGBA(this.topBarDefaultColor, alpha);
    }

    private checkIfPlaying(artistId: string, state: PlayerState): void {
        if (state === undefined || state.track === undefined) {
            this.isPlaying = false;
            this.playingTrackIndex = -1;
            return;
        }

        const uri = 'spotify:artist:' + artistId;
        this.isPlaying = uri === state.source.uri;
        this.playingTrackIndex = this.isPlaying ? state.queuePosition : -1;
    }

    private filterAndLimitAlbums(albums: Album[]): void {
        for (let i = albums.length - 1; i >= 0; i--) {
            const album = albums[i];
            let duplicated = false;

            for (const album2 of albums) {
                if (album.id === album2.id) {
                    continue;
                }

                if (album.name === album2.name && album.release_date === album2.release_date &&
                    album.total_tracks === album2.total_tracks) {
                    duplicated = true;
                    break;
                }
            }

            if (duplicated) {
                albums.splice(i, 1);
            }
        }

        if (albums.length > 5) {
            albums.splice(4, albums.length - 5);
        }
    }

    onBackClick(): void {
        this.location.back();
    }

    onTrackClick(track: Track, position: number): void {
        this.bridge.player.playArtist(this.artist.id, this.artist.name, position);
    }

    onAlbumClick(item: Album): void {
        this.router.navigate(['album/' + item.id]);
    }

    openContextMenu(): void {
        this.contextMenu.open(this.artist);
    }

    openTrackContextMenu(track: Track): void {
        this.contextMenu.open(track, this.artist);
    }

    ngOnDestroy(): void {
        this.paramsSubscription.unsubscribe();
        this.scrollSubscription.unsubscribe();
        this.playerStateSubscription.unsubscribe();
    }
}
