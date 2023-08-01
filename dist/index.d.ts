type XObserverCallback = (entry: IntersectionObserverEntry) => void;
type XObserverSubscription = {
    key: string;
    callback: Function;
};
type XObserverEntry = {
    observer: IntersectionObserver;
    threshold: number;
    subscribers: XObserverSubscription[];
};
export declare class XObserver {
    static xObservers: Map<string, XObserverEntry>;
    static getSubscriptionByKey(key: string, scope: string): XObserverSubscription | null;
    static getEntry(scope: string): XObserverEntry | null | undefined;
    static ping(scope: string, threshold: number): IntersectionObserver;
    static subscribe(scope: string, element: Element, callback: XObserverCallback): void;
    static unsubscribe(scope: string, element: Element): void;
}
export {};
