export class SpotifyUri {

    constructor(uri: string) {
        this.uri = uri;
    }

    track?: string;
    user?: string;
    playlist?: string;
    album?: string;
    artist?: string;
    uri: string;

    static parse(uri: string): SpotifyUri {
        const data = uri.split(':');
        if (data.length > 1) {
            if (data[0] !== 'spotify') {
                return null;
            }

            const ret = new SpotifyUri(uri);

            for (let i = 1; i < data.length; i = i + 2) {
                switch (data[i]) {
                    case 'artist':
                        ret.artist = data[i + 1];
                        break;
                    case 'track':
                        ret.track = data[i + 1];
                        break;
                    case 'user':
                        ret.user = data[i + 1];
                        break;
                    case 'playlist':
                        ret.playlist = data[i + 1];
                        break;
                    case 'album':
                        ret.album = data[i + 1];
                        break;
                }
            }

            return ret;
        } else {
            return null;
        }
    }
}
