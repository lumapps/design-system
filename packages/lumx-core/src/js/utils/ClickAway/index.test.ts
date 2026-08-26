// @vitest-environment jsdom
import { type Mock, vi } from 'vitest';

import { setupClickAway } from './index';

describe(setupClickAway.name, () => {
    let teardown: (() => void) | undefined;
    let callback: Mock<EventListener>;
    let outside: HTMLElement;
    let popover: HTMLElement;

    beforeEach(() => {
        outside = document.createElement('section');
        popover = document.createElement('div');
        document.body.append(outside, popover);

        callback = vi.fn<EventListener>();
        teardown = setupClickAway(() => [popover], callback);
    });

    afterEach(() => {
        teardown?.();
        outside.remove();
        popover.remove();
    });

    it('should call the callback on a click outside the elements', () => {
        outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not call the callback on a click inside the elements', () => {
        popover.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(callback).not.toHaveBeenCalled();
    });

    it('should call the callback on a click whose propagation is stopped', () => {
        // The listener runs in the capture phase, so an app-level handler cannot prevent dismissal.
        outside.addEventListener('click', (event) => event.stopPropagation());

        outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should call the callback on a touch outside the elements', () => {
        outside.dispatchEvent(new Event('touchstart', { bubbles: true }));

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should stop listening after teardown', () => {
        teardown?.();

        outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(callback).not.toHaveBeenCalled();
    });
});
