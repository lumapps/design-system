// @vitest-environment jsdom
import { isScrollbarPress } from './isScrollbarPress';

interface Geometry {
    /** Border box position in viewport coordinates. */
    left?: number;
    top?: number;
    /** Distance from the border edge to the padding edge, scrollbar included. */
    clientLeft?: number;
    clientTop?: number;
    clientWidth: number;
    clientHeight: number;
    scrollWidth: number;
    scrollHeight: number;
    /** Border box size in layout pixels. Defaults to the client box. */
    offsetWidth?: number;
    offsetHeight?: number;
    /** Scale a CSS transform applies to the border box on screen. */
    scale?: number;
    /** Computed `overflow`, which decides whether the overflow renders a scrollbar. */
    overflow?: string;
}

/** jsdom runs no layout, so every geometry value the guard reads has to be stubbed. */
function stubGeometry(
    element: HTMLElement,
    { left = 0, top = 0, clientLeft = 0, clientTop = 0, scale = 1, overflow = 'auto', ...geometry }: Geometry,
) {
    const box = {
        offsetWidth: geometry.clientWidth,
        offsetHeight: geometry.clientHeight,
        ...geometry,
    };
    const rect = new DOMRect(left, top, box.offsetWidth * scale, box.offsetHeight * scale);
    Object.entries({ clientLeft, clientTop, ...box, getBoundingClientRect: () => rect }).forEach(([property, value]) =>
        Object.defineProperty(element, property, { value, configurable: true }),
    );
    // jsdom does not expand the `overflow` shorthand in `getComputedStyle`, so set both longhands.
    element.setAttribute('style', `overflow-x: ${overflow}; overflow-y: ${overflow}`);
    return element;
}

const stubElement = (geometry: Geometry) => stubGeometry(document.createElement('div'), geometry);

const press = (clientX: number, clientY: number) => new MouseEvent('mousedown', { clientX, clientY });

/** A 400x300 panel with a 1px border and a 15px vertical scrollbar, as measured in Chrome. */
const VERTICAL_SCROLLER: Geometry = {
    left: 16,
    top: 16,
    clientLeft: 1,
    clientTop: 1,
    clientWidth: 383,
    clientHeight: 298,
    offsetWidth: 400,
    offsetHeight: 300,
    scrollWidth: 383,
    scrollHeight: 1012,
};

