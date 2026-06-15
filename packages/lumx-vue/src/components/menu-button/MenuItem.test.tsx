import { render, screen } from '@testing-library/vue';

import { CLASSNAME } from '@lumx/core/js/components/Menu/MenuItem';
import { menuItemTests as BaseMenuItemTests } from '@lumx/core/js/components/Menu/MenuItemTests';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';
import { getByClassName } from '@lumx/core/testing/queries';

import MenuProvider from './MenuProvider';
import MenuItem from './MenuItem';

function renderMenuItem(props_: any, options?: SetupRenderOptions<any>) {
    const { children, handleClick, ...rest } = props_;
    const vueProps = { ...rest, onClick: handleClick };
    return render(MenuProvider as any, {
        ...(options || {}),
        slots: {
            default: () => <MenuItem {...vueProps}>{children}</MenuItem>,
        },
    });
}

describe('<MenuItem />', () => {
    // Run core tests
    BaseMenuItemTests({ render: renderMenuItem, screen });

    // Common tests suite
    const setupCommon = (props: any = {}, options: SetupRenderOptions<any> = {}) => {
        const { container } = renderMenuItem({ children: 'Item', ...props }, options);
        const element = getByClassName(document.body, CLASSNAME);
        return { props, container, element };
    };

    commonTestsSuiteVTL(setupCommon, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
    });

    // ── afterIcon ──────────────────────────────────────────────
    it('should render afterIcon', () => {
        renderMenuItem({ children: 'Item', afterIcon: 'test-icon' });
        expect(getByClassName(document.body, 'lumx-icon')).toBeInTheDocument();
    });
});
