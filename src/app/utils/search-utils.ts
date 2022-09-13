import {Search} from '../models/spotify/search';
import {SearchItem} from '../models/search-item';

export class SearchUtils {

    public static convertSearchToSearchItems(search: Search, sortItems = true): SearchItem[] {
        const temp: SearchItem[] = [];

        if (search.tracks) {
            for (const track of search.tracks.items) {
                if (track.album.images.length === 0) {
                    continue;
                }

                temp.push({
                    id: track.id,
                    name: track.name,
                    subtitle: 'Utwór • ' + track.artists.map(i => i.name).join(', '),
                    type: 'TRACK',
                    images: track.album.images,
                    popularity: track.popularity,
                    uri: track.uri,
                    original: track
                });
            }
        }

        if (search.artists) {
            for (const artist of search.artists.items) {
                if (artist.images.length === 0) {
                    continue;
                }

                temp.push({
                    id: artist.id,
                    name: artist.name,
                    subtitle: 'Artysta',
                    type: 'ARTIST',
                    images: artist.images,
                    popularity: artist.popularity,
                    uri: artist.uri,
                    original: artist
                });
            }
        }

        if (search.albums) {
            for (const album of search.albums.items) {
                if (album.images.length === 0) {
                    continue;
                }

                temp.push({
                    id: album.id,
                    name: album.name,
                    subtitle: 'Album • ' + album.artists.map(i => i.name).join(', '),
                    type: 'ALBUM',
                    images: album.images,
                    popularity: album.popularity,
                    uri: album.uri,
                    original: album
                });
            }
        }

        if (search.playlists) {
            for (const playlist of search.playlists.items) {
                if (playlist.images.length === 0) {
                    continue;
                }

                temp.push({
                    id: playlist.id,
                    name: playlist.name,
                    subtitle: 'Playlista',
                    type: 'PLAYLIST',
                    images: playlist.images,
                    popularity: 0,
                    uri: playlist.uri,
                    original: playlist
                });
            }
        }

        if (sortItems) {
            temp.sort((a, b) => {
                return a.popularity > b.popularity ? -1 : 1;
            });
        }

        return temp;
    }
}
