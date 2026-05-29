import { fireEvent, render, screen } from '@testing-library/vue';
import BaseTabTests, { setup } from '@lumx/core/js/components/Tabs/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Tabs/Tab';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Tab } from '.';

describe('<Tab />', () => {
    const renderTab = (props: any, options?: SetupRenderOptions<any>) => render(Tab, { ...options, props });

    // Run core tests
    BaseTabTests({
        render: renderTab,
        screen,
    });

    const setupTab = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderTab, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupTab, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tab',
        forwardAttributes: 'tab',
        forwardRef: 'tab',
    });

    describe('Vue', () => {
        it('should emit focus event when the tab is focused', async () => {
            const { emitted } = render(Tab, { props: { label: 'Tab' } });
            await fireEvent.focus(screen.getByRole('tab'));
            expect(emitted('focus')).toHaveLength(1);
        });

        it('should emit keypress event when a key is pressed on the tab', async () => {
            const { emitted } = render(Tab, { props: { label: 'Tab' } });
            await fireEvent.keyPress(screen.getByRole('tab'));
            expect(emitted('keypress')).toHaveLength(1);
        });
    });
});
