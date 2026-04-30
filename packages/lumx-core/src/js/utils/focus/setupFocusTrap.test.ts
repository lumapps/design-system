// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { setupFocusTrap } from './setupFocusTrap';

function makeZone(html = '') {
    document.body.innerHTML = `<div id="zone">${html}</div>`;
    return document.getElementById('zone') as HTMLElement;
}

function tab({ shift = false } = {}) {
    const evt = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: shift, bubbles: true, cancelable: true });
    document.body.dispatchEvent(evt);
    return evt;
}

describe(setupFocusTrap.name, () => {
    it('should focus the first focusable descendant on setup', () => {
        const zone = makeZone('<button id="b1">B1</button><button id="b2">B2</button>');
        const controller = new AbortController();
        setupFocusTrap({ focusZoneElement: zone }, controller.signal);
        expect(document.activeElement?.id).toBe('b1');
        controller.abort();
    });

    it('should focus the explicit focusElement on setup when contained in the zone', () => {
        const zone = makeZone('<button id="b1">B1</button><button id="b2">B2</button>');
        const focusElement = document.getElementById('b2') as HTMLElement;
        const controller = new AbortController();
        setupFocusTrap({ focusZoneElement: zone, focusElement }, controller.signal);
        expect(document.activeElement?.id).toBe('b2');
        controller.abort();
    });

    describe('fallback when no focusable descendant', () => {
        it('should focus the zone itself and add tabindex="-1" if needed', () => {
            const zone = makeZone('<p>No focusable</p>');
            const controller = new AbortController();
            setupFocusTrap({ focusZoneElement: zone }, controller.signal);
            expect(document.activeElement).toBe(zone);
            expect(zone.getAttribute('tabindex')).toBe('-1');
            controller.abort();
            // Cleanup removes the tabindex it added.
            expect(zone.hasAttribute('tabindex')).toBe(false);
        });

        it('should preserve an existing tabindex on the zone', () => {
            const zone = makeZone('<p>No focusable</p>');
            zone.setAttribute('tabindex', '0');
            const controller = new AbortController();
            setupFocusTrap({ focusZoneElement: zone }, controller.signal);
            expect(document.activeElement).toBe(zone);
            controller.abort();
            // Original tabindex preserved.
            expect(zone.getAttribute('tabindex')).toBe('0');
        });

        it('should pin focus on the zone when Tab is pressed with no focusable descendant', () => {
            const zone = makeZone('<p>No focusable</p>');
            const controller = new AbortController();
            setupFocusTrap({ focusZoneElement: zone }, controller.signal);

            // Move focus elsewhere.
            const outside = document.createElement('button');
            document.body.appendChild(outside);
            outside.focus();
            expect(document.activeElement).toBe(outside);

            const evt = tab();
            expect(evt.defaultPrevented).toBe(true);
            expect(document.activeElement).toBe(zone);

            controller.abort();
        });
    });

    describe('Tab cycling', () => {
        it('should cycle to first when Tab from last', () => {
            const zone = makeZone('<button id="b1">B1</button><button id="b2">B2</button>');
            const controller = new AbortController();
            setupFocusTrap({ focusZoneElement: zone }, controller.signal);

            (document.getElementById('b2') as HTMLElement).focus();
            const evt = tab();
            expect(evt.defaultPrevented).toBe(true);
            expect(document.activeElement?.id).toBe('b1');
            controller.abort();
        });

        it('should cycle to last when Shift+Tab from first', () => {
            const zone = makeZone('<button id="b1">B1</button><button id="b2">B2</button>');
            const controller = new AbortController();
            setupFocusTrap({ focusZoneElement: zone }, controller.signal);

            (document.getElementById('b1') as HTMLElement).focus();
            const evt = tab({ shift: true });
            expect(evt.defaultPrevented).toBe(true);
            expect(document.activeElement?.id).toBe('b2');
            controller.abort();
        });

        it('should bring focus into the zone when Tab is pressed from outside', () => {
            const zone = makeZone('<button id="b1">B1</button><button id="b2">B2</button>');
            const outside = document.createElement('button');
            document.body.appendChild(outside);

            const controller = new AbortController();
            setupFocusTrap({ focusZoneElement: zone }, controller.signal);

            outside.focus();
            const evt = tab();
            expect(evt.defaultPrevented).toBe(true);
            expect(document.activeElement?.id).toBe('b1');
            controller.abort();
        });

        it('should ignore non-Tab keys', () => {
            const zone = makeZone('<button id="b1">B1</button>');
            const controller = new AbortController();
            setupFocusTrap({ focusZoneElement: zone }, controller.signal);

            const evt = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
            document.body.dispatchEvent(evt);
            expect(evt.defaultPrevented).toBe(false);
            controller.abort();
        });
    });

    describe('listener tower stacking', () => {
        it('should disable previous trap and re-enable on teardown', () => {
            const zone1 = document.createElement('div');
            const zone2 = document.createElement('div');
            const b1 = document.createElement('button');
            b1.id = 'b1';
            const b2 = document.createElement('button');
            b2.id = 'b2';
            zone1.appendChild(b1);
            zone2.appendChild(b2);
            document.body.append(zone1, zone2);

            const c1 = new AbortController();
            setupFocusTrap({ focusZoneElement: zone1 }, c1.signal);
            expect(document.activeElement?.id).toBe('b1');

            const c2 = new AbortController();
            setupFocusTrap({ focusZoneElement: zone2 }, c2.signal);
            expect(document.activeElement?.id).toBe('b2');

            // Tab is now trapped in zone2.
            b2.focus();
            tab();
            expect(document.activeElement?.id).toBe('b2');

            // Tear down zone2 — zone1 trap re-enables.
            c2.abort();
            b1.focus();
            tab();
            expect(document.activeElement?.id).toBe('b1');

            c1.abort();
        });
    });

    it('should be a no-op if signal is already aborted', () => {
        const zone = makeZone('<button id="b1">B1</button>');
        const before = document.activeElement;
        const controller = new AbortController();
        controller.abort();
        setupFocusTrap({ focusZoneElement: zone }, controller.signal);
        expect(document.activeElement).toBe(before);
    });

    it('should remove the keydown listener on teardown', () => {
        const zone = makeZone('<button id="b1">B1</button>');
        const controller = new AbortController();
        setupFocusTrap({ focusZoneElement: zone }, controller.signal);

        const removeSpy = vi.spyOn(document.body, 'removeEventListener');
        controller.abort();
        expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        removeSpy.mockRestore();
    });
});
