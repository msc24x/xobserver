export class XObserver {
    static getSubscriptionByKey(key, scope) {
        const entry = this.xObservers.get(scope);
        if (!(entry === null || entry === void 0 ? void 0 : entry.subscribers))
            return null;
        for (const sub of entry.subscribers) {
            if (sub.key === key) {
                return sub;
            }
        }
        return null;
    }
    static getEntry(scope) {
        if (this.xObservers.has(scope)) {
            return this.xObservers.get(scope);
        }
        return null;
    }
    /**
     * Application must call this method to ensure the existence of a particular scope
     * @param scope Unique Identifier for a particular use case of IntersectionObserver
     * @param options They are the {@link IntersectionObserverInit} options
     * @returns void
     */
    static ping(scope, options = {
        rootMargin: "0px",
        threshold: 0,
    }) {
        const observer = this.getEntry(scope);
        if (observer) {
            return;
        }
        const newObserver = new IntersectionObserver((entries) => {
            for (let entry of entries) {
                const sub = this.getSubscriptionByKey(entry.target.id, scope);
                sub === null || sub === void 0 ? void 0 : sub.callback(entry);
            }
        }, options = options);
        this.xObservers.set(scope, {
            observer: newObserver,
            subscribers: [],
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
        const observer = this.getEntry(scope);
        if (!observer)
            return;
        if (!element.id) {
            console.error("[XObserver] subscriber element must have a unique id on it");
            return;
        }
        if (this.getSubscriptionByKey(element.id, scope)) {
            return;
        }
        observer.observer.observe(element);
        observer.subscribers.push({
            key: element.id,
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
        const subscription = this.getSubscriptionByKey(element.id, scope);
        if (!subscription) {
            return;
        }
        observerEntry.observer.unobserve(element);
        const subscriptionIndex = observerEntry.subscribers.indexOf(subscription);
        observerEntry.subscribers.splice(subscriptionIndex, 1);
        if (observerEntry.subscribers.length == 0) {
            observerEntry.observer.disconnect();
            this.xObservers.delete("scope");
        }
        return;
    }
}
XObserver.xObservers = new Map();
