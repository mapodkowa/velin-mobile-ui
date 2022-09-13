import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {SearchComponent} from './components/search/search.component';
import {LibraryComponent} from './components/library/library.component';
import {BrowseComponent} from './components/browse/browse.component';
import {PlaylistComponent} from './components/playlist/playlist.component';
import {CategoryComponent} from './components/category/category.component';
import {CanDeactivatePlayer} from './utils/can-deactivate-player';
import {ArtistComponent} from './components/artist/artist.component';
import {AlbumComponent} from './components/album/album.component';
import {SettingsComponent} from './components/settings/settings.component';
import {SearchDetailsComponent} from './components/search-details/search-details.component';

const routes: Routes = [
    {path: 'home', component: HomeComponent, data: {animation: 'home'}},
    {path: 'browse', component: BrowseComponent, data: {animation: 'browse'}},
    {path: 'search', component: SearchComponent, data: {animation: 'search'}},
    {path: 'search/:type', component: SearchDetailsComponent, data: {animation: 'search-details'}},
    {path: 'library', component: LibraryComponent, data: {animation: 'library'}},
    {path: 'settings', component: SettingsComponent, data: {animation: 'settings'}},
    {path: 'playlist/:id', component: PlaylistComponent, data: {animation: 'playlist'}},
    {path: 'artist/:id', component: ArtistComponent, data: {animation: 'artist'}},
    {path: 'album/:id', component: AlbumComponent, data: {animation: 'album'}},
    {path: 'category/:id', component: CategoryComponent, data: {animation: 'category'}},
    {path: '',  redirectTo: '/home', pathMatch: 'full'},
];

// Workaround for player closing by back button
for (const route of routes) {
    if (!route.component) {
        continue;
    }

    if (route.canDeactivate) {
        route.canDeactivate.push(CanDeactivatePlayer);
    } else {
        route.canDeactivate = [CanDeactivatePlayer];
    }
}

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
