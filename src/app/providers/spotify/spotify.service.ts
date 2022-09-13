import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Playlist, PlaylistModify} from '../../models/spotify/playlist';
import {User} from '../../models/spotify/user';
import {Paging} from '../../models/spotify/paging';
import {Categories} from '../../models/spotify/categories';
import {Category} from '../../models/spotify/category';
import {FeaturedPlaylists} from '../../models/spotify/featured-playlists';
import {Track} from '../../models/spotify/track';
import {Tracks} from '../../models/spotify/tracks';
import {Album} from '../../models/spotify/album';
import {Artist} from '../../models/spotify/artist';
import {Artists} from '../../models/spotify/artists';
import {Search} from '../../models/spotify/search';
import {BridgeService} from '../bridge/bridge.service';
import {Albums} from '../../models/spotify/albums';

@Injectable({
    providedIn: 'root'
})
export class SpotifyService {
    constructor(
        private http: HttpClient,
        private bridge: BridgeService
    ) {}

    readonly BASE_API = 'https://api.spotify.com/v1/';
    readonly SPOTIFY_OPEN = 'https://open.spotify.com/';
    readonly UNKNOWN_DATE = '1970-01-01T00:00:00Z';
    readonly DEFAULT_MARKET = 'PL';

    playlistsCache: Playlist[] = [];
    userProfile: User;

    public loadCachedUserProfile(): void {
        if (this.bridge.checkAvailable()) {
            this.userProfile = this.bridge.account.getUserProfile();
        } else {
            this.getCurrentUserProfile().then(profile => {
                this.userProfile = profile;
                this.bridge.account.setUserProfile(profile);
            }, error => {
                console.error(error);
            });
        }
    }

    public loadCachedPlaylists(): void {
        this.getCurrentUserPlaylists(50, 0).then(result => {
            this.playlistsCache = result.items;
        }, error => {
            console.error(error);
            this.playlistsCache = [];
        });
    }

    private getAuthHeaders(): HttpHeaders {
        return new HttpHeaders({Authorization: 'Bearer ' + this.bridge.account.getSpotifyAccessToken()});
    }

    private getAuthHeadersWithContent(): HttpHeaders {
        return new HttpHeaders({
            Authorization: 'Bearer ' + this.bridge.account.getSpotifyAccessToken(),
            'Content-Type': 'application/json'
        });
    }

    getCurrentUserProfile(): Promise<User> {
        return this.http.get<User>(this.BASE_API + 'me', {headers: this.getAuthHeaders()}).toPromise();
    }

    getCurrentUserPlaylists(limit?: number, offset?: number): Promise<Paging<Playlist>> {
        let params = new HttpParams();
        if (limit) {
            params = params.append('limit', limit.toString());
        }
        if (offset && offset > 0) {
            params = params.append('offset', offset.toString());
        }

        return this.http.get<Paging<Playlist>>(this.BASE_API + 'me/playlists',
            {headers: this.getAuthHeaders(), params}).toPromise();
    }

    getNewReleases(country: string, limit: number = 20, offset: number = 0): Promise<Albums> {
        let params = new HttpParams();
        if (country) {
            params = params.append('country', country);
        }
        if (limit) {
            params = params.append('limit', String(limit));
        }
        if (offset) {
            params = params.append('offset', String(offset));
        }

        return this.http.get<Albums>(this.BASE_API + 'browse/new-releases',
            {headers: this.getAuthHeaders(), params}).toPromise();
    }

    getBrowseCategories(): Promise<Categories> {
        return this.http.get<Categories>(this.BASE_API + 'browse/categories?country=PL&locale=pl_PL&limit=50',
            {headers: this.getAuthHeaders()}).toPromise();
    }

    getBrowseCategory(id: string): Promise<Category> {
        return this.http.get<Category>(this.BASE_API + 'browse/categories/' + id + '?country=PL&locale=pl_PL',
            {headers: this.getAuthHeaders()}).toPromise();
    }

    getCategoryPlaylists(categoryId, country?: string, limit?: number, offset?: number): Promise<FeaturedPlaylists> {
        let params = new HttpParams();
        if (country) {
            params = params.append('country', country);
        }
        if (limit) {
            params = params.append('limit', limit.toString());
        }
        if (offset) {
            params = params.append('offset', offset.toString());
        }

        return this.http.get<FeaturedPlaylists>(this.BASE_API + 'browse/categories/' + categoryId + '/playlists',
            {headers: this.getAuthHeaders(), params}).toPromise();
    }

    getFeaturedPlaylists(): Promise<FeaturedPlaylists> {
        return this.http.get<FeaturedPlaylists>(this.BASE_API + 'browse/featured-playlists?country=PL&locale=pl_PL',
            {headers: this.getAuthHeaders()}).toPromise();
    }

    getTrack(trackId: string): Promise<Track> {
        return this.http.get<Track>(this.BASE_API + 'tracks/' + trackId,
            {headers: this.getAuthHeaders()}).toPromise();
    }

    getTracks(trackIds: string[]): Promise<Tracks> {
        return this.http.get<Tracks>(this.BASE_API + 'tracks/?ids=' + trackIds.join(','),
            {headers: this.getAuthHeaders()}).toPromise();
    }

