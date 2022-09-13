import {Album} from './album';
import {Paging} from './paging';

export interface Albums {
    albums: Paging<Album>;
}
