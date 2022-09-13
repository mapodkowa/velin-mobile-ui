import {Component, EventEmitter, HostBinding, OnInit} from '@angular/core';
import {contextMenuAnimation} from '../../utils/animation/context-menu.animation';
import {Playlist} from '../../models/spotify/playlist';
import {Track} from '../../models/spotify/track';
import {Album} from '../../models/spotify/album';
import {faPlus, faRecordVinyl, faShareAlt, faTimes} from '@fortawesome/free-solid-svg-icons';
import {faEdit, faPlusSquare, faUser} from '@fortawesome/free-regular-svg-icons';
import {ImageSize} from '../../models/image-size';
import {ContextMenuItem} from '../../models/context-menu/context-menu-item';
import {SpotifyService} from '../../providers/spotify/spotify.service';
import {
    ADD_TRACK_PLAYLIST,
    DELETE_PLAYLIST,
    EDIT_PLAYLIST,
    FOLLOW,
    OPEN_ALBUM,
    OPEN_ARTIST,
    SHARE,
    UN_FOLLOW
} from '../../models/context-menu/context-menu-keys';
import {Artist} from '../../models/spotify/artist';

@Component({
    selector: 'app-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss'],
    animations: [contextMenuAnimation]
})
export class ContextMenuComponent implements OnInit {
    @HostBinding('@contextMenuAnimation') contextMenuAnimation;

    itemClick: EventEmitter<ContextMenuItem>;
    close: EventEmitter<void>;
    canClose = false; // Prevent accidental close

    item: Playlist | Track | Album | Artist;
    playlist: Playlist;
    track: Track;
    album: Album;
    artist: Artist;

    context?: Playlist | Album | Artist;

    mainImageSize = ImageSize.BIG;
    items: ContextMenuItem[] = [];

    readonly publicPlaylistItems: ContextMenuItem[] = [
        {id: FOLLOW, icon: faPlus, iconSize: '1.25em', title: 'Obserwuj'},
        {id: UN_FOLLOW, icon: faTimes, title: 'Przestań obserwować'},
        {id: SHARE, icon: faShareAlt, iconSize: '1.3em', title: 'Udostępnij'}
    ];

    readonly privatePlaylistItems: ContextMenuItem[] = [
        {id: EDIT_PLAYLIST, icon: faEdit, iconSize: '1.05em', title: 'Edytuj playlistę'},
        {id: DELETE_PLAYLIST, icon: faTimes, title: 'Usuń playlistę'},
        {id: SHARE, icon: faShareAlt, iconSize: '1.3em', title: 'Udostępnij'}
    ];

    readonly trackItems: ContextMenuItem[] = [
        {id: ADD_TRACK_PLAYLIST, icon: faPlusSquare, iconSize: '1.4em', title: 'Dodaj do playlisty'},
        {id: OPEN_ALBUM, icon: faRecordVinyl, iconSize: '1.35em', title: 'Pokaż album'},
        {id: OPEN_ARTIST, icon: faUser, title: 'Pokaż wykonawcę'},
        {id: SHARE, icon: faShareAlt, title: 'Udostępnij'}
    ];

    readonly albumItems: ContextMenuItem[] = [
        {id: OPEN_ARTIST, icon: faUser, title: 'Pokaż wykonawcę'},
        {id: SHARE, icon: faShareAlt, title: 'Udostępnij'}
    ];

    readonly artistItems: ContextMenuItem[] = [
        {id: SHARE, icon: faShareAlt, title: 'Udostępnij'}
    ];

    constructor(
        private spotify: SpotifyService
    ) {}

    ngOnInit(): void {
        if (this.item.uri.startsWith('spotify:playlist:')) {
            this.handlePlaylist(this.item as Playlist);
        } else if (this.item.uri.startsWith('spotify:track:')) {
            this.handleTrack(this.item as Track);
        } else if (this.item.uri.startsWith('spotify:album:')) {
            this.handleAlbum(this.item as Album);
        } else if (this.item.uri.startsWith('spotify:artist:')) {
            this.handleArtist(this.item as Artist);
        } else {
            console.error('Unknown item', this.item);
        }

        setTimeout(() => {
            this.canClose = true;
        }, 350);
    }

    private handlePlaylist(playlist: Playlist): void {
        this.playlist = playlist;
        const privatePlaylist = playlist.owner.id === this.spotify.userProfile.id;

        if (privatePlaylist) {
            this.items = JSON.parse(JSON.stringify(this.privatePlaylistItems));
        } else {
            this.items = JSON.parse(JSON.stringify(this.publicPlaylistItems));

            // Check if playlist is followed
            if (this.spotify.playlistsCache && this.spotify.playlistsCache.length > 0) {
                if (this.spotify.playlistsCache.map(p => p.id).indexOf(playlist.id) > -1) {
                    this.items.splice(this.items.map(i => i.id).indexOf('follow'), 1);
                } else {
                    this.items.splice(this.items.map(i => i.id).indexOf('un-follow'), 1);
                }
            } else {
                // Remove follow and unfollow options
                this.items.splice(this.items.map(i => i.id).indexOf('follow'), 1);
                this.items.splice(this.items.map(i => i.id).indexOf('un-follow'), 1);
            }
        }
    }

    private handleTrack(track: Track): void {
        this.track = track;
        this.items = JSON.parse(JSON.stringify(this.trackItems));
    }

    private handleAlbum(album: Album): void {
        this.album = album;
        this.items = JSON.parse(JSON.stringify(this.albumItems));
    }

    private handleArtist(artist: Artist): void {
        this.artist = artist;
        this.items = JSON.parse(JSON.stringify(this.artistItems));
    }

    onItemClick(item: ContextMenuItem): void {
        this.itemClick.emit(item);
        this.closeMenu();
    }

    closeMenu(): void {
        if (!this.canClose) {
            return;
        }

        this.close.emit();
    }
}
