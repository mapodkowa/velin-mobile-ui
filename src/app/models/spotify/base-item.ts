import {Image} from './image';
import {ExternalUrls} from './external-urls';

export interface BaseItem {
    id: string;
    name: string;
    images: Image[];
    href: string;
    uri: string;
    external_urls: ExternalUrls;
}
