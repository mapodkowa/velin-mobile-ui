export class ClipboardInterface {

    public checkAvailable(): boolean {
        return typeof AppClipboard !== 'undefined';
    }

    public copyText(text: string): void {
        if (!this.checkAvailable()) {
            console.log('[Clipboard] ' + text);
            return;
        }

        AppClipboard.copyText(text);
    }
}
