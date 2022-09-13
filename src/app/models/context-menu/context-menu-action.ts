import {ContextMenuItem} from './context-menu-item';
import {Playlist} from '../spotify/playlist';
import {Track} from '../spotify/track';
import {Album} from '../spotify/album';
import {Artist} from '../spotify/artist';

export interface ContextMenuAction {
    menuItem: ContextMenuItem;
    item: Playlist | Track | Album | Artist;
    context?: Playlist | Album | Artist;
}
