import {CastDevice} from '../../../models/cast/cast-device';
import {CastDeviceType} from '../../../models/cast/cast-device-type';

export class CastInterface {

    private debugSelectedDevice: string | undefined = undefined;
    private readonly exampleDevicesJson = '[{"description":"Test Device","deviceType":1,' +
        '"id":"com.google.android.gms/.cast.media.CastMediaRouteProviderService:1c0c4f97d0126028e516c596013f9c2d","name":"Test Device"}]';

    public readonly phoneId = 'device:phone';

    public checkAvailable(): boolean {
        return typeof Cast !== 'undefined';
    }

    public getDevices(): CastDevice[] {
        let devices: CastDevice[];

        if (!this.checkAvailable()) {
            devices = JSON.parse(this.exampleDevicesJson);
        } else {
            devices = JSON.parse(Cast.getDevicesJson());
        }

        devices.unshift({
            id: this.phoneId,
            name: 'Ten telefon',
            description: 'Ten telefon',
            deviceType: CastDeviceType.UNKNOWN
        });

        return devices;
    }

    public getActiveDeviceId(): string | undefined {
        if (!this.checkAvailable()) {
            return this.debugSelectedDevice;
        }
        return Cast.getActiveDeviceId();
    }

    public selectDevice(id: string): void {
        if (!this.checkAvailable()) {
            this.debugSelectedDevice = id;
            return;
        }
        Cast.selectDevice(id);
    }

    public unSelectDevice(): void {
        if (!this.checkAvailable()) {
            this.debugSelectedDevice = undefined;
            return;
        }
        Cast.unSelectDevice();
    }

}
