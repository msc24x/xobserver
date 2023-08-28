export class XObserver {
    static getSubscriptionByKey(key, scope) {
        const entry = this.xObservers.get(scope);
        if (!(entry === null || entry === void 0 ? void 0 : entry.subscribers))
            return null;
        return entry.subscribers.get(key) || null;
    }
    static getEntry(scope) {
        return this.xObservers.get(scope) || null;
    }
    /**
     * Application must call this method to ensure the existence of a particular scope
     * @param scope Unique Identifier for a particular use case of IntersectionObserver
     * @param options They are the {@link IntersectionObserverInit} options
     * @returns void
     */
    static ping(scope, options, defCallback) {
        if (this.xObservers.has(scope)) {
            return;
        }
        options !== null && options !== void 0 ? options : (options = {});
        const newObserver = new IntersectionObserver((entries) => {
            const observerEntry = this.getEntry(scope);
            for (const entry of entries) {
                const subscription = observerEntry.subscribers.get(entry.target.id);
                const callback = subscription.callback || (observerEntry === null || observerEntry === void 0 ? void 0 : observerEntry.defCallback);
                if (callback)
                    callback(entry);
                else
                    console.warn(`[XObserver] No callback found for element '${entry.target.id}'`);
            }
        }, options = options);
        this.xObservers.set(scope, {
            observer: newObserver,
            subscribers: new Map(),
            defCallback: defCallback
        });
        return;
    }
    /**
     * Use this static method to subscribe an element to a particular scope.
     * @param scope Unique Identifier for a particular use case of IntersectionObserver
     * @param element The element to observe
     * @param callback Callback ({@link XObserverCallback}) when the element intersects
     * @returns void
     */
    static subscribe(scope, element, callback) {
        if (!element.id) {
            console.error("[XObserver] subscriber element must have a unique id on it");
            return;
        }
        const observerEntry = this.getEntry(scope);
        if (!observerEntry)
            return;
        if (observerEntry.subscribers.has(element.id)) {
            return;
        }
        observerEntry.observer.observe(element);
        observerEntry.subscribers.set(element.id, {
            callback: callback
        });
        return;
    }
    /**
     * Use this when an element is no longer required to be observed.
     *
     * Note: it is recommended to use this method since the XObserver will not destroy the underlying
     * IntersectionObserver instance if the elements are still connected to it.
     * @param scope Unique Identifier for a particular use case of IntersectionObserver
     * @param element The element to disconnect from the IntersectionObserver instance
     * @returns void
     */
    static unsubscribe(scope, element) {
        const observerEntry = this.getEntry(scope);
        if (!observerEntry)
            return;
        observerEntry.observer.unobserve(element);
        observerEntry.subscribers.delete(element.id);
        if (observerEntry.subscribers.size == 0) {
            observerEntry.observer.disconnect();
            this.xObservers.delete(scope);
        }
        return;
    }
}
XObserver.xObservers = new Map();
