import {Component, OnInit} from '@angular/core';
import {BridgeService} from '../../providers/bridge/bridge.service';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {SpotifyService} from '../../providers/spotify/spotify.service';
import {Category} from '../../models/spotify/category';
import {ImageSize} from '../../models/image-size';
import {Router} from '@angular/router';
import {SearchCacheService} from '../../providers/search/search-cache.service';

@Component({
    selector: 'app-browse',
    templateUrl: './browse.component.html',
    styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

    constructor(
        public bridge: BridgeService,
        private spotify: SpotifyService,
        private router: Router,
        private searchCache: SearchCacheService
    ) {
    }

    faSearch = faSearch;
    categories: Category[] = [];
    categoryImageSize = ImageSize.SMALL;

    ngOnInit(): void {
        this.spotify.getBrowseCategories().then(result => {
            this.categories = result.categories.items;
        }, (e) => console.error(e));
    }

    onCategoryClick(category: Category): void {
        this.router.navigate(['category/' + category.id]);
    }

    onSearchClick(): void {
        this.searchCache.clear();
        this.router.navigate(['search']);
    }
}
