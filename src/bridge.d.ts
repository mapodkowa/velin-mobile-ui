interface WebAppInterface {
    getAppVersion(): string;
    getAppVersionCode(): number;
    getStatusBarHeight(): number;
    setAnyModalOpen(open: boolean): void;
}

interface PlayerInterface {
    // Play item
    playPlaylist(playlistId: string, startPosition: number, snapshotId: string): void;
    playArtist(artistId: string, artistName: string, startPosition: number): void;
    playAlbum(albumId: string, startPosition: number): void;
    playTrack(trackId: string): void;
    playSearch(searchText: string, trackId: string): void;
    playSearchSingleTrack(searchText: string, trackId: string): void;
    playTrackFromHistory(trackId: string): void;

    // Playback control
    play(): void;
    pause(): void;
    skipToNext(): void;
    skipToPrevious(): void;
    seekTo(position: number): void;
    setShuffleMode(shuffleMode: number): void;
    setRepeatMode(repeatMode: number): void;
}

interface StorageInterface {
    storeValue(key: string, value: string | number | boolean): void;

    getStringValue(key: string): string;
    getNumberValue(key: string): number;
    getBooleanValue(key: string): boolean;

    getStats(): string;
    clearCache(): void;
}

interface AccountInterface {
    getSpotifyAccessToken(): string;
    getUserProfile(): string;
    logout(): void;
}

interface DialogInterface {
    openDialog(title: string, message: string, dialogButtons: number): number;
    closeDialog(id: number): void;
}

interface ToastInterface {
    makeText(text: string, duration: number): void;
}

interface ClipboardInterface {
    copyText(text: string): void;
}

interface CastInterface {
    getDevicesJson(): string;
    getActiveDeviceId(): string | undefined;

    selectDevice(id: string): void;
    unSelectDevice(): void;
}

interface UpdateInterface {
    getLatestVersion(): string;
    downloadUpdateFile(): void;
    installUpdate(): void;
}

declare var Bridge: WebAppInterface;
declare var Player: PlayerInterface;
declare var Data: StorageInterface;
declare var Account: AccountInterface;
declare var Dialog: DialogInterface;
declare var Toast: ToastInterface;
declare var AppClipboard: ClipboardInterface;
declare var Cast: CastInterface;
declare var Update: UpdateInterface;
