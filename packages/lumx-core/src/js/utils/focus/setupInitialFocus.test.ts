// @vitest-environment jsdom
import { describe, expect, it, onTestFinished } from 'vitest';
import { setupInitialFocus, type SetupInitialFocusOptions } from './setupInitialFocus';

/** Setup the initial focus and auto-cleanup when the test finishes. */
function initialFocus(options: SetupInitialFocusOptions) {
    const controller = new AbortController();
    setupInitialFocus(options, controller.signal);
    onTestFinished(() => controller.abort());
    return controller;
}

/** Create a zone element in the body with the given HTML content. */
function createZone(html: string) {
    const zone = document.createElement('div');
    zone.innerHTML = html;
    document.body.appendChild(zone);
    onTestFinished(() => zone.remove());
    return zone;
}

describe(setupInitialFocus.name, () => {
    it('should focus the given focus element', () => {
        const zone = createZone('<button id="b1">B1</button><button id="b2">B2</button>');
        const b2 = zone.querySelector<HTMLElement>('#b2');
        initialFocus({ focusZoneElement: zone, focusElement: b2 });
        expect(b2).toHaveFocus();
    });

    it('should ignore a focus element outside the zone and focus the first focusable', () => {
        const zone = createZone('<button id="b1">B1</button>');
        const outside = createZone('<button id="outside">Outside</button>').querySelector<HTMLElement>('button');
        initialFocus({ focusZoneElement: zone, focusElement: outside });
        expect(zone.querySelector('#b1')).toHaveFocus();
    });

    it('should focus the first focusable descendant', () => {
        const zone = createZone('<span>Text</span><button id="b1">B1</button><button id="b2">B2</button>');
        initialFocus({ focusZoneElement: zone });
        expect(zone.querySelector('#b1')).toHaveFocus();
    });

    it('should focus the zone itself when it has no focusable descendant, and remove the added tabindex on abort', () => {
        const zone = createZone('<span>Text</span>');
        const controller = initialFocus({ focusZoneElement: zone });
        expect(zone).toHaveFocus();
        expect(zone).toHaveAttribute('tabindex', '-1');

        controller.abort();
        expect(zone).not.toHaveAttribute('tabindex');
    });

    it('should keep an existing tabindex on abort', () => {
        const zone = createZone('<span>Text</span>');
        zone.setAttribute('tabindex', '0');
        const controller = initialFocus({ focusZoneElement: zone });
        expect(zone).toHaveFocus();

        controller.abort();
        expect(zone).toHaveAttribute('tabindex', '0');
    });

    it('should do nothing when the signal is already aborted', () => {
        const zone = createZone('<button id="b1">B1</button>');
        const controller = new AbortController();
        controller.abort();
        setupInitialFocus({ focusZoneElement: zone }, controller.signal);
        expect(zone.querySelector('#b1')).not.toHaveFocus();
    });
});
