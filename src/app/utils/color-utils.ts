export class ColorUtils {
    public static convertHexToRGBA(hexCode, opacity): string {
        let hex = hexCode.replace('#', '');

        if (hex.length === 3) {
            hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
        }

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return `rgba(${r},${g},${b},${opacity})`;
    }

    public static transitionColors(startColor: string, endColor: string, duration: number, callback: (color: string) => void): number {
        const start = {
            r: parseInt('0x' + startColor.substring(1, 3), 16),
            g: parseInt('0x' + startColor.substring(3, 5), 16),
            b: parseInt('0x' + startColor.substring(5, 7), 16),
        };
        const end = {
            r: parseInt('0x' + endColor.substring(1, 3), 16),
            g: parseInt('0x' + endColor.substring(3, 5), 16),
            b: parseInt('0x' + endColor.substring(5, 7), 16),
        };

        const interval = 10;
        const steps = duration / interval;
        const step = 1.0 / steps;
        let u = 0.0;

        if (start.r === end.r && start.g === end.g && start.b === end.b) {
            callback(startColor);
            return;
        }

        const loop = setInterval(() => {
            if (u >= 1.0) {
                clearInterval(loop);
                callback(endColor);
            }

            const r = Math.round(ColorUtils.lerpColor(start.r, end.r, u));
            const g = Math.round(ColorUtils.lerpColor(start.g, end.g, u));
            const b = Math.round(ColorUtils.lerpColor(start.b, end.b, u));

            const color = ColorUtils.rgbToHex(r, g, b);
            callback(color);

            u += step;
        }, interval);

        return loop;
    }

    public static lerpColor(a, b, u): number {
        return (1 - u) * a + u * b;
    }

    public static rgbToHex(r, g, b): string {
        return '#' + ColorUtils.componentToHex(r) + ColorUtils.componentToHex(g) + ColorUtils.componentToHex(b);
    }

    private static componentToHex(c: number): string {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
}
