// @vitest-environment jsdom
import { isFocusWithin } from './isFocusWithin';

describe(isFocusWithin.name, () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should return false for a missing element', () => {
        expect(isFocusWithin(null)).toBe(false);
        expect(isFocusWithin(undefined)).toBe(false);
    });

    it('should return true when a descendant has the focus', () => {
        document.body.innerHTML = '<div id="zone"><button>Inside</button></div><button>Outside</button>';
        const zone = document.getElementById('zone');
        document.querySelector<HTMLButtonElement>('#zone button')?.focus();
        expect(isFocusWithin(zone)).toBe(true);
    });

    it('should return true when the element itself has the focus', () => {
        document.body.innerHTML = '<div id="zone" tabindex="-1"></div>';
        const zone = document.getElementById('zone');
        zone?.focus();
        expect(isFocusWithin(zone)).toBe(true);
    });

    it('should return false when the focus is outside', () => {
        document.body.innerHTML = '<div id="zone"><button>Inside</button></div><button id="outside">Outside</button>';
        const zone = document.getElementById('zone');
        document.getElementById('outside')?.focus();
        expect(isFocusWithin(zone)).toBe(false);
    });

    it('should return true when a descendant has the focus inside a shadow root', () => {
        const host = document.createElement('div');
        document.body.appendChild(host);
        const shadowRoot = host.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = '<div id="zone"><button>Inside</button></div>';
        const zone = shadowRoot.getElementById('zone');
        shadowRoot.querySelector('button')?.focus();
        expect(isFocusWithin(zone)).toBe(true);
    });
});
