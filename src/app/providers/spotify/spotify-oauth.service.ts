import {Injectable} from '@angular/core';
import {UUID} from '../../utils/uuid';
import {HashParams} from '../../utils/hash-params';

@Injectable({
    providedIn: 'root'
})
export class SpotifyOAuthService {

    constructor() {}

    readonly CLIENT_ID = '862524e9b41749548c81f63402568fe1';
    readonly SCOPE = 'user-read-private playlist-read-private playlist-modify-public playlist-modify-private ' +
        'user-follow-modify user-follow-read user-library-read user-library-modify';
    // readonly CALLBACK_URL = 'http://localhost:4401/';
    readonly CALLBACK_URL = 'http://{host}/';
    readonly AUTH_URL = 'https://accounts.spotify.com/authorize/?';

    public handleOAuth(): void {
        const hash = HashParams.params;
        if (hash && hash.access_token) {
            console.log('Received access token from Spotify');
            this.parseOAuthResponse(hash);
            return;
        }

        if (!this.checkTokenValid()) {
            console.log('Spotify access_token is invalid, redirect to auth page');
            this.openAuthPage();
        } else {
            console.log('Spotify access_token is valid');
        }
    }

    private openAuthPage(): void {
        const authState = UUID.v4();
        localStorage.setItem('authState', authState);

        const host = window.location.host;
        const queryParams = new URLSearchParams({
            client_id: this.CLIENT_ID,
            response_type: 'token',
            redirect_uri: this.CALLBACK_URL.replace('{host}', host),
            scope: this.SCOPE,
            state: authState,
            show_dialog: 'false'
        });

        window.location.href = this.AUTH_URL + queryParams.toString();
    }

    private checkTokenValid(): boolean {
        const expireDate = localStorage.getItem('spotifyExpireDate');

        if (expireDate == null) {
            return false;
        }

        const expireDateNumber = Number.parseInt(expireDate, 10);
        return new Date().getTime() < expireDateNumber;
    }

    private parseOAuthResponse(params: any): void {
        const authState = localStorage.getItem('authState');
        localStorage.removeItem('authState');

        if (params.state !== authState) {
            console.error('Invalid state, authorization rejected');
            return;
        }

        const toExpire = new Date().getTime() + (Number.parseInt(params.expires_in, 10) * 1000);
        localStorage.setItem('spotifyAccessToken', params.access_token);
        localStorage.setItem('spotifyExpireDate', toExpire.toString());

        console.log('Spotify access_token updated, reloading...');
        location.href = '/';
    }
}