describe(isScrollbarPress.name, () => {
    describe('vertical scrollbar', () => {
        it('should detect a press in the right gutter', () => {
            expect(isScrollbarPress(press(407, 266), stubElement(VERTICAL_SCROLLER))).toBe(true);
        });

        it('should ignore a press inside the client box', () => {
            expect(isScrollbarPress(press(216, 266), stubElement(VERTICAL_SCROLLER))).toBe(false);
        });

        it('should ignore a press on the last pixel column of the client box', () => {
            expect(isScrollbarPress(press(400, 266), stubElement(VERTICAL_SCROLLER))).toBe(false);
        });

        it('should detect a press in the left gutter of a right-to-left layout', () => {
            // A left-hand scrollbar sits between the border edge and the padding edge, so `clientLeft`
            // covers the 1px border plus the 15px scrollbar.
            const element = stubElement({ ...VERTICAL_SCROLLER, left: 1184, clientLeft: 16 });
            expect(isScrollbarPress(press(1192, 266), element)).toBe(true);
        });
    });

    describe('horizontal scrollbar', () => {
        /** A 400px wide panel with a 1px border and a 15px horizontal scrollbar. */
        const HORIZONTAL_SCROLLER: Geometry = {
            left: 16,
            top: 16,
            clientLeft: 1,
            clientTop: 1,
            clientWidth: 398,
            clientHeight: 76,
            scrollWidth: 1216,
            scrollHeight: 76,
        };

        it('should detect a press in the bottom gutter', () => {
            expect(isScrollbarPress(press(316, 100), stubElement(HORIZONTAL_SCROLLER))).toBe(true);
        });

        it('should ignore a press inside the client box', () => {
            expect(isScrollbarPress(press(316, 60), stubElement(HORIZONTAL_SCROLLER))).toBe(false);
        });

        it('should ignore a press below an element that overflows only vertically', () => {
            // A vertical scrollbar shows up on the X axis. Crossing the axes makes the guard useless.
            expect(isScrollbarPress(press(216, 330), stubElement(VERTICAL_SCROLLER))).toBe(false);
        });
    });

    describe('element without a scrollbar', () => {
        /** A 200x120 block with a 12px border and no overflow. */
        const NON_SCROLLER: Geometry = {
            left: 720,
            top: 16,
            clientLeft: 12,
            clientTop: 12,
            clientWidth: 176,
            clientHeight: 96,
            scrollWidth: 176,
            scrollHeight: 96,
        };

        it('should ignore a press on the border', () => {
            expect(isScrollbarPress(press(909, 76), stubElement(NON_SCROLLER))).toBe(false);
        });

        it('should ignore a press below the border', () => {
            expect(isScrollbarPress(press(800, 130), stubElement(NON_SCROLLER))).toBe(false);
        });

        it('should ignore a press on the border of a clipped element', () => {
            // `overflow: hidden` reports content beyond the client box but renders nothing to press,
            // and a bordered block of truncated text is a common shape.
            const clipped = stubElement({ ...NON_SCROLLER, scrollHeight: 480, overflow: 'hidden' });
            expect(isScrollbarPress(press(909, 76), clipped)).toBe(false);
        });

        it('should ignore a press on the border of an element with visible overflow', () => {
            const visible = stubElement({ ...NON_SCROLLER, scrollHeight: 480, overflow: 'visible' });
            expect(isScrollbarPress(press(909, 76), visible)).toBe(false);
        });

        it('should detect a press on the always-on scrollbar of a scroll element', () => {
            const scroller = stubElement({ ...NON_SCROLLER, scrollHeight: 480, overflow: 'scroll' });
            expect(isScrollbarPress(press(909, 76), scroller)).toBe(true);
        });
    });

    describe('scaled ancestor', () => {
        /** A 300x200 panel with a 1px border and a 15px scrollbar, under `scale(1.5)`. */
        const SCALED_SCROLLER: Geometry = {
            left: 16,
            top: 16,
            clientLeft: 1,
            clientTop: 1,
            clientWidth: 283,
            clientHeight: 198,
            offsetWidth: 300,
            offsetHeight: 200,
            scrollWidth: 283,
            scrollHeight: 772,
            scale: 1.5,
        };

        it('should detect a press in the gutter', () => {
            expect(isScrollbarPress(press(453, 280), stubElement(SCALED_SCROLLER))).toBe(true);
        });

        it('should ignore a press in the padding, near the client box edge', () => {
            // `getBoundingClientRect` is scaled while `clientWidth` is not, so an unscaled press
            // reads as 419 against a client box of 283 and swallows a real dismissal.
            expect(isScrollbarPress(press(436, 280), stubElement(SCALED_SCROLLER))).toBe(false);
        });
    });

    describe('root element', () => {
        /** A 1600x1000 viewport with a 15px root scrollbar, scrolled down by 1400px. */
        const ROOT: Geometry = {
            top: -1400,
            clientWidth: 1585,
            clientHeight: 985,
            scrollWidth: 4056,
            scrollHeight: 2612,
            // The root hands its overflow to the viewport, which reports `visible` while scrolling.
            overflow: 'visible',
        };

        it('should detect a press on the root scrollbar', () => {
            expect(isScrollbarPress(press(1592, 400), stubGeometry(document.documentElement, ROOT))).toBe(true);
        });

        it('should ignore a press inside a scrolled root element', () => {
            // The root element scrolls the viewport, so its border box moves out of view. Measuring
            // against that box reads every press below the fold as a press in the bottom gutter.
            expect(isScrollbarPress(press(20, 500), stubGeometry(document.documentElement, ROOT))).toBe(false);
        });
    });

    describe('presses that carry no scrollbar geometry', () => {
        it('should ignore a touch press', () => {
            expect(isScrollbarPress(new Event('touchstart'), stubElement(VERTICAL_SCROLLER))).toBe(false);
        });

        it('should ignore a target that is not an element', () => {
            expect(isScrollbarPress(press(407, 266), document)).toBe(false);
        });

        it('should ignore a null target', () => {
            expect(isScrollbarPress(press(407, 266), null)).toBe(false);
        });

        it('should ignore a target with no client box', () => {
            const detached = stubElement({ clientWidth: 0, clientHeight: 0, scrollWidth: 0, scrollHeight: 200 });
            expect(isScrollbarPress(press(-5, 10), detached)).toBe(false);
        });
    });
});
