## XObserver
XObserver eliminates the usage of multiple instances of IntersectionObserver, by providing a scope based initialization of single IntersectionObsever and a few methods to intract with it.

## Methods

### XObserver.ping(scope: string, threshold: number): IntersectionObserver
Initialize/prepare one IntersectionObserver as long as the scope is same.


### XObserver.subscribe(scope: string, element: Element, callback: XObserverCallback): void
Equivalent to calling .observe on IntersectionObserver


### XObserver.unsubscribe(scope: string, element: Element): void
Equivalent to calling .unobserve on IntersectionObserver.
