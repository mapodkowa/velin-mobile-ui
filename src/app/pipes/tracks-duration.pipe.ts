import {Pipe, PipeTransform} from '@angular/core';
import {Track} from '../models/spotify/track';

@Pipe({
    name: 'tracksDuration'
})
export class TracksDurationPipe implements PipeTransform {

    transform(value: Track[], ...args: unknown[]): unknown {
        let duration = 0;

        for (const track of value) {
            duration += track.duration_ms;
        }

        const hours = Math.floor(((duration / (1000 * 60 * 60)) % 24));
        const minutes = Math.floor(((duration / (1000 * 60)) % 60));
        return hours + ' godz. ' + minutes + ' min';
    }

}
