import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar} from '@angular/material/snack-bar';
import {PlayerService} from './player.service';
import {ModalService} from './modal.service';
import {Modals} from '../models/modal/modals';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    constructor(
        private snackbar: MatSnackBar,
        private player: PlayerService,
        private modal: ModalService
    ) {
    }

    public open(text: string, action?: string, duration = 3000): MatSnackBarRef<TextOnlySnackBar> {
        let panelClass = 'snackbar-margin-nav';

        if (this.player.playerState !== undefined && this.player.playerState.track !== undefined) {
            panelClass = 'snackbar-margin-nav-player';
        }

        if (this.modal.isOpen(Modals.PLAYER)) {
            panelClass = undefined;
        }

        const snackBarOptions: MatSnackBarConfig = {
            panelClass,
            duration
        };

        return this.snackbar.open(text, action, snackBarOptions);
    }
}
