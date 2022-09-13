import {EventEmitter, Injectable} from '@angular/core';
import {BridgeService} from '../bridge/bridge.service';
import {CastMessage} from '../../models/cast/cast-message';
import {CastDevice} from '../../models/cast/cast-device';
import {CastMessageType} from '../../models/cast/cast-message-type';

@Injectable({
    providedIn: 'root'
})
export class CastService {
    onMessage = new EventEmitter<CastMessage>();
    devices: CastDevice[] = [];
    activeDeviceId: string;

    constructor(
        private bridge: BridgeService
    ) {
        this.devices = this.bridge.cast.getDevices();
        this.activeDeviceId = this.getActiveDeviceId();

        this.bridge.onMessage.subscribe(msg => {
            if (msg.channel === 'cast') {
                this.handleMessage(msg.object);
                this.onMessage.emit(msg.object);

                console.log('Received message from cast, channel = ' + msg.channel + ', arg =', msg.object);
            }
        });
    }

    private handleMessage(msg: CastMessage): void {
        switch (msg.messageType) {
            case CastMessageType.DEVICE_ADDED:
                this.devices = this.bridge.cast.getDevices();
                break;
            case CastMessageType.DEVICE_REMOVED:
                this.devices = this.bridge.cast.getDevices();
                break;
            case CastMessageType.DEVICE_SELECTED:
                this.activeDeviceId = msg.device.id;
                break;
            case CastMessageType.DEViCE_UNSELECTED:
                this.activeDeviceId = this.bridge.cast.phoneId;
                break;
            default:
                console.error('Unknown cast message type = ' + msg.messageType);
                break;
        }
    }

    public getDevices(): CastDevice[] {
        return this.devices;
    }

    public getActiveDeviceId(): string {
        const id = this.bridge.cast.getActiveDeviceId();

        if (!id) {
            return this.bridge.cast.phoneId;
        }

        return id;
    }

    public selectDevice(id: string): void {
        if (!this.bridge.cast.checkAvailable()) {
            this.activeDeviceId = id;
            this.onMessage.emit({
                messageType: CastMessageType.DEVICE_SELECTED, device: this.devices[1]});
        }

        this.bridge.cast.selectDevice(id);
    }

    public unSelectDevice(): void {
        if (!this.bridge.cast.checkAvailable()) {
            this.activeDeviceId = this.bridge.cast.phoneId;
            this.onMessage.emit({messageType: CastMessageType.DEViCE_UNSELECTED, device: undefined});
        }

        this.bridge.cast.unSelectDevice();
    }
}
