import {Component, OnDestroy, OnInit} from '@angular/core';
import {faArrowLeft, faEllipsisV, faTimes} from '@fortawesome/free-solid-svg-icons';
import {SpotifyService} from '../../providers/spotify/spotify.service';
import {SearchItem} from '../../models/search-item';
import {ImageSize} from '../../models/image-size';
import {PaletteService} from '../../providers/palette.service';
import {ImagePipe} from '../../pipes/image.pipe';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchCacheService} from '../../providers/search/search-cache.service';
import {BridgeService} from '../../providers/bridge/bridge.service';
import {SearchUtils} from '../../utils/search-utils';
import {ContextMenuService} from '../../providers/context-menu.service';
import {SearchHistoryService} from '../../providers/search/search-history.service';
import {fadeInOutAnimation} from '../../utils/animation/fade.animation';
import {Subscription} from 'rxjs';
import {PlayerState} from '../../models/bridge/player/player-state';
import {PlayerService} from '../../providers/player.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    animations: [fadeInOutAnimation]
})
export class SearchComponent implements OnInit, OnDestroy {

    constructor(
        private spotify: SpotifyService,
        private location: Location,
        private palette: PaletteService,
        private router: Router,
        private cache: SearchCacheService,
        private bridge: BridgeService,
        private contextMenu: ContextMenuService,
        private route: ActivatedRoute,
        public history: SearchHistoryService,
        private player: PlayerService
    ) {
    }

    faArrowLeft = faArrowLeft;
    faTimes = faTimes;
    faEllipsisV = faEllipsisV;

    defaultBackgroundColor = '#444547';
    backgroundColor = this.defaultBackgroundColor;
    imageSize = ImageSize.MEDIUM;

    searchValue = '';
    searchTimeout = null;
    searchItems: SearchItem[] = null;
    inputAutoFocus = true;
    inputFocused = true;
    readonly allowedSearchKeys = 'qwertyuiopasdfghjklzxcvbnm1234567890';

    isPlayingFromHistory = false;
    isPlayingFromSearch = false;
    playingTrackId?: string;

    playerStateSubscription: Subscription;

    ngOnInit(): void {
        const query = this.route.snapshot.queryParamMap.get('q');
        if (query) {
            if (this.cache.isCached) {
                this.cache.clear();
            }

            this.searchValue = query;
            this.inputAutoFocus = false;
            this.inputFocused = false;
            this.search(this.searchValue);
        }

        if (this.cache.isCached) {
            this.searchValue = this.cache.cachedSearchValue;
            this.searchItems = this.cache.cachedSearchItems;
            this.backgroundColor = this.cache.cacheBackgroundColor;

            this.inputAutoFocus = false;
            this.inputFocused = false;

            this.cache.clear();
        }

        this.checkIfPlaying(this.player.playerState);
        this.playerStateSubscription = this.player.onPlayerStateChanged.subscribe((state: PlayerState) => {
            this.checkIfPlaying(state);
        });
    }

    private checkIfPlaying(state: PlayerState): void {
        if (state === undefined || state.track === undefined) {
            this.isPlayingFromHistory = false;
            this.isPlayingFromSearch = false;
            this.playingTrackId = undefined;
            return;
        }

        this.isPlayingFromHistory = state.source.type === 'HISTORY';
        this.isPlayingFromSearch = state.source.type === 'SEARCH';
        this.playingTrackId = state.track.id;
    }

    onSearchChanged(event: KeyboardEvent): void {
        if (this.searchValue.length === 0) {
            this.clearSearch();
        }

        if (event.key !== 'Unidentified' && this.allowedSearchKeys.indexOf(event.key.toLowerCase()) === -1) {
            return;
        }

        this.search(this.searchValue);
    }

    clearSearch(): void {
        this.searchValue = '';
        this.searchItems = null;
        this.backgroundColor = this.defaultBackgroundColor;

        if (this.searchTimeout !== null) {
            clearTimeout(this.searchTimeout);
        }
    }

    search(text: string): void {
        if (text.length > 0) {
            if (this.searchTimeout !== null) {
                clearTimeout(this.searchTimeout);
            }

            this.searchTimeout = setTimeout(() => {
                this.searchTimeout = null;
                this.spotify.searchQuery(text, 'track,album,artist,playlist', 4).then(result => {
                    this.searchItems = SearchUtils.convertSearchToSearchItems(result);

                    this.checkIfPlaying(this.player.playerState);
                    this.generateBackgroundColor();
                }, (e) => console.error(e));
            }, 350);
        } else {
            if (this.searchTimeout !== null) {
                clearTimeout(this.searchTimeout);
            }
        }
    }

    private generateBackgroundColor(): void {
        if (this.searchItems.length === 0) {
            return;
        }

        const image = ImagePipe.getImage(this.searchItems[0].images, this.imageSize);
        this.palette.getPalette(image.url).then(colors => {
            this.backgroundColor = this.palette.selectColor(colors);
        }, () => {
            this.backgroundColor = this.palette.defaultColor;
        });
    }

    onBackClick(): void {
        this.location.back();
    }

    onItemClick(item: SearchItem, index: number, fromHistory = false): void {
        if (!fromHistory) {
            this.history.addItem(item).then(() => {});
        }

        switch (item.type) {
            case 'ARTIST':
                this.router.navigate(['artist/' + item.id]).then(() => {
                    this.cache.save(this.searchValue, this.backgroundColor, this.searchItems);
                });
                break;
            case 'PLAYLIST':
                this.router.navigate(['playlist/' + item.id]).then(() => {
                    this.cache.save(this.searchValue, this.backgroundColor, this.searchItems);
                });
                break;
            case 'ALBUM':
                this.router.navigate(['album/' + item.id]).then(() => {
                    this.cache.save(this.searchValue, this.backgroundColor, this.searchItems);
                });
                break;
            case 'TRACK':
                if (fromHistory) {
                    this.bridge.player.playTrackFromHistory(item.id);
                } else {
                    this.bridge.player.playSearchSingleTrack(this.searchValue.trim(), item.id);
                }
                break;
            default:
                console.error('Search type not supported', item);
                break;
        }
    }

    showDetails(type: 'artist' | 'track' | 'playlist' | 'album'): void {
        this.router.navigate(['search/' + type], {queryParams: {value: this.searchValue.trim()}}).then(() => {
            this.cache.save(this.searchValue, this.backgroundColor, this.searchItems);
        });
    }

    openContextMenu(item: SearchItem): void {
        this.contextMenu.open(item.original);
    }

    removeItemFromHistory(index: number): void {
        this.history.removeItemAtIndex(index).then(() => {});
    }

    inputFocusIn(): void {
        this.inputFocused = true;
    }

    inputFocusOut(): void {
        this.inputFocused = false;
    }

    ngOnDestroy(): void {
        if (this.playerStateSubscription) {
            this.playerStateSubscription.unsubscribe();
            this.playerStateSubscription = undefined;
        }
    }
}
