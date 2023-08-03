## XObserver
Eliminates multiple instances of IntersectionObserver in your application and element level unique callbacks easily.


## How does it work?
1. XObserver simply maintains a global repository of the IntersectionObservers your application will use. Each global instance have a unique identifier called scope. Those instances can be ensured to be available by calling the `.ping` method under that particular scope.
2. Unlike the traditional flow, the callback function of the observer is provided at the element level and not the instance level. This allows the application to assign separate callback for each element, This is done by `.subscribe`
3. And yes, there an `.unsubscribe`  method equivalent to the traditional `.unobserve`


## Installation
`yarn add @msc24x/xobserver` 

or 

`npm i @msc24x/xobserver`

## Methods

### ping
`XObserver.ping(scope: string, threshold: number): IntersectionObserver`

Initialize/prepare one IntersectionObserver per given scope. This can be called multiple times, only the first call will create an actual instance. (note: a new scope must be pinged if another threshold is required)


### subscribe
`XObserver.subscribe(scope: string, element: Element, callback: XObserverCallback): void`

Subscribe the element to the observer. Be aware that the callback provided is invoked only for given particular element.
(note: The element must have a unique ID assigned to it)

### unsubscribe
`XObserver.unsubscribe(scope: string, element: Element): void`

Equivalent to calling .unobserve on IntersectionObserver.


## Example (React)
A component that is being animated when in view and being hidden when out of view. The number of actual IntersectionObserver instances, in this case, will remain 2, no matter how many elements of this component is rendered.
```ts
export default function MyComponent(
	props: {id:string}
) {
	const [inView, setInView] = useState(false);
	const ref = useRef<HTMLDivElement>();

	useEffect(() => {
		XObserver.ping("appearance", 0.3);
		XObserver.ping("disappearance", 0);

		const target = ref.current!;

		XObserver.subscribe(
			"disappearance",
			target,
			(entry :IntersectionObserverEntry) => !entry.isIntersecting && setInView(false)
		);
		XObserver.subscribe(
			"appearance",
			target,
			(entry :IntersectionObserverEntry) => entry.isIntersecting && setInView(true)
		);

		return () => {
			XObserver.unsubscribe("appearance", target);
			XObserver.unsubscribe("disappearance", target);
		};
	}, []);

    return <div id={props.id} ref={ref as MutableRefObject<HTMLDivElement>}>In view : {inView}</div>
}
```