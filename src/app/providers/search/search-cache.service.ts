import {Injectable} from '@angular/core';
import {SearchItem} from '../../models/search-item';

@Injectable({
    providedIn: 'root'
})
export class SearchCacheService {

    constructor() {}

    cachedSearchValue = '';
    cacheBackgroundColor = '';
    cachedSearchItems: SearchItem[] = null;
    isCached = false;

    public save(value: string, backgroundColor: string, items: SearchItem[]): void {
        this.clear();

        this.cachedSearchValue = value;
        this.cacheBackgroundColor = backgroundColor;
        this.cachedSearchItems = items;

        this.isCached = true;
    }

    public clear(): void {
        this.cachedSearchValue = '';
        this.cacheBackgroundColor = '';
        this.cachedSearchItems = null;

        this.isCached = false;
    }
}
