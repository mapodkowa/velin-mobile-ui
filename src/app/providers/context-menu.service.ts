import {ComponentRef, EventEmitter, Injectable} from '@angular/core';
import {Playlist} from '../models/spotify/playlist';
import {Track} from '../models/spotify/track';
import {Album} from '../models/spotify/album';
import {ContextMenuItem} from '../models/context-menu/context-menu-item';
import {BridgeService} from './bridge/bridge.service';
import {
    ADD_TRACK_PLAYLIST,
    DELETE_PLAYLIST,
    EDIT_PLAYLIST,
    FOLLOW,
    OPEN_ALBUM,
    OPEN_ARTIST,
    SHARE,
    UN_FOLLOW
} from '../models/context-menu/context-menu-keys';
import {Router} from '@angular/router';
import {Artist} from '../models/spotify/artist';
import {SpotifyService} from './spotify/spotify.service';
import {SnackbarService} from './snackbar.service';
import {ContextMenuAction} from '../models/context-menu/context-menu-action';
import {ModalService} from './modal.service';
import {Modals} from '../models/modal/modals';
import {ContextMenuComponent} from '../components/context-menu/context-menu.component';

@Injectable({
    providedIn: 'root'
})
export class ContextMenuService {
    public actionEvent = new EventEmitter<ContextMenuAction>();

    private itemClickEvent: EventEmitter<ContextMenuItem>;

    private item: Playlist | Track | Album | Artist;
    private context?: Playlist | Album | Artist;

    constructor(
        private bridge: BridgeService,
        private router: Router,
        private spotify: SpotifyService,
        private snackbar: SnackbarService,
        private modal: ModalService
    ) {
    }

    public open(item: Playlist | Track | Album | Artist, context?: Playlist | Album | Artist): void {
        this.item = item;
        this.context = context;

        this.modal.open(Modals.CONTEXT_MENU, (ref: ComponentRef<ContextMenuComponent>) => {
            ref.instance.item = item;
            ref.instance.context = context;

            this.itemClickEvent = new EventEmitter<ContextMenuItem>();
            this.itemClickEvent.subscribe((id) => setTimeout(() => this.onItemClick(id), 200));
            ref.instance.itemClick = this.itemClickEvent;
        });
    }

    public onItemClick(menuItem: ContextMenuItem): void {
        console.log('onItemClick()', menuItem);

        switch (menuItem.id) {
            case FOLLOW:
                this.followPlaylistAction(menuItem);
                break;
            case DELETE_PLAYLIST:
            case UN_FOLLOW:
                this.unFollowPlaylistAction(menuItem);
                break;
            case SHARE:
                this.shareAction();
                break;
            case EDIT_PLAYLIST:
                this.notifyNotImplemented();
                break;
            case ADD_TRACK_PLAYLIST:
                this.notifyNotImplemented();
                break;
            case OPEN_ALBUM:
                this.openAlbumAction();
                break;
            case OPEN_ARTIST:
                this.openArtistAction();
                break;
        }
    }

    private followPlaylistAction(menuItem: ContextMenuItem): void {
        this.spotify.followPlaylist(this.item.id).then(() => {
            console.log('Playlist follow success, id = ' + this.item.id);
            this.snackbar.open('Ok, teraz obserwujesz playlistę ' + this.item.name);

            this.spotify.playlistsCache.unshift(this.item as Playlist);
            this.notifyAction(menuItem);
        }, error => {
            console.error('Playlist follow failed, id = ' + this.item.id + ', error =', error);
            this.snackbar.open('O nie! Wystąpił błąd w trakcie obserwowania playlisty ' + this.item.name);
        });
    }

    private unFollowPlaylistAction(menuItem: ContextMenuItem): void {
        let successText = 'Ok, przestałeś obserwować playlistę ' + this.item.name;
        let errorText = 'O nie! Wystąpił błąd w trakcie usuwania obserwowania playlisty ' + this.item.name;

        if (menuItem.id === DELETE_PLAYLIST) {
            successText = 'Ok, playlista ' + this.item.name + ' została usunięta!';
            errorText = 'O nie, wystąpił błąd podczas usuwania playlisty ' + this.item.name;
        }

        this.spotify.unFollowPlaylist(this.item.id).then(() => {
            console.log('Playlist un-follow/delete success, id = ' + this.item.id);
            this.snackbar.open(successText);

            const index = this.spotify.playlistsCache.map(p => p.id).indexOf(this.item.id);
            if (index > -1) {
                this.spotify.playlistsCache.splice(index, 1);
            }

            this.notifyAction(menuItem);
        }, error => {
            console.error('Playlist un-follow/delete failed, id = ' + this.item.id + ', error =', error);
            this.snackbar.open(errorText);
        });
    }

    private shareAction(): void {
        const path = this.item.uri
            .replace('spotify:', '')
            .replace(/:/g, '/');
        const url = this.spotify.SPOTIFY_OPEN + path;
        this.bridge.clipboard.copyText(url);

        this.snackbar.open('Link skopiowano do schowka');
    }

    private openAlbumAction(): void {
        if ('album' in this.item) {
            this.hidePlayerIfOpen();
            this.router.navigate(['album/' + this.item.album.id]);
        }
    }

    private openArtistAction(): void {
        if ('artists' in this.item) {
            this.hidePlayerIfOpen();
            this.router.navigate(['artist/' + this.item.artists[0].id]);
        }
    }

    // Need to close player before any navigation
    private hidePlayerIfOpen(): void {
        if (this.modal.isOpen(Modals.PLAYER)) {
            this.modal.close(Modals.PLAYER);
        }
    }

    private notifyAction(menuItem: ContextMenuItem): void {
        this.actionEvent.emit({
            menuItem,
            item: this.item,
            context: this.context
        });
    }

    private notifyNotImplemented(): void {
        this.snackbar.open('Wybrana opcja nie jest jeszcze obsługiwana');
    }
}
