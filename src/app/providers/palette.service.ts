import {Injectable} from '@angular/core';
import {BridgeService} from './bridge/bridge.service';
import {PaletteColors} from '../models/palette/palette-colors';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PaletteService {
    public readonly defaultColor = '#444547';
    private readonly URL = 'https://palette.androidplatform.net/';

    constructor(
        private http: HttpClient,
        private bridge: BridgeService
    ) {}

    public getPalette(imageUrl: string): Promise<PaletteColors> {
        if (!this.bridge.checkAvailable()) {
            return new Promise<PaletteColors>((resolve => resolve(null)));
        }

        const base64 = btoa(imageUrl)
            .replace('+', '-')
            .replace('/', '_')
            .replace(/=+$/, '');

        return this.http.get<PaletteColors>(this.URL + base64).toPromise();
    }

    public selectColor(colors: PaletteColors): string {
        if (colors === null) {
            return this.defaultColor;
        }

        let color = colors.darkVibrantColor;

        if (this.isDefaultColor(color)) {
            color = colors.darkMutedColor;
        }

        if (this.isDefaultColor(color)) {
            color = colors.dominantColor;
        }

        return color;
    }

    private isDefaultColor(color: string): boolean {
        return color === this.defaultColor;
    }
}
