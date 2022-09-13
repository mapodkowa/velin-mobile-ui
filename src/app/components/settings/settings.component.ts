import {Component, OnInit} from '@angular/core';
import {faArrowLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {Location} from '@angular/common';
import {SettingsCategory} from '../../models/settings/settings-category';
import {SettingsItems} from '../../models/settings/settings-items';
import {SettingsItem} from '../../models/settings/settings-item';
import {ItemType} from '../../models/settings/settings-item-type';
import {SpotifyService} from '../../providers/spotify/spotify.service';
import {User} from '../../models/spotify/user';
import {BridgeService} from '../../providers/bridge/bridge.service';
import {StorageStats} from '../../models/bridge/storage-stats';
import {FormatBytesPipe} from '../../pipes/format-bytes.pipe';
import {CLEAR_SEARCH_HISTORY_KEY, LOGOUT_KEY, REMOVE_CACHE_KEY, UPDATE_KEY} from '../../models/settings/settings-keys';
import {DialogButtons} from '../../models/bridge/dialog/dialog-buttons';
import {SnackbarService} from '../../providers/snackbar.service';
import {SearchHistoryService} from '../../providers/search/search-history.service';
import {ModalService} from '../../providers/modal.service';
import {Modals} from '../../models/modal/modals';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    constructor(
        private location: Location,
        private spotify: SpotifyService,
        private bridge: BridgeService,
        private snackbar: SnackbarService,
        private history: SearchHistoryService,
        private modal: ModalService
    ) {
    }

    faArrowLeft = faArrowLeft;
    faChevronRight = faChevronRight;

    profile: User;
    items: SettingsCategory[] = [];

    stats: StorageStats;
    otherAppsGraphBar: string;
    mediaGraphBar: string;
    cacheGraphBar: string;

    ngOnInit(): void {
        SettingsItems.categories(this.bridge).then(items => {
            this.items = items;
        });

        this.profile = this.spotify.userProfile;

        this.stats = this.bridge.data.getStats();
        this.otherAppsGraphBar = (this.stats.usedSpace / this.stats.totalSpace * 100) + '%';
        this.mediaGraphBar = (this.stats.mediaSize / this.stats.totalSpace * 100) + '%';
        this.cacheGraphBar = (this.stats.cacheSize / this.stats.totalSpace * 100) + '%';
    }

    onBackClick(): void {
        this.location.back();
    }

    onItemClick(item: SettingsItem): void {
        if (item.type !== ItemType.BUTTON) {
            return;
        }

        switch (item.id) {
            case REMOVE_CACHE_KEY:
                this.bridge.dialog.openDialog('Czy jesteś pewien?',
                    'Czy na pewno chcesz usunąć zawartość pamięci podręcznej?', DialogButtons.Ok_CANCEL).then(result => {
                    if (result.clickedButton === 'OK') {
                        this.bridge.data.clearCache();
                    }
                });
                break;
            case CLEAR_SEARCH_HISTORY_KEY:
                this.history.clear().then(() => {
                    this.snackbar.open('Historia została wyczyszczona');
                });
                break;
            case UPDATE_KEY:
                this.modal.open(Modals.UPDATE);
                break;
            case LOGOUT_KEY:
                this.bridge.dialog.openDialog('Czy na pewno chcesz się wylogować?',
                    '', DialogButtons.Ok_CANCEL).then(result => {
                    if (result.clickedButton === 'OK') {
                        this.history.clear().then(() => {});
                        this.bridge.account.logout();
                    }
                });
                break;
        }
    }

    onItemValueChanged(item: SettingsItem): void {
        console.log('onItemValueChanged()', item);

        switch (item.type) {
            case ItemType.SLIDER:
                this.bridge.data.storeValue(item.id, item.optionValue);
                break;
            case ItemType.SELECT:
                // Input select zapisuje dane jako tekst, wymagana konwersja
                const value = Number.parseInt(item.optionValue as unknown as string, 10);
                this.bridge.data.storeValue(item.id, value);
                break;
            case ItemType.SWITCH:
                this.bridge.data.storeValue(item.id, item.value ? 1 : 0);
                break;
            default:
                console.error('Invalid type = ' + item.type);
                break;
        }
    }

    formatSizeLabel(value: number): string {
        return FormatBytesPipe.formatBytes(value * 1024 * 1024, 1);
    }
}
