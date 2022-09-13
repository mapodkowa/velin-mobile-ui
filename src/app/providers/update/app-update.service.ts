import {Injectable} from '@angular/core';
import {BridgeService} from '../bridge/bridge.service';
import {UpdateInfo} from '../../models/update/update-info';
import {SnackbarService} from '../snackbar.service';
import {ModalService} from '../modal.service';
import {Modals} from '../../models/modal/modals';

@Injectable({
    providedIn: 'root'
})
export class AppUpdateService {

    constructor(
        private bridge: BridgeService,
        private snackbar: SnackbarService,
        private modal: ModalService
    ) {}

    latestVersion: UpdateInfo;
    checkInterval?: number;

    public checkForUpdate(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = undefined;
        }

        this.checkInterval = setInterval(() => {
            this.latestVersion = this.bridge.update.getLatestVersion();
            if (this.latestVersion) {
                clearInterval(this.checkInterval);
                console.log('Update check finished, latest version =', this.latestVersion);

                if (this.latestVersion.updateAvailable) {
                    this.notifyUpdateAvailable();
                }
            }
        }, 3000);
    }

    private notifyUpdateAvailable(): void {
        const ref = this.snackbar.open('Dostępna nowa wersja aplikacji', 'Szczegóły');
        ref.onAction().subscribe(() => {
            this.openUpdatePage();
        });
    }

    private openUpdatePage(): void {
        this.modal.open(Modals.UPDATE);
    }
}
