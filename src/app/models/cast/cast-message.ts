import {CastDevice} from './cast-device';
import {CastMessageType} from './cast-message-type';

export interface CastMessage {
    messageType: CastMessageType;
    device: CastDevice;
}
