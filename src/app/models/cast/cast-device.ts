import {CastDeviceType} from './cast-device-type';

export interface CastDevice {
    id: string;
    name: string;
    description: string;
    deviceType: CastDeviceType;
}
