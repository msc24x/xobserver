type XObserverCallback = (entry: IntersectionObserverEntry) => void;

type XObserverSubscription = {
	key: string;
	callback: Function;
};

type XObserverEntry = {
	observer: IntersectionObserver;
	subscribers: XObserverSubscription[];
};


export class XObserver {
	static xObservers = new Map<string, XObserverEntry>();

	static getSubscriptionByKey(key: string, scope: string) {
		const entry = this.xObservers.get(scope);

		if (!entry?.subscribers) return null;

		for (const sub of entry.subscribers) {
			if (sub.key === key) {
				return sub;
			}
		}

		return null;
	}

	static getEntry(scope: string) {
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
  	public static ping(scope: string, options: IntersectionObserverInit = {
        rootMargin: "0px",
        threshold: 0,
    }) {

		const observer = this.getEntry(scope);
		if (observer) {
			return;
		}

		const newObserver = new IntersectionObserver(
			(entries) => {
				for (let entry of entries) {
					const sub = this.getSubscriptionByKey(entry.target.id, scope);
					sub?.callback(entry);
				}
			},
			options = options
		);

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
	public static subscribe(
		scope: string,
		element: Element,
		callback: XObserverCallback
	) {
		const observer = this.getEntry(scope);
		if (!observer) return;

		if (!element.id) {
			console.error(
				"[XObserver] subscriber element must have a unique id on it"
			);
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
	public static unsubscribe(scope: string, element: Element) {
		const observerEntry = this.getEntry(scope);
		if (!observerEntry) return;

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
