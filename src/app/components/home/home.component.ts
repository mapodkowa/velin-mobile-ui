import {Component, OnInit} from '@angular/core';
import {faCog} from '@fortawesome/free-solid-svg-icons';
import {HomeItem} from '../../models/home-item';
import {SpotifyService} from '../../providers/spotify/spotify.service';
import {ImageSize} from '../../models/image-size';
import {BridgeService} from '../../providers/bridge/bridge.service';
import {SpotifyUri} from '../../utils/spotify-uri';
import {Router} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(
        private spotify: SpotifyService,
        public bridge: BridgeService,
        private router: Router
    ) {}

    faCog = faCog;
    targetImageSize = ImageSize.MEDIUM;
    visibleItems: HomeItem[] = [];
    items: HomeItem[] = [
        {
            title: '',
            content: []
        },
        {
            title: 'Nowe wydania',
            content: []
        },
        {
            title: 'Twoje playlisty',
            content: []
        }
    ];

    ngOnInit(): void {
        this.spotify.getFeaturedPlaylists().then(result => {
            this.items[0] = {
                title: result.message,
                content: result.playlists.items
            };
            this.addToVisibleItems(0);
        }, (e) => console.error(e));

        this.spotify.getNewReleases('PL', 10).then(result => {
            this.items[1].content = result.albums.items;
            this.addToVisibleItems(1);
        }, (e) => console.error(e));

        this.spotify.getCurrentUserPlaylists(10).then(result => {
            this.items[2].content = result.items;
            this.addToVisibleItems(2);
        }, (e) => console.error(e));
    }

    addToVisibleItems(index: number): void {
        this.visibleItems.splice(index, 0, this.items[index]);
    }

    onItemClick(uri: string): void {
        const parsedUri = SpotifyUri.parse(uri);

        if (parsedUri.playlist) {
            this.router.navigate(['playlist/' + parsedUri.playlist]);
        } else if (parsedUri.album) {
            this.router.navigate(['album/' + parsedUri.album]);
        } else if (parsedUri.artist) {
            this.router.navigate(['artist/' + parsedUri.artist]);
        }
    }

    openSettings(): void {
        this.router.navigate(['settings']);
    }
}
