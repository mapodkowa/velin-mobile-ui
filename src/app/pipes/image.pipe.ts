import {Pipe, PipeTransform} from '@angular/core';
import {Image} from '../models/spotify/image';
import {ImageSize} from '../models/image-size';
import {BridgeService} from '../providers/bridge/bridge.service';

@Pipe({
    name: 'image'
})
export class ImagePipe implements PipeTransform {
    private static readonly URL = 'https://image.androidplatform.net/';

    constructor(
        private bridge: BridgeService
    ) {}

    public static getImage(images: Image[], imageSize?: ImageSize): Image {
        if (images.length === 1) {
            return images[0];
        }

        const sortedImages = images.sort((a, b) => {
            return (a.width - b.width) !== 0 ? (a.width - b.width) : (b.height - a.height);
        });

        switch (imageSize){
            case ImageSize.BIG:
                return sortedImages[sortedImages.length - 1];
            case ImageSize.MEDIUM:
                return sortedImages[Math.round(sortedImages.length / 2) - 1];
            case ImageSize.SMALL:
                return sortedImages[0];
            default:
                return sortedImages[0];
        }
    }

    public static urlToBridge(url: string): string {
        return ImagePipe.URL + btoa(url)
            .replace('+', '-')
            .replace('/', '_')
            .replace(/=+$/, '');
    }

    transform(value: Image[], imageSize?: ImageSize): string {
        if (value.length === 0) {
            return 'assets/img/empty2.png';
        }

        const image = ImagePipe.getImage(value, imageSize);
        return this.toBridge(image.url);
    }

    private toBridge(url: string): string {
        if (this.bridge.checkAvailable()) {
            return ImagePipe.urlToBridge(url);
        }

        return url;
    }
}
