import {SettingsItem} from './settings-item';

export interface SettingsCategory {
    title: string;
    hidden?: boolean;
    items: SettingsItem[];
}
