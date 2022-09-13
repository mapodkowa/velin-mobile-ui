import {UpdateInfo} from '../../../models/update/update-info';

export class UpdateInterface {

    public checkAvailable(): boolean {
        return typeof Update !== 'undefined';
    }

    public getLatestVersion(): UpdateInfo | undefined {
        if (!this.checkAvailable()) {
            return {code: 1, name: '0.0.1', updateAvailable: true};
        }

        const json = Update.getLatestVersion();
        if (!json) {
            return undefined;
        }

        return JSON.parse(json);
    }

    public downloadUpdateFile(): void {
        if (!this.checkAvailable()) {
            return;
        }
        Update.downloadUpdateFile();
    }

    public installUpdate(): void {
        if (!this.checkAvailable()) {
            return;
        }
        Update.installUpdate();
    }
}
