import React from 'react';
import { render, screen } from '@testing-library/react';
import { Portal } from './Portal';

const TEST_ID = 'portal-child';
const PortalChild = () => <div data-testid={TEST_ID}>Hello from portal</div>;

describe(Portal, () => {
    it('should render portal content in document.body by default', () => {
        render(
            <Portal>
                <PortalChild />
            </Portal>,
        );

        const child = screen.getByTestId(TEST_ID);
        expect(child.parentElement).toBe(document.body);
    });

    it('should render inline when enabled is false', () => {
        const { container } = render(
            <div id="wrapper">
                <Portal enabled={false}>
                    <PortalChild />
                </Portal>
            </div>,
        );

        const child = screen.getByTestId(TEST_ID);
        expect(child.parentElement).toBe(container.querySelector('#wrapper'));
    });
});
