import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ImageSize} from '../../models/image-size';
import {Location} from '@angular/common';
import {SpotifyService} from '../../providers/spotify/spotify.service';
import {PaletteService} from '../../providers/palette.service';
import {BridgeService} from '../../providers/bridge/bridge.service';
import {SearchItem} from '../../models/search-item';
import {faArrowLeft, faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import {SearchUtils} from '../../utils/search-utils';
import {ImagePipe} from '../../pipes/image.pipe';
import {ContextMenuService} from '../../providers/context-menu.service';
import {PlayerState} from '../../models/bridge/player/player-state';
import {PlayerService} from '../../providers/player.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-search-details',
    templateUrl: './search-details.component.html',
    styleUrls: ['./search-details.component.scss']
})
export class SearchDetailsComponent implements OnInit, OnDestroy {

    constructor(
        private spotify: SpotifyService,
        private location: Location,
        private palette: PaletteService,
        private route: ActivatedRoute,
        private bridge: BridgeService,
        private router: Router,
        private contextMenu: ContextMenuService,
        private player: PlayerService
    ) {}

    faArrowLeft = faArrowLeft;
    faEllipsisV = faEllipsisV;

    defaultBackgroundColor = '#4e4e59';
    backgroundColor = this.defaultBackgroundColor;
    paletteLoaded = false;
    imageSize = ImageSize.MEDIUM;

    type: 'artist' | 'track' | 'playlist' | 'album';
    searchValue: string;
    searchTypeText: string;
    searchItems: SearchItem[] = null;

    isPlayingFromSearch = false;
    playingTrackId?: string;

    playerStateSubscription: Subscription;

    ngOnInit(): void {
        this.type = this.route.snapshot.paramMap.get('type') as 'artist' | 'track' | 'playlist' | 'album';
        this.searchValue = this.route.snapshot.queryParamMap.get('value');

        switch (this.type) {
            case 'album':
                this.searchTypeText = 'Albumy';
                break;
            case 'artist':
                this.searchTypeText = 'Artyści';
                break;
            case 'playlist':
                this.searchTypeText = 'Playlisty';
                break;
            case 'track':
                this.searchTypeText = 'Utwory';
                break;
        }

        this.spotify.searchQuery(this.searchValue, this.type, 20).then(result => {
            this.searchItems = SearchUtils.convertSearchToSearchItems(result, false);
            this.generateBackgroundColor();
        }, (e) => console.error(e));

        this.checkIfPlaying(this.player.playerState);
        this.playerStateSubscription = this.player.onPlayerStateChanged.subscribe((state: PlayerState) => {
            this.checkIfPlaying(state);
        });
    }

    private checkIfPlaying(state: PlayerState): void {
        if (state === undefined || state.track === undefined) {
            this.isPlayingFromSearch = false;
            this.playingTrackId = undefined;
            return;
        }

        this.isPlayingFromSearch = state.source.type === 'SEARCH' && state.source.uri === 'spotify:search:' + this.searchValue;
        this.playingTrackId = state.track.id;
    }

    private generateBackgroundColor(): void {
        if (this.searchItems.length === 0) {
            return;
        }

        const image = ImagePipe.getImage(this.searchItems[0].images, this.imageSize);
        this.palette.getPalette(image.url).then(colors => {
            this.backgroundColor = this.palette.selectColor(colors);
            this.paletteLoaded = true;
        }, () => {
            this.backgroundColor = this.palette.defaultColor;
            this.paletteLoaded = true;
        });
    }

    onItemClick(item: SearchItem): void {
        switch (item.type) {
            case 'ARTIST':
                this.router.navigate(['artist/' + item.id]);
                break;
            case 'PLAYLIST':
                this.router.navigate(['playlist/' + item.id]);
                break;
            case 'ALBUM':
                this.router.navigate(['album/' + item.id]);
                break;
            case 'TRACK':
                this.bridge.player.playSearchSingleTrack(this.searchValue, item.id);
                break;
            default:
                console.error('Search type not supported', item);
                break;
        }
    }

    openContextMenu(item: SearchItem): void {
        this.contextMenu.open(item.original);
    }

    onBackClick(): void {
        this.location.back();
    }

    ngOnDestroy(): void {
        if (this.playerStateSubscription) {
            this.playerStateSubscription.unsubscribe();
            this.playerStateSubscription = undefined;
        }
    }
}
