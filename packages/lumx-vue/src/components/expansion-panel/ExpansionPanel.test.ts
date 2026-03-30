import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import BaseExpansionPanelTests, { setup } from '@lumx/core/js/components/ExpansionPanel/Tests';
import { CLASSNAME } from '@lumx/core/js/components/ExpansionPanel';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { ExpansionPanel } from '.';

describe('<ExpansionPanel />', () => {
    const renderPanel = ({ children, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(ExpansionPanel, {
            ...options,
            props: {
                toggleButtonProps: { label: 'Toggle' },
                ...props,
            },
            slots: children ? { default: children } : undefined,
        });

    BaseExpansionPanelTests({ render: renderPanel, screen });

    const setupPanel = (propsOverride: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(propsOverride, { ...options, render: renderPanel, screen });

    describe('Vue', () => {
        it('should emit toggle-open when toggle button is clicked', async () => {
            const { getByRole, emitted } = render(ExpansionPanel, {
                props: { toggleButtonProps: { label: 'Toggle' }, label: 'Panel' },
            });
            const button = getByRole('button', { name: /Toggle/i });

            await userEvent.click(button);

            const events = emitted('toggleOpen');
            expect(events).toHaveLength(1);
            expect((events as any)?.[0][0]).toBe(true);
        });

        it('should emit open when opening', async () => {
            const { getByRole, emitted } = render(ExpansionPanel, {
                props: { toggleButtonProps: { label: 'Toggle' }, isOpen: false },
            });
            const button = getByRole('button', { name: /Toggle/i });

            await userEvent.click(button);

            expect(emitted('open')).toHaveLength(1);
            expect(emitted('close')).toBeFalsy();
        });

        it('should emit close when closing', async () => {
            const { getByRole, emitted } = render(ExpansionPanel, {
                props: { toggleButtonProps: { label: 'Toggle' }, isOpen: true },
            });
            const button = getByRole('button', { name: /Toggle/i });

            await userEvent.click(button);

            expect(emitted('close')).toHaveLength(1);
            expect(emitted('open')).toBeFalsy();
        });
    });

    commonTestsSuiteVTL(setupPanel, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        applyTheme: {
            affects: [{ element: 'element' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
