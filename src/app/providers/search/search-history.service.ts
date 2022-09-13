import {Injectable} from '@angular/core';
import {SearchItem} from '../../models/search-item';
import {StorageMap} from '@ngx-pwa/local-storage';

@Injectable({
    providedIn: 'root'
})
export class SearchHistoryService {
    private readonly key = 'history';
    private readonly limit = 20;

    constructor(private storage: StorageMap) {
    }

    items: SearchItem[] = [];

    public async load(): Promise<void> {
        const items = await this.storage.get(this.key).toPromise() as SearchItem[];
        if (items) {
            this.items = items;
        } else {
            this.items = [];
        }
    }

    public addItem(item: SearchItem): Promise<undefined> {
        const index = this.items.map(i => i.id).indexOf(item.id);
        if (index > -1) {
            this.items.splice(index, 1);
        }

        this.items.unshift(item);

        if (this.items.length > this.limit) {
            this.items.splice(this.limit, this.items.length - this.limit);
        }

        return this.save();
    }

    public removeItemAtIndex(index: number): Promise<void> {
        this.items.splice(index, 1);
        return this.save();
    }

    public clear(): Promise<void> {
        this.items = [];
        return this.storage.delete(this.key).toPromise();
    }

    private save(): Promise<undefined> {
        return this.storage.set(this.key, this.items).toPromise();
    }

}
