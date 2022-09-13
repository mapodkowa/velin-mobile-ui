import {Component, OnInit} from '@angular/core';
import {BridgeService} from '../../providers/bridge/bridge.service';
import {Category} from '../../models/spotify/category';
import {FeaturedPlaylists} from '../../models/spotify/featured-playlists';
import {ActivatedRoute, Router} from '@angular/router';
import {SpotifyService} from '../../providers/spotify/spotify.service';
import {ImageSize} from '../../models/image-size';
import {Location} from '@angular/common';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {RandomColorSeedDirective} from '../../directives/random-color-seed.directive';
import {Playlist} from '../../models/spotify/playlist';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    constructor(
        public bridge: BridgeService,
        private route: ActivatedRoute,
        private spotify: SpotifyService,
        private location: Location,
        private router: Router
    ) {}

    faArrowLeft = faArrowLeft;
    mainImageSize = ImageSize.BIG;

    category: Category;
    featuredPlaylists: FeaturedPlaylists;
    backgroundColor: string;

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.backgroundColor = RandomColorSeedDirective.getRandomColor(id);

        this.spotify.getBrowseCategory(id).then(result => {
            this.category = result;
        }, (e) => console.error(e));

        this.spotify.getCategoryPlaylists(id, 'PL', 50).then(result => {
            this.featuredPlaylists = result;
        }, (e) => console.error(e));
    }

    onBackClick(): void {
        this.location.back();
    }

    onItemClick(playlist: Playlist): void {
        this.router.navigate(['playlist/' + playlist.id]);
    }

}
