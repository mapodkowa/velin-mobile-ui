import {BrowserModule, HammerModule} from '@angular/platform-browser';
import {APP_INITIALIZER, ErrorHandler, LOCALE_ID, NgModule} from '@angular/core';
import '@angular/common/locales/global/pl';
import * as Sentry from '@sentry/angular';

import {AppComponent} from './app.component';
import {BottomNavigationComponent} from './components/bottom-navigation/bottom-navigation.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {HomeComponent} from './components/home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {ImagePipe} from './pipes/image.pipe';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {AppRoutingModule} from './app.routing';
import {SearchComponent} from './components/search/search.component';
import {LibraryComponent} from './components/library/library.component';
import {Router, RouteReuseStrategy} from '@angular/router';
import {CustomReuseStrategy} from './utils/reuse-strategy';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowseComponent} from './components/browse/browse.component';
import {RandomColorSeedDirective} from './directives/random-color-seed.directive';
import {PlaylistComponent} from './components/playlist/playlist.component';
import {ArtistsPipe} from './pipes/artists.pipe';
import {PlayerComponent} from './components/player/player.component';
import {PlayerMiniComponent} from './components/player-mini/player-mini.component';
import {ProgressbarComponent} from './components/progressbar/progressbar.component';
import {FormatTimePipe} from './pipes/format-time.pipe';
import {CategoryComponent} from './components/category/category.component';
import {CanDeactivatePlayer} from './utils/can-deactivate-player';
import {DefaultImageDirective} from './directives/default-image.directive';
import {FormsModule} from '@angular/forms';
import {FocusDirective} from './directives/focus.directive';
import {ArtistComponent} from './components/artist/artist.component';
import {FitTextDirective} from './directives/fit-text.directive';
import {NumberWithSpacesPipe} from './pipes/number-with-spaces.pipe';
import {AlbumComponent} from './components/album/album.component';
import {StatusBarDividerDirective} from './directives/status-bar-divider.directive';
import {TracksDurationPipe} from './pipes/tracks-duration.pipe';
import {SettingsComponent} from './components/settings/settings.component';
import {MatRippleModule} from '@angular/material/core';
import {MatSliderModule} from '@angular/material/slider';
import {FirstLetterPipe} from './pipes/first-letter.pipe';
import {SearchDetailsComponent} from './components/search-details/search-details.component';
import {FormatBytesPipe} from './pipes/format-bytes.pipe';
import {ContextMenuComponent} from './components/context-menu/context-menu.component';
import {LongPressDirective} from './directives/long-press.directive';
import {CastComponent} from './components/cast/cast.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {UpdateComponent} from './components/update/update.component';

@NgModule({
    declarations: [
        AppComponent,
        BottomNavigationComponent,
        HomeComponent,
        ImagePipe,
        SearchComponent,
        LibraryComponent,
        BrowseComponent,
        RandomColorSeedDirective,
        PlaylistComponent,
        ArtistsPipe,
        PlayerComponent,
        PlayerMiniComponent,
        ProgressbarComponent,
        FormatTimePipe,
        CategoryComponent,
        DefaultImageDirective,
        FocusDirective,
        ArtistComponent,
        FitTextDirective,
        NumberWithSpacesPipe,
        AlbumComponent,
        StatusBarDividerDirective,
        TracksDurationPipe,
        SettingsComponent,
        FirstLetterPipe,
        SearchDetailsComponent,
        FormatBytesPipe,
        ContextMenuComponent,
        LongPressDirective,
        CastComponent,
        UpdateComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FontAwesomeModule,
        LazyLoadImageModule,
        HammerModule,
        MatRippleModule,
        MatSliderModule,
        MatSnackBarModule
    ],
    providers: [
        {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler({
                showDialog: false,
            }),
        },
        {
            provide: Sentry.TraceService,
            deps: [Router],
        },
        {
            provide: APP_INITIALIZER,
            useFactory: () => () => {},
            deps: [Sentry.TraceService],
            multi: true,
        },
        {provide: RouteReuseStrategy, useClass: CustomReuseStrategy},
        {provide: LOCALE_ID, useValue: 'pl'},
        CanDeactivatePlayer
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
