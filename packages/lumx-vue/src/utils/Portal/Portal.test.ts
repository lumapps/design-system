import { describe, it, expect } from 'vitest';
import { h } from 'vue';
import { render, screen } from '@testing-library/vue';
import BasePortalTests from '@lumx/core/js/utils/Portal/Tests';
import type { PortalInit } from '@lumx/core/js/utils/Portal';
import { Portal } from './Portal';
import { PortalProvider } from './PortalProvider';

const TEST_ID = 'portal-child';
const PortalChild = () => h('div', { 'data-testid': TEST_ID }, 'Hello from portal');

const PORTAL_CONTAINER_ID = 'portal-container';

describe('Portal', () => {
    // Run shared core tests
    BasePortalTests({
        screen,
        renderPortal({ enabled, portalInit, wrapInDiv }) {
            const components: Record<string, any> = { Portal, PortalChild };
            if (portalInit) {
                components.PortalProvider = PortalProvider;
            }

            let template = '<Portal';
            if (enabled === false) {
                template += ' :enabled="false"';
            }
            template += '><PortalChild /></Portal>';

            if (portalInit) {
                template = `<PortalProvider :value="portalInit">${template}</PortalProvider>`;
            }

            if (wrapInDiv) {
                template = `<div id="wrapper">${template}</div>`;
            }

            return render({
                template,
                components,
                setup() {
                    return { portalInit };
                },
            });
        },
    });

    // Vue-specific tests
    describe('Vue', () => {
        it('should support string selector for container', () => {
            const portalContainer = document.createElement('div');
            portalContainer.id = PORTAL_CONTAINER_ID;
            document.body.appendChild(portalContainer);

            const getContainer: PortalInit = () => ({ container: `#${PORTAL_CONTAINER_ID}` });

            render({
                template: '<PortalProvider :value="getContainer"><Portal><PortalChild /></Portal></PortalProvider>',
                components: { PortalProvider, Portal, PortalChild },
                setup() {
                    return { getContainer };
                },
            });

            const child = screen.getByTestId(TEST_ID);
            expect(child.parentElement).toBe(portalContainer);
            portalContainer.remove();
        });
    });
});
