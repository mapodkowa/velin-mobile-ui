import {IconDefinition} from '@fortawesome/fontawesome-common-types';

export interface ContextMenuItem {
    id: string;
    icon: IconDefinition;
    iconSize?: string;
    title: string;
}
