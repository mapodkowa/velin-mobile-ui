export class StringUtils {
    public static formatString(text: string, ...format: any[]): string {
        return format.reduce((p, c) => p.replace(/%s/, c), text);
    }
}
