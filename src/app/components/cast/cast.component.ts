import {Component, EventEmitter, HostBinding, OnInit} from '@angular/core';
import {castAnimation} from '../../utils/animation/cast.animation';
import {CastService} from '../../providers/cast/cast.service';
import {faMobileAlt, faTimes, faTv} from '@fortawesome/free-solid-svg-icons';
import {faQuestionCircle} from '@fortawesome/free-regular-svg-icons';
import {CastDevice} from '../../models/cast/cast-device';
import {BridgeService} from '../../providers/bridge/bridge.service';

@Component({
    selector: 'app-cast',
    templateUrl: './cast.component.html',
    styleUrls: ['./cast.component.scss'],
    animations: [castAnimation]
})
export class CastComponent implements OnInit {
    @HostBinding('@castAnimation') castAnimation;
    close: EventEmitter<void>;

    constructor(
        public cast: CastService,
        private bridge: BridgeService
    ) {}

    faTimes = faTimes;
    faQuestionCircle = faQuestionCircle;
    faMobileAlt = faMobileAlt;
    faTv = faTv;

    ngOnInit(): void {

    }

    closeMenu(): void {
        this.close.emit();
    }

    onDeviceClick(device: CastDevice): void {
        if (device.id === this.cast.activeDeviceId) {
            console.log('Selected current device, ignore');
            return;
        }

        if (device.id === this.bridge.cast.phoneId) {
            console.log('Selecting phone as destination');
            this.cast.unSelectDevice();
        } else {
            console.log('Selecting ' + device.name + ' as destination');
            this.cast.selectDevice(device.id);
        }
    }
}
