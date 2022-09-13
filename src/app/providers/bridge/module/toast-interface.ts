import {ToastDuration} from '../../../models/toast-duration';

export class ToastInterface {

    public checkAvailable(): boolean {
        return typeof Toast !== 'undefined';
    }

    public makeText(text: string, duration: ToastDuration): void {
        if (!this.checkAvailable()) {
            console.log('[Toast] ' + text);
            return;
        }
        Toast.makeText(text, duration);
    }

}
