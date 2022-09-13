import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ScrollHelperService {

    constructor() {
    }

    onContentScroll: EventEmitter<number> = new EventEmitter();
}
