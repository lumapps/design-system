type Callback = () => void;

declare function getBasicClass(args: {
    prefix: string;
    type: string;
    value: string | number | boolean | undefined;
}): string;

declare function handleBasicClasses(args: { prefix: string; [prop: string]: any }): string;

declare function detectSwipe(el: Element, cb: (swipeDirection: SwipeDirection) => void): Callback;

declare type SwipeDirection = 'none' | 'up' | 'down' | 'left' | 'right';

declare function onEnterPressed(cb: Callback): (evt: KeyboardEvent | React.KeyboardEvent) => void;

declare function onEscapePressed(cb: Callback): (evt: KeyboardEvent | React.KeyboardEvent) => void;

export { getBasicClass, handleBasicClasses, detectSwipe, onEnterPressed, onEscapePressed, SwipeDirection };
