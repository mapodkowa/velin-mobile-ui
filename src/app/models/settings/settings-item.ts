import {ItemType} from './settings-item-type';
import {SelectItem} from './selector-item';

export class SettingsItem {
    id: string;
    title: string;
    subtitle: string;
    hidden?: boolean;
    type: ItemType;

    value?: boolean;
    defaultValue?: boolean;

    optionValue?: number;
    defaultOption?: number;
    options?: SelectItem[];
}
