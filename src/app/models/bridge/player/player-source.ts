import {Sources} from './player-sources';

export interface PlayerSource {
    name?: string;
    uri?: string;
    type: Sources;
}
