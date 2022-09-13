import {DialogButtons} from '../../../models/bridge/dialog/dialog-buttons';
import {DialogResult} from '../../../models/bridge/dialog/dialog-result';
import {BridgeService} from '../bridge.service';

export class DialogInterface {
    private bridge: BridgeService;

    constructor(bridge: BridgeService) {
        this.bridge = bridge;
    }

    public checkAvailable(): boolean {
        return typeof Dialog !== 'undefined';
    }

    public openDialog(title: string, message: string, dialogButtons: DialogButtons): Promise<DialogResult> {
        if (!this.checkAvailable()) {
            return;
        }

        const id = Dialog.openDialog(title, message, dialogButtons);

        return new Promise(resolve => {
            const sub = this.bridge.onMessage.subscribe(msg => {
                if (msg.channel !== 'dialog') {
                    return;
                }

                const result = msg.object as DialogResult;
                if (result.dialogId === id) {
                    sub.unsubscribe();
                    resolve(result);
                }
            });
        });
    }
}
