import {StorageStats} from '../../../models/bridge/storage-stats';

export class StorageInterface {

    public checkAvailable(): boolean {
        return typeof Data !== 'undefined';
    }

    public storeValue(key: string, value: string | number): void {
        if (!this.checkAvailable()) {
            return;
        }
        Data.storeValue(key, value);
    }

    public async getStringValue(key: string): Promise<string | undefined> {
        if (!this.checkAvailable()) {
            return undefined;
        }
        return Data.getStringValue(key);
    }

    public async getNumberValue(key: string): Promise<number | undefined> {
        if (!this.checkAvailable()) {
            return undefined;
        }
        return Data.getNumberValue(key);
    }

    public async getBooleanValue(key: string): Promise<boolean | undefined> {
        if (!this.checkAvailable()) {
            return undefined;
        }
        return Data.getBooleanValue(key);
    }

    public getStats(): StorageStats {
        if (!this.checkAvailable()) {
            return {
                totalSpace: 60000000000,
                usedSpace: 20000000000,
                freeSpace: 20000000000,
                mediaSize: 10000000000,
                cacheSize: 10000000000
            };
        }
        return JSON.parse(Data.getStats());
    }

    public clearCache(): void {
        if (!this.checkAvailable()) {
            return;
        }
        Data.clearCache();
    }
}