    getAlbum(albumId: string): Promise<Album> {
        return this.http.get<Album>(this.BASE_API + 'albums/' + albumId,
            {headers: this.getAuthHeaders()}).toPromise();
    }

    getArtist(artistId: string): Promise<Artist> {
        return this.http.get<Artist>(this.BASE_API + 'artists/' + artistId,
            {headers: this.getAuthHeaders()}).toPromise();
    }

    getArtists(artistIds: string[]): Promise<Artists> {
        return this.http.get<Artists>(this.BASE_API + 'artists?ids=' + artistIds.join(','),
            {headers: this.getAuthHeaders()}).toPromise();
    }

    getArtistTopTracks(artistId: string): Promise<Tracks> {
        return this.http.get<Tracks>(this.BASE_API + 'artists/' + artistId + '/top-tracks?market=from_token',
            {headers: this.getAuthHeaders()}).toPromise();
    }

    getArtistAlbums(artistId: string, includeGroups?: string, market?: string,
                    limit?: number, offset?: number): Promise<Paging<Album>> {
        let params = new HttpParams();
        if (includeGroups) {
            params = params.append('include_groups', includeGroups);
        }
        if (market) {
            params = params.append('market', market);
        }
        if (limit && limit > 0) {
            params = params.append('limit', limit.toString());
        }
        if (offset && offset > 0) {
            params = params.append('offset', offset.toString());
        }

        return this.http.get<Paging<Album>>(this.BASE_API + 'artists/' + artistId + '/albums',
            {headers: this.getAuthHeaders(), params}).toPromise();
    }

    getArtistRelatedArtists(artistId: string): Promise<Artists> {
        return this.http.get<Artists>(this.BASE_API + 'artists/' + artistId + '/related-artists',
            {headers: this.getAuthHeaders()}).toPromise();
    }

    getAlbumTracks(albumId: string, limit?: number, offset?: number): Promise<Paging<Track>> {
        let params = new HttpParams();
        if (limit) {
            params = params.append('limit', limit.toString());
        }
        if (offset && offset > 0) {
            params = params.append('offset', offset.toString());
        }

        return this.http.get<Paging<Track>>(this.BASE_API + 'albums/' + albumId + '/tracks',
            {headers: this.getAuthHeaders(), params}).toPromise();
    }

    getPlaylist(playlistId: string, market?: string): Promise<Playlist> {
        let params = new HttpParams();
        if (market) {
            params = params.append('market', market);
        }

        return this.http.get<Playlist>(this.BASE_API + 'playlists/' + playlistId,
            {headers: this.getAuthHeaders(), params}).toPromise();
    }

    createPlaylist(userId: string, name: string, description: string, publicPlaylist: boolean): Promise<Playlist> {
        const data = {name, description, public: publicPlaylist};

        return this.http.post<Playlist>(this.BASE_API + 'users/' + userId + '/playlists', data,
            {headers: this.getAuthHeadersWithContent()}).toPromise();
    }

    updatePlaylistDetails(playlistId: string, name?: string, description?: string, publicPlaylist?: boolean): Promise<any> {
        const data: any = {};

        if (name) {
            data.name = name;
        }
        if (description) {
            data.description = description;
        }
        if (publicPlaylist) {
            data.public = publicPlaylist;
        }

        return this.http.put(this.BASE_API + 'playlists/' + playlistId, data,
            {headers: this.getAuthHeadersWithContent()}).toPromise();
    }

    addTracksToPlaylist(playlistId: string, tracksUris: string[]): Promise<PlaylistModify> {
        const data = {uris: tracksUris};

        return this.http.post<PlaylistModify>(this.BASE_API + 'playlists/' + playlistId + '/tracks', data,
            {headers: this.getAuthHeadersWithContent()}).toPromise();
    }

    // tracksUris: array of {uri: '', positions: [0]}
    removeTracksFromPlaylist(playlistId: string, playlistSnapshotId: string, tracksUris: any[]): Promise<PlaylistModify> {
        const data = {tracks: tracksUris, snapshot_id: playlistSnapshotId};

        return this.http.request<PlaylistModify>('DELETE', this.BASE_API + 'playlists/' + playlistId + '/tracks',
            {body: data, headers: this.getAuthHeadersWithContent()}).toPromise();
    }

    followPlaylist(playlistId: string): Promise<any> {
        return this.http.request('PUT', this.BASE_API + 'playlists/' + playlistId + '/followers',
            {headers: this.getAuthHeaders()}).toPromise();
    }

    unFollowPlaylist(playlistId: string): Promise<any> {
        return this.http.request('DELETE', this.BASE_API + 'playlists/' + playlistId + '/followers',
            {headers: this.getAuthHeaders()}).toPromise();
    }

    searchQuery(query: string, type: string, limit: number): Promise<Search> {
        let params = new HttpParams();
        params = params.append('q', query);
        params = params.append('type', type);
        params = params.append('limit', String(limit));

        return this.http.get<Search>(this.BASE_API + 'search',
            {params, headers: this.getAuthHeaders()}).toPromise();

    }
}
