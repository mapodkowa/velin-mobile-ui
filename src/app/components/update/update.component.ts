import {Component, EventEmitter, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {AppUpdateService} from '../../providers/update/app-update.service';
import {castAnimation} from '../../utils/animation/cast.animation';
import {BridgeService} from '../../providers/bridge/bridge.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss'],
    animations: [castAnimation]
})
export class UpdateComponent implements OnInit, OnDestroy {
    @HostBinding('@castAnimation') castAnimation;
    close: EventEmitter<void>;

    constructor(
        public update: AppUpdateService,
        private bridge: BridgeService
    ) {
    }

    faTimes = faTimes;
    statusButton = 'Pobierz';
    buttonDisabled = false;
    buttonState = 0; // 0 - download, 1 - downloading, 2 - install, 3 - installing, 4 - download failed

    messageSubscription: Subscription;

    ngOnInit(): void {
        this.messageSubscription = this.bridge.onMessage.subscribe(msg => {
            if (msg.channel !== 'update') {
                return;
            }
            this.updateProgress(msg.object);
        });
    }

    buttonClick(): void {
        switch (this.buttonState) {
            case 0:
                this.updateState(1);
                this.bridge.update.downloadUpdateFile();
                break;
            case 2:
                this.updateState(3);
                this.bridge.update.installUpdate();
                break;
            default:
                console.error('Invalid button state');
                break;
        }
    }

    private updateProgress(progress: number): void {
        if (progress === 100) {
            this.updateState(2);
            return;
        }

        if (progress === -1) {
            this.updateState(4);
            return;
        }

        if (this.buttonState !== 1) {
            this.updateState(1);
        }

        this.statusButton = 'Pobieranie: ' + progress + '%';
    }

    private updateState(state: number): void {
        this.buttonState = state;

        switch (state) {
            case 0:
                this.buttonDisabled = false;
                this.statusButton = 'Pobierz';
                break;
            case 1:
                this.buttonDisabled = true;
                this.statusButton = 'Pobieranie: 0%';
                break;
            case 2:
                this.buttonDisabled = false;
                this.statusButton = 'Zainstaluj';
                break;
            case 3:
                this.buttonDisabled = true;
                this.statusButton = 'Instalowanie...';
                break;
            case 4:
                this.buttonDisabled = true;
                this.statusButton = 'Wystąpił błąd';
                break;
        }
    }

    closeMenu(): void {
        this.close.emit();
    }

    ngOnDestroy(): void {
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }
    }

}
