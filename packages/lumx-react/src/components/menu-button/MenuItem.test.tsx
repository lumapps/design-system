import { render, screen } from '@testing-library/react';
import { expectTypeOf } from 'vitest';

import { menuItemTests as BaseMenuItemTests } from '@lumx/core/js/components/Menu/MenuItemTests';
import { CLASSNAME } from '@lumx/core/js/components/Menu/MenuItem';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';

import { MenuProvider } from './MenuProvider';
import { MenuItem, MenuItemActionProps } from './MenuItem';

function renderMenuItem(props: any, options?: SetupRenderOptions) {
    return render(
        <MenuProvider>
            <MenuItem {...props} />
        </MenuProvider>,
        options,
    );
}

describe(`<${MenuItem.displayName}>`, () => {
    // ── Shared behavioral suite (core) ─────────────────────────
    BaseMenuItemTests({
        render: ({ handleClick, children, ...props }: any, options?: SetupRenderOptions) =>
            renderMenuItem({ ...props, onClick: handleClick, children }, options),
        screen,
    });

    // ── commonTestsSuiteRTL ────────────────────────────────────
    const setupCommon = (propsOverride: Record<string, any> = {}, options?: SetupRenderOptions) => {
        const props: any = { children: 'Item', ...propsOverride };
        const { container } = renderMenuItem(props, options);
        const element = getByClassName(document.body, CLASSNAME);
        return { props, container, element };
    };

    commonTestsSuiteRTL(setupCommon, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        forwardRef: 'element',
    });

    // ── afterIcon ──────────────────────────────────────────────
    it('should render afterIcon', () => {
        renderMenuItem({ children: 'Item', afterIcon: 'test-icon' });
        expect(getByClassName(document.body, 'lumx-icon')).toBeInTheDocument();
    });
});

// ── Type-level tests ──────────────────────────────────────────
describe('Type tests', () => {
    it('actionProps with a custom component picks up its props', () => {
        interface RouterLink {
            to: string;
        }
        expectTypeOf<MenuItemActionProps<React.ComponentType<RouterLink>>>().toMatchTypeOf<{ to: string }>();
    });

    it('actionProps with as="a" exposes anchor-specific props', () => {
        expectTypeOf<MenuItemActionProps<'a'>>().toHaveProperty('href');
        expectTypeOf<MenuItemActionProps<'a'>>().toHaveProperty('download');
    });

    it('actionProps with as="button" exposes button-specific props', () => {
        expectTypeOf<MenuItemActionProps<'button'>>().toHaveProperty('type');
    });
});
