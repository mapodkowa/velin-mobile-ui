import {Component, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {ScrollHelperService} from './providers/scroll-helper.service';
import {BridgeService} from './providers/bridge/bridge.service';
import {PlayerService} from './providers/player.service';
import {routerAnimation} from './utils/animation/router.animation';
import {AppConfig} from '../environments/environment';
import {SpotifyOAuthService} from './providers/spotify/spotify-oauth.service';
import {AnimationEvent} from '@angular/animations';
import {SpotifyService} from './providers/spotify/spotify.service';
import {SearchHistoryService} from './providers/search/search-history.service';
import {AppUpdateService} from './providers/update/app-update.service';
import {ModalService} from './providers/modal.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [routerAnimation]
})
export class AppComponent implements OnInit {
    @ViewChild('content') contentDiv: ElementRef;

    constructor(
        private scroll: ScrollHelperService,
        private router: Router,
        private bridge: BridgeService,
        private player: PlayerService,
        private viewContainerRef: ViewContainerRef,
        private spotifyAuth: SpotifyOAuthService,
        private spotify: SpotifyService,
        private searchHistory: SearchHistoryService,
        private update: AppUpdateService,
        private modal: ModalService
    ) {
        // @ts-ignore: private option not yet exposed for public use
        router.canceledNavigationResolution = 'computed';
    }

    ngOnInit(): void {
        this.bridge.startMessageListener();
        this.player.startMessageListener();

        this.modal.setRootViewContainerRef(this.viewContainerRef);

        this.spotify.loadCachedUserProfile();
        this.spotify.loadCachedPlaylists();

        this.searchHistory.load().then(() => {});

        if (this.bridge.update.checkAvailable() || !AppConfig.production) {
            this.update.checkForUpdate();
        }

        // Handle Spotify OAuth only in dev build and without bridge access
        if (!AppConfig.production && !this.bridge.checkAvailable()) {
            console.log('Dev build, check Spotify OAuth...');
            this.spotifyAuth.handleOAuth();
        }
    }

    prepareRoute(outlet: RouterOutlet): ActivatedRoute {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
    }

    onContentScroll(): void {
        this.scroll.onContentScroll.emit(this.contentDiv.nativeElement.scrollTop);
    }

    setContentScroll(x: number, y: number): void {
        this.contentDiv.nativeElement.scrollTo(x, y);
    }

    animationStartEvent(event: AnimationEvent): void {
        if (event.toState !== null && event.totalTime > 0) {
            setTimeout(() => {
                this.setContentScroll(0, 0);
            }, event.totalTime / 2);
        }
    }
}
