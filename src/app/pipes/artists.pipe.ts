import {Pipe, PipeTransform} from '@angular/core';
import {Artist} from '../models/spotify/artist';

@Pipe({
    name: 'artists'
})
export class ArtistsPipe implements PipeTransform {

    transform(value: Artist[], ...args: unknown[]): unknown {
        return value.map(i => i.name).join(', ');
    }

}
