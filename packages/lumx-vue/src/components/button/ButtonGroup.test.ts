import { h } from 'vue';
import { render } from '@testing-library/vue';
import { mdiPlus } from '@lumx/icons';

import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { ButtonGroup, ButtonGroupProps, Button } from '.';

const CLASSNAME = ButtonGroup.className as string;

describe(`<ButtonGroup>`, () => {
    const renderComponent = (
        props: ButtonGroupProps & { children?: any },
        options: SetupRenderOptions<ButtonGroupProps> = {},
    ) => {
        const { children, ...restProps } = props;
        return render(ButtonGroup, {
            props: restProps,
            slots: children ? { default: () => children } : undefined,
            ...options,
        });
    };

    const setup = (
        propsOverride: Partial<ButtonGroupProps> = {},
        options: SetupRenderOptions<ButtonGroupProps> = {},
    ) => {
        const props = {
            children: [h(Button, () => 'Label'), h(Button, { rightIcon: mdiPlus, 'aria-label': 'Add' })],
            ...propsOverride,
        };

        const view = renderComponent(props as any, options);
        const buttonGroup = view.container.querySelector(`.${CLASSNAME}`);

        return { props, buttonGroup, ...view };
    };

    describe('Props', () => {
        it('should render children', () => {
            const { buttonGroup } = setup();
            expect(buttonGroup).toHaveTextContent('Label');
        });
    });

    // Common tests suite.
    commonTestsSuiteVTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'buttonGroup',
        forwardAttributes: 'buttonGroup',
    });
});
