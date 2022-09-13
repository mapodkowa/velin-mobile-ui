export class RandomUtils {

    // Returns an integer random number between min (included) and max (included)
    public static randomInteger(min, max): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Or any random number between min (included) and max (not included)
    public static randomNumber(min, max): number {
        return Math.random() * (max - min) + min;
    }
}
