import {EventEmitter, Injectable} from '@angular/core';
import {PostMessage} from '../../models/bridge/post-message';
import {BridgeInterface} from './module/bridge-interface';
import {PlayerInterface} from './module/player-interface';
import {StorageInterface} from './module/storage-interface';
import {AccountInterface} from './module/account-interface';
import {DialogInterface} from './module/dialog-interface';
import {ToastInterface} from './module/toast-interface';
import {ClipboardInterface} from './module/clipboard-interface';
import {CastInterface} from './module/cast-interface';
import {UpdateInterface} from './module/update-interface';

@Injectable({
    providedIn: 'root'
})
export class BridgeService {
    onMessage = new EventEmitter<PostMessage<any>>();

    app: BridgeInterface;
    player: PlayerInterface;
    data: StorageInterface;
    account: AccountInterface;
    dialog: DialogInterface;
    toast: ToastInterface;
    clipboard: ClipboardInterface;
    cast: CastInterface;
    update: UpdateInterface;

    constructor() {
        this.app = new BridgeInterface();
        this.player = new PlayerInterface();
        this.data = new StorageInterface();
        this.account = new AccountInterface();
        this.dialog = new DialogInterface(this);
        this.toast = new ToastInterface();
        this.clipboard = new ClipboardInterface();
        this.cast = new CastInterface();
        this.update = new UpdateInterface();
    }

    public startMessageListener(): void {
        window.addEventListener('message', event => {
            if (event.origin !== 'https://appassets.androidplatform.net') {
                return;
            }

            const json = decodeURIComponent(event.data.replace(/\+/g, ' '));
            const msg: PostMessage<any> = JSON.parse(json);
            this.onMessage.emit(msg);

            // console.log('Received message from native, channel = ' + msg.channel + ', arg =', msg.object);
        }, false);
    }

    public checkAvailable(): boolean {
        return this.app.checkAvailable();
    }
}
