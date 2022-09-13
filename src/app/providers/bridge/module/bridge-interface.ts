export class BridgeInterface {
    readonly standalone: boolean = false;
    statusBarHeight = 0;

    constructor() {
        this.standalone = this.isStandalone();
        this.statusBarHeight = this.getStatusBarHeight();
    }

    public checkAvailable(): boolean {
        return typeof Bridge !== 'undefined';
    }

    public getAppVersion(): string {
        if (!this.checkAvailable()) {
            return '0.0.1-SNAPSHOT (abc1234)';
        }
        return Bridge.getAppVersion();
    }

    public getStatusBarHeight(): number {
        if (!this.checkAvailable()) {
            return this.standalone ? 0 : 25;
        }
        return Bridge.getStatusBarHeight();
    }

    public setAnyModalOpen(open: boolean): void {
        if (!this.checkAvailable()) {
            return;
        }
        Bridge.setAnyModalOpen(open);
    }

    private isStandalone(): boolean {
        const isInWebAppiOS = ((window.navigator as any).standalone === true);
        const isInWebAppChrome = (window.matchMedia('(display-mode: standalone)').matches);
        return isInWebAppiOS || isInWebAppChrome;
    }
}
