import {ExternalUrls} from './external-urls';
import {Image} from './image';

export interface User {
    id: string;
    birthdate: string;
    country: string;
    display_name: string;
    external_urls: ExternalUrls;
    href: string;
    images: Image[];
    product: string;
    type: string;
    uri: string;
}
