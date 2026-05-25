// @vitest-environment jsdom
import { describe, expect, it, onTestFinished, vi } from 'vitest';
import { setupFocusTrap, type SetupFocusTrapOptions } from './setupFocusTrap';

const TWO_BUTTONS = '<button id="b1">B1</button><button id="b2">B2</button>';

/** Setup a focus trap and auto-cleanup when the test finishes. */
function trap(options: SetupFocusTrapOptions) {
    const controller = new AbortController();
    setupFocusTrap(options, controller.signal);
    onTestFinished(() => controller.abort());
    return controller;
}

/** Get an element by id from a root, asserting it exists. */
const byId = (root: Document | ShadowRoot, id: string) => root.getElementById(id) as HTMLElement;

/** Dispatch a Tab keydown (composed so it crosses shadow boundaries). */
function tab(target: EventTarget = document.body, { shift = false } = {}) {
    const evt = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: shift,
        bubbles: true,
        composed: true,
        cancelable: true,
    });
    target.dispatchEvent(evt);
    return evt;
}

/** Create a zone in the light DOM. */
function makeLightZone(html = '') {
    document.body.innerHTML = `<div id="zone">${html}</div>`;
    const zone = byId(document, 'zone');
    return { root: document as Document, zone };
}

/** Create a zone inside a shadow root. */
function makeShadowZone(html = '') {
    document.body.innerHTML = '';
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const zone = document.createElement('div');
    zone.innerHTML = html;
    shadow.appendChild(zone);
    return { root: shadow as ShadowRoot, zone };
}

describe(setupFocusTrap.name, () => {
    // Tests that behave identically in light and shadow DOM.
    describe.each([
        ['light DOM', makeLightZone],
        ['shadow DOM', makeShadowZone],
    ])('%s', (_label, makeZone) => {
        it('should focus the first focusable descendant on setup', () => {
            const { root, zone } = makeZone(TWO_BUTTONS);
            trap({ focusZoneElement: zone });
            expect(root.activeElement?.id).toBe('b1');
        });

        it('should focus the explicit focusElement on setup when contained in the zone', () => {
            const { root, zone } = makeZone(TWO_BUTTONS);
            trap({ focusZoneElement: zone, focusElement: byId(root, 'b2') });
            expect(root.activeElement?.id).toBe('b2');
        });

        it('should cycle to first when Tab from last', () => {
            const { root, zone } = makeZone(TWO_BUTTONS);
            trap({ focusZoneElement: zone });
            const b2 = byId(root, 'b2');
            b2.focus();
            const evt = tab(b2);
            expect(evt.defaultPrevented).toBe(true);
            expect(root.activeElement?.id).toBe('b1');
        });

        it('should cycle to last when Shift+Tab from first', () => {
            const { root, zone } = makeZone(TWO_BUTTONS);
            trap({ focusZoneElement: zone });
            const b1 = byId(root, 'b1');
            b1.focus();
            const evt = tab(b1, { shift: true });
            expect(evt.defaultPrevented).toBe(true);
            expect(root.activeElement?.id).toBe('b2');
        });

        it('should fall back to the zone element when no focusable descendant, and clean up tabindex', () => {
            const { root, zone } = makeZone('<p>No focusable</p>');
            const controller = trap({ focusZoneElement: zone });
            expect(root.activeElement).toBe(zone);
            expect(zone.getAttribute('tabindex')).toBe('-1');
            // Cleanup removes the tabindex it added.
            controller.abort();
            expect(zone.hasAttribute('tabindex')).toBe(false);
        });
    });

    // Light-DOM-only edge cases.
    it('should preserve an existing tabindex on the zone', () => {
        const { zone } = makeLightZone('<p>No focusable</p>');
        zone.setAttribute('tabindex', '0');
        const controller = trap({ focusZoneElement: zone });
        expect(document.activeElement).toBe(zone);
        controller.abort();
        expect(zone.getAttribute('tabindex')).toBe('0');
    });

    it('should pin focus on the zone when Tab is pressed with no focusable descendant', () => {
        const { zone } = makeLightZone('<p>No focusable</p>');
        trap({ focusZoneElement: zone });

        // Move focus elsewhere.
        const outside = document.createElement('button');
        document.body.appendChild(outside);
        outside.focus();
        expect(document.activeElement).toBe(outside);

        const evt = tab();
        expect(evt.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(zone);
    });

    it('should bring focus into the zone when Tab is pressed from outside', () => {
        const { zone } = makeLightZone(TWO_BUTTONS);
        const outside = document.createElement('button');
        document.body.appendChild(outside);
        trap({ focusZoneElement: zone });

        outside.focus();
        const evt = tab();
        expect(evt.defaultPrevented).toBe(true);
        expect(document.activeElement?.id).toBe('b1');
    });

    it('should ignore non-Tab keys', () => {
        const { zone } = makeLightZone('<button id="b1">B1</button>');
        trap({ focusZoneElement: zone });

        const evt = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
        document.body.dispatchEvent(evt);
        expect(evt.defaultPrevented).toBe(false);
    });

    it('should be a no-op if signal is already aborted', () => {
        const { zone } = makeLightZone('<button id="b1">B1</button>');
        const controller = new AbortController();
        controller.abort();
        setupFocusTrap({ focusZoneElement: zone }, controller.signal);
        expect(document.activeElement).toBe(document.body);
    });

    it('should disable previous trap and re-enable on teardown (listener tower stacking)', () => {
        const zone1 = document.createElement('div');
        const zone2 = document.createElement('div');
        const b1 = document.createElement('button');
        b1.id = 'b1';
        const b2 = document.createElement('button');
        b2.id = 'b2';
        zone1.appendChild(b1);
        zone2.appendChild(b2);
        document.body.append(zone1, zone2);

        trap({ focusZoneElement: zone1 });
        expect(document.activeElement?.id).toBe('b1');

        const c2 = trap({ focusZoneElement: zone2 });
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
    });

    it('should attach keydown listener to the shadow root, not document, when zone is in shadow DOM', () => {
        const { root, zone } = makeShadowZone('<button id="b1">B1</button>');
        const shadowSpy = vi.spyOn(root, 'addEventListener');
        const docSpy = vi.spyOn(document, 'addEventListener');

        trap({ focusZoneElement: zone });

        expect(shadowSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        expect(docSpy).not.toHaveBeenCalledWith('keydown', expect.any(Function));

        shadowSpy.mockRestore();
        docSpy.mockRestore();
    });
});
