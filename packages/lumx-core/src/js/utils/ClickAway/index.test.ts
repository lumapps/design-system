// @vitest-environment jsdom
import { type Mock, vi } from 'vitest';

import { setupClickAway } from './index';

/** A 400x300 panel with a 1px border and a 15px vertical scrollbar, as measured in Chrome. */
const SCROLLER_GEOMETRY = {
    clientLeft: 1,
    clientTop: 1,
    clientWidth: 383,
    clientHeight: 298,
    scrollWidth: 383,
    scrollHeight: 1012,
};

describe(setupClickAway.name, () => {
    let teardown: (() => void) | undefined;
    let callback: Mock<EventListener>;
    let scroller: HTMLElement;
    let popover: HTMLElement;

    beforeEach(() => {
        // jsdom runs no layout, so every geometry value the guard reads has to be stubbed.
        scroller = document.createElement('section');
        Object.entries(SCROLLER_GEOMETRY).forEach(([property, value]) =>
            Object.defineProperty(scroller, property, { value, configurable: true }),
        );
        scroller.getBoundingClientRect = () => new DOMRect(16, 16, 400, 300);
        // jsdom does not expand the `overflow` shorthand in `getComputedStyle`.
        scroller.style.overflowX = 'auto';
        scroller.style.overflowY = 'auto';

        popover = document.createElement('div');
        scroller.appendChild(popover);
        document.body.appendChild(scroller);

        callback = vi.fn<EventListener>();
        teardown = setupClickAway(() => [popover], callback);
    });

    afterEach(() => {
        teardown?.();
        scroller.remove();
    });

    const press = (target: HTMLElement, clientX: number, clientY: number) =>
        target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX, clientY }));

    it('should call the callback on a press outside the elements', () => {
        press(scroller, 216, 266);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not call the callback on a press inside the elements', () => {
        press(popover, 216, 266);

        expect(callback).not.toHaveBeenCalled();
    });

    it('should not call the callback on a press in the scrollbar gutter of an ancestor', () => {
        press(scroller, 407, 266);

        expect(callback).not.toHaveBeenCalled();
    });

    it('should call the callback on a touch outside the elements', () => {
        scroller.dispatchEvent(new Event('touchstart', { bubbles: true }));

        expect(callback).toHaveBeenCalledTimes(1);
    });
});
