type XObserverCallback = (entry: IntersectionObserverEntry) => void;
type XObserverSubscription = {
    callback?: XObserverCallback;
};
type XObserverEntry = {
    observer: IntersectionObserver;
    subscribers: Map<string, XObserverSubscription>;
    defCallback?: XObserverCallback;
};
export declare class XObserver {
    static xObservers: Map<string, XObserverEntry>;
    static getSubscriptionByKey(key: string, scope: string): XObserverSubscription | null;
    static getEntry(scope: string): XObserverEntry | null;
    /**
     * Application must call this method to ensure the existence of a particular scope
     * @param scope Unique Identifier for a particular use case of IntersectionObserver
     * @param options They are the {@link IntersectionObserverInit} options
     * @returns void
     */
    static ping(scope: string, options?: IntersectionObserverInit, defCallback?: XObserverCallback): void;
    /**
     * Use this static method to subscribe an element to a particular scope.
     * @param scope Unique Identifier for a particular use case of IntersectionObserver
     * @param element The element to observe
     * @param callback Callback ({@link XObserverCallback}) when the element intersects
     * @returns void
     */
    static subscribe(scope: string, element: Element, callback?: XObserverCallback): void;
    /**
     * Use this when an element is no longer required to be observed.
     *
     * Note: it is recommended to use this method since the XObserver will not destroy the underlying
     * IntersectionObserver instance if the elements are still connected to it.
     * @param scope Unique Identifier for a particular use case of IntersectionObserver
     * @param element The element to disconnect from the IntersectionObserver instance
     * @returns void
     */
    static unsubscribe(scope: string, element: Element): void;
}
export {};
