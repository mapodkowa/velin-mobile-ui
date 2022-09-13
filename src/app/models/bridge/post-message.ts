export interface PostMessage<T> {
    channel: string;
    object: T;
}
