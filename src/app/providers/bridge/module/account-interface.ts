import {User} from '../../../models/spotify/user';
import * as Sentry from '@sentry/angular';

export class AccountInterface {
    private userProfile: User;

    public checkAvailable(): boolean {
        return typeof Account !== 'undefined';
    }

    public getUserProfile(): User {
        if (this.userProfile) {
            return this.userProfile;
        }

        try {
            this.userProfile = JSON.parse(Account.getUserProfile());
        } catch (e) {
            console.error(e);

            // TODO Remove after debug
            Sentry.captureMessage('User profile read failed, result = ' + Account.getUserProfile());
        }

        return this.userProfile;
    }

    public setUserProfile(user: User): void {
        this.userProfile = user;
    }

    public getSpotifyAccessToken(): string {
        if (!this.checkAvailable()) {
            return localStorage.getItem('spotifyAccessToken');
        }
        return Account.getSpotifyAccessToken();
    }

    public logout(): void {
        if (!this.checkAvailable()) {
            return;
        }
        Account.logout();
    }
}
