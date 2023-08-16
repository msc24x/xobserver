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
    static ping(scope, options = {
        rootMargin: "0px",
        threshold: 0,
    }) {
        const observer = this.getEntry(scope);
        if (observer) {
            return observer.observer;
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
        return newObserver;
    }
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
