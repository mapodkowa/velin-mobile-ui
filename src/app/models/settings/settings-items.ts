import {SettingsCategory} from './settings-category';
import {ItemType} from './settings-item-type';
import {
    APP_VERSION_KEY,
    CACHE_FILES_KEY,
    CLEAR_SEARCH_HISTORY_KEY,
    DOWNLOAD_MOBILE_NETWORK_KEY,
    LOGOUT_KEY,
    OFFLINE_MODE_KEY,
    QUALITY_DOWNLOAD_KEY,
    QUALITY_STREAMING_KEY,
    REMOVE_CACHE_KEY,
    SAVE_TRANSFER_KEY,
    STORAGE_CHART_KEY,
    UPDATE_KEY
} from './settings-keys';
import {AppConfig} from '../../../environments/environment';
import {BridgeService} from '../../providers/bridge/bridge.service';

const items: SettingsCategory[] = [
    {
        title: 'Oszczędzanie danych',
        items: [
            {
                id: SAVE_TRANSFER_KEY,
                title: 'Ogranicz zużycie danych',
                subtitle: 'Ustawia jakość muzyki na niską i wyłącza wyświetlanie większości grafik',
                type: ItemType.SWITCH,
                defaultValue: false
            }
        ]
    },
    {
        title: 'Odtwarzanie',
        hidden: true,
        items: [
            {
                id: OFFLINE_MODE_KEY,
                title: 'Tryb Offline',
                subtitle: 'Kiedy przejdziesz do trybu offline, będzie możliwe odtwarzanie tylko pobranych utworów',
                type: ItemType.SWITCH,
                defaultValue: false
            }
        ]
    },
    {
        title: 'Jakość muzyki',
        items: [
            {
                id: QUALITY_STREAMING_KEY,
                title: 'Streaming',
                subtitle: 'Wyższa jakość zużywa więcej danych',
                type: ItemType.SELECT,
                defaultOption: 3,
                options: [
                    {title: 'Niska', value: 1},
                    {title: 'Normalna', value: 2},
                    {title: 'Wysoka', value: 3},
                    // {title: 'Bardzo wysoka', value: 4}
                ]
            },
            {
                id: QUALITY_DOWNLOAD_KEY,
                title: 'Pobieranie',
                subtitle: 'Wyższa jakość zużywa więcej miejsca',
                type: ItemType.SELECT,
                defaultOption: 3,
                options: [
                    {title: 'Niska', value: 1},
                    {title: 'Normalna', value: 2},
                    {title: 'Wysoka', value: 3},
                    // {title: 'Bardzo wysoka', value: 4}
                ]
            },
            {
                id: DOWNLOAD_MOBILE_NETWORK_KEY,
                title: 'Pobieraj używając danych komórkowych',
                subtitle: 'Włączenie może wiązać się z naliczeniem dodatkowych opłat za transfer danych',
                type: ItemType.SWITCH,
                defaultValue: false
            }
        ]
    }, {
        title: 'Pamięć',
        items: [
            {
                id: STORAGE_CHART_KEY,
                title: '',
                subtitle: '',
                type: ItemType.STORAGE
            },
            {
                id: CACHE_FILES_KEY,
                title: 'Rozmiar pamięci podręcznej',
                subtitle: 'Zwiększenie ilości pamięci podręcznej może zmniejszyć zużycie Internetu',
                type: ItemType.SLIDER,
                defaultOption: 512
            },
            {
                id: REMOVE_CACHE_KEY,
                title: 'Usuń pamięć podręczną',
                subtitle: 'Możesz zwolnić miejsce na dysku przez usunięcie pamięci podręcznej',
                type: ItemType.BUTTON
            },
            {
                id: CLEAR_SEARCH_HISTORY_KEY,
                title: 'Wyczyść historię wyszukiwań',
                subtitle: 'Ostatnio wyszukane pozycje zostaną usunięte i nie mogą zostać odzyskane',
                type: ItemType.BUTTON
            }
        ]
    }, {
        title: 'O aplikacji',
        items: [
            {
                id: APP_VERSION_KEY,
                title: 'Wersja',
                subtitle: '0.0.1-SNAPSHOT (abc1234)',
                type: ItemType.TEXT
            },
            {
                id: UPDATE_KEY,
                title: 'Brak dostępnych aktualizacji',
                subtitle: '',
                type: ItemType.BUTTON
            }
        ]
    }, {
        title: 'Inne',
        items: [
            {
                id: LOGOUT_KEY,
                title: 'Wyloguj się',
                subtitle: 'Aktualnie zalogowano jako [nazwa użytkownika]',
                type: ItemType.BUTTON
            }
        ]
    }
];

export class SettingsItems {
    public static async categories(bridge: BridgeService): Promise<SettingsCategory[]> {
        const temp: SettingsCategory[] = JSON.parse(JSON.stringify(items)); // Deep clone array

        // Remove hidden items on production build
        if (AppConfig.production) {
            for (let i = temp.length - 1; i >= 0; i--) {
                if (temp[i].hidden) {
                    temp.splice(i, 1);
                } else {
                    const categoryItems = temp[i].items;
                    for (let j = categoryItems.length - 1; j >= 0; j--) {
                        if (categoryItems[j].hidden) {
                            categoryItems.splice(j, 1);
                        }
                    }
                }
            }
        }

        for (const category of temp) {
            for (const item of category.items) {
                switch (item.id) {
                    case APP_VERSION_KEY:
                        item.subtitle = bridge.app.getAppVersion();
                        continue;
                    case UPDATE_KEY:
                        const info = bridge.update.getLatestVersion();
                        if (info) {
                            if (info.updateAvailable) {
                                item.title = 'Dostępna nowa wersja aplikacji';
                                item.subtitle = 'Kliknij aby uzyskać szczegółowe informacje o nowej wersji';
                            } else {
                                item.subtitle = 'Najnowsza wersja to ' + info.name + '-RELEASE';
                            }
                        } else {
                            item.subtitle = 'Sprawdzanie dostępności aktualizacji...';
                        }
                        continue;
                    case LOGOUT_KEY:
                        item.subtitle = 'Aktualnie zalogowano jako ' + bridge.account.getUserProfile().display_name;
                        continue;
                }

                switch (item.type) {
                    case ItemType.SLIDER:
                    case ItemType.SELECT:
                        if (bridge.data.checkAvailable()) {
                            item.optionValue = await bridge.data.getNumberValue(item.id);
                        } else {
                            item.optionValue = item.defaultOption;
                        }
                        break;
                    case ItemType.SWITCH:
                        if (bridge.data.checkAvailable()) {
                            item.value = await bridge.data.getBooleanValue(item.id);
                        } else {
                            item.value = item.defaultValue;
                        }
                        break;
                }
            }
        }

        return temp;
    }
}
