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
    static ping(scope, threshold) {
        const observer = this.getEntry(scope);
        if (observer) {
            if (observer.threshold !== threshold)
                console.warn(`[XObserver] scope '${scope}' uses the readonly threshold ${observer.threshold}, to use a different threshold a new scope must be pinged`);
            return observer.observer;
        }
        const newObserver = new IntersectionObserver((entries) => {
            for (let entry of entries) {
                const sub = this.getSubscriptionByKey(entry.target.id, scope);
                sub === null || sub === void 0 ? void 0 : sub.callback(entry);
            }
        }, {
            threshold: threshold
        });
        this.xObservers.set(scope, {
            observer: newObserver,
            subscribers: [],
            threshold: threshold
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
