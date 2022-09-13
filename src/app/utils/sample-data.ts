import {PlayerState} from '../models/bridge/player/player-state';

export class SampleData {
    public static playerState: PlayerState = {
        playbackStatus: 'PLAYING',
        playbackPosition: 20000,
        trackDuration: 40000,
        source: {
            uri: 'spotify:playlist:37i9dQZF1DXdPec7aLTmlC',
            type: 'PLAYLIST',
            name: 'Test Playlist'
        },
        queuePosition: 0,
        shuffleMode: 0,
        repeatMode: 0,
        track: {
            id: '6rAGFY9D3ah6Lb7fUgbNNH',
            name: 'Test Track',
            artists: 'Test Artist',
            albumName: 'Test Album',
            albumImages: [
                {
                    height: 300,
                    width: 300,
                    url: 'assets/img/empty2.png'
                }
            ]
        }
    };

    public static attachState(): void {
        (window as any).playerState = SampleData.playerState;
    }
}
