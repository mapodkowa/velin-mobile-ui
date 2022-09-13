import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {ModalService} from '../providers/modal.service';

@Injectable()
export class CanDeactivatePlayer<T> implements CanDeactivate<T> {
    constructor(
        private modal: ModalService
    ) {}

    canDeactivate(
        component: T,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
        return this.modal.onBackClick();
    }
}
