import React from 'react';

import { Button } from '@lumx/react';
import { act, render, waitFor } from '@testing-library/react';
import {
    findByClassName,
    getByClassName,
    queryAllByTagName,
    queryByClassName,
} from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import userEvent from '@testing-library/user-event';

import { Tooltip, TooltipProps } from './Tooltip';

const CLASSNAME = Tooltip.className as string;

jest.mock('uid', () => ({ uid: () => 'uid' }));

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = async (propsOverride: Partial<TooltipProps> = {}) => {
    const props: any = { forceOpen: true, ...propsOverride };
    // Hack to remove act() warning in console
    await (act as any)(() =>
        Promise.resolve(
            render(
                <Tooltip label="Tooltip" {...props}>
                    {props.children || 'Anchor'}
                </Tooltip>,
            ),
        ),
    );
    const tooltip = queryByClassName(document.body, CLASSNAME);
    const anchorWrapper = queryByClassName(document.body, 'lumx-tooltip-anchor-wrapper');
    return { props, tooltip, anchorWrapper };
};

describe(`<${Tooltip.displayName}>`, () => {
    describe('render', () => {
        it('should not render with empty label', async () => {
            const { tooltip, anchorWrapper } = await setup({
                label: undefined,
                forceOpen: true,
            });
            expect(tooltip).not.toBeInTheDocument();
            expect(anchorWrapper).not.toBeInTheDocument();
        });

        it('should wrap unknown children', async () => {
            const { tooltip, anchorWrapper } = await setup({
                label: 'Tooltip label',
                children: 'Anchor',
                forceOpen: true,
            });
            expect(tooltip).toBeInTheDocument();
            expect(anchorWrapper).toBeInTheDocument();
            expect(anchorWrapper).toHaveAttribute('aria-describedby', tooltip?.id);
        });

        it('should not wrap Button', async () => {
            const { tooltip, anchorWrapper } = await setup({
                label: 'Tooltip label',
                children: <Button>Anchor</Button>,
                forceOpen: true,
            });
            expect(tooltip).toBeInTheDocument();
            expect(anchorWrapper).not.toBeInTheDocument();
            const button = queryByClassName(document.body, Button.className as string);
            expect(button).toHaveAttribute('aria-describedby', tooltip?.id);
        });

        it('should wrap disabled Button', async () => {
            const { tooltip, anchorWrapper } = await setup({
                label: 'Tooltip label',
                children: <Button isDisabled>Anchor</Button>,
                forceOpen: true,
            });
            expect(tooltip).toBeInTheDocument();
            expect(anchorWrapper).toBeInTheDocument();
            expect(anchorWrapper).toHaveAttribute('aria-describedby', tooltip?.id);
            const button = queryByClassName(document.body, Button.className as string);
            expect(button?.parentElement).toBe(anchorWrapper);
        });

        it('should render multiline', async () => {
            const { tooltip } = await setup({
                label: 'First line\nSecond line',
                forceOpen: true,
            });
            expect(tooltip).toBeInTheDocument();
            const lines = queryAllByTagName(tooltip as any, 'p');
            expect(lines.length).toBe(2);
            expect(lines[0]).toHaveTextContent('First line');
            expect(lines[1]).toHaveTextContent('Second line');
        });
    });

    describe('activation', () => {
        it('should activate on anchor hover', async () => {
            let { tooltip } = await setup({
                label: 'Tooltip label',
                children: <Button>Anchor</Button>,
                forceOpen: false,
            });

            expect(tooltip).not.toBeInTheDocument();

            // Hover anchor button
            const button = getByClassName(document.body, Button.className as string);
            await userEvent.hover(button);

            // Tooltip opened
            tooltip = await findByClassName(document.body, CLASSNAME);
            expect(tooltip).toBeInTheDocument();
            expect(button).toHaveAttribute('aria-describedby', tooltip?.id);

            // Un-hover anchor button
            userEvent.unhover(button);
            await waitFor(() => {
                expect(button).not.toHaveFocus();
                // Tooltip closed
                expect(tooltip).not.toBeInTheDocument();
            });
        });

        it('should activate on hover anchor and then tooltip', async () => {
            let { tooltip } = await setup({
                label: 'Tooltip label',
                children: <Button>Anchor</Button>,
                forceOpen: false,
            });

            expect(tooltip).not.toBeInTheDocument();

            // Hover anchor button
            const button = getByClassName(document.body, Button.className as string);
            await userEvent.hover(button);

            // Tooltip opened
            tooltip = await findByClassName(document.body, CLASSNAME);
            expect(tooltip).toBeInTheDocument();
            expect(button).toHaveAttribute('aria-describedby', tooltip?.id);

            // Hover tooltip
            await userEvent.hover(tooltip);
            expect(tooltip).toBeInTheDocument();
            expect(button).toHaveAttribute('aria-describedby', tooltip?.id);

            // Un-hover tooltip
            userEvent.unhover(tooltip);
            await waitFor(() => {
                expect(button).not.toHaveFocus();
                // Tooltip closed
                expect(tooltip).not.toBeInTheDocument();
            });
        });

        it('should activate on anchor focus', async () => {
            let { tooltip } = await setup({
                label: 'Tooltip label',
                children: <Button>Anchor</Button>,
                forceOpen: false,
            });

            expect(tooltip).not.toBeInTheDocument();

            // Focus anchor button
            await userEvent.tab();
            const button = getByClassName(document.body, Button.className as string);
            expect(button).toHaveFocus();

            // Tooltip opened
            tooltip = await findByClassName(document.body, CLASSNAME);
            expect(tooltip).toBeInTheDocument();
            expect(button).toHaveAttribute('aria-describedby', tooltip?.id);

            // Focus next element
            userEvent.tab();
            await waitFor(() => {
                expect(button).not.toHaveFocus();
                // Tooltip closed
                expect(tooltip).not.toBeInTheDocument();
            });
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tooltip',
        forwardAttributes: 'tooltip',
        forwardRef: 'tooltip',
    });
});
