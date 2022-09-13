import {Component, OnInit} from '@angular/core';
import {BridgeService} from '../../providers/bridge/bridge.service';
import {SpotifyService} from '../../providers/spotify/spotify.service';
import {Playlist} from '../../models/spotify/playlist';
import {ImageSize} from '../../models/image-size';
import {Router} from '@angular/router';
import {PlayerService} from '../../providers/player.service';
import {ContextMenuService} from '../../providers/context-menu.service';

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

    constructor(
        public bridge: BridgeService,
        private spotify: SpotifyService,
        private router: Router,
        public player: PlayerService,
        private contextMenu: ContextMenuService
    ) {
    }

    playlists: Playlist[] = [];
    imageSize = ImageSize.MEDIUM;

    ngOnInit(): void {
        this.spotify.getCurrentUserPlaylists(50, 0).then(result => {
            this.playlists = result.items;
            this.spotify.playlistsCache = result.items;
        }, (e) => console.error(e));
    }

    press(playlist: Playlist): void {
        this.router.navigate(['playlist/' + playlist.id]);
    }

    longPress(playlist: Playlist): void {
        this.contextMenu.open(playlist);
    }

}
