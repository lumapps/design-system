import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectTypeOf } from 'vitest';

import menuButtonTests from '@lumx/core/js/components/Menu/MenuButtonTests';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { CLASSNAME as MENU_TRIGGER_CLASSNAME } from '@lumx/core/js/components/Menu/MenuTrigger';
import { mdiDotsVertical } from '@lumx/icons';

import { IconButton } from '../button';
import { Chip } from '../chip';
import { Link } from '../link';

import { MenuButton, type MenuButtonProps } from './MenuButton';
import { MenuItem } from './MenuItem';

describe('<MenuButton>', () => {
    // ── Shared behavioral suite (core) ─────────────────────────
    menuButtonTests({
        components: { MenuButton, MenuItem },
        render: (template) => render(template()),
    });

    // ── Polymorphic trigger (React-specific `as` prop) ─────────
    describe('polymorphic trigger', () => {
        it('renders as IconButton when as={IconButton}', () => {
            render(
                <MenuButton as={IconButton} icon={mdiDotsVertical} label="More">
                    <MenuItem>First</MenuItem>
                </MenuButton>,
            );
            const trigger = screen.getByRole('button', { name: 'More' });
            expect(trigger).toHaveAttribute('aria-haspopup', 'true');
            expect(trigger.querySelector('svg')).toBeTruthy();
        });

        it('renders as Chip and opens on click', async () => {
            render(
                <MenuButton as={Chip} label="Filters" isClickable>
                    <MenuItem>All</MenuItem>
                </MenuButton>,
            );
            const trigger = screen.getByText('Filters').closest('a') as HTMLElement;
            expect(trigger).toHaveAttribute('aria-haspopup', 'true');
            trigger.focus();
            await userEvent.keyboard('{Enter}');
            await screen.findByLabelText('Filters');
        });
    });

    // ── commonTestsSuiteRTL ────────────────────────────────────
    const setupCommon = (propsOverride: Record<string, any> = {}, options?: SetupRenderOptions) => {
        const props: any = { label: 'Open menu', ...propsOverride };
        const { container } = render(
            <MenuButton {...props}>
                <MenuItem>First</MenuItem>
            </MenuButton>,
            options,
        );
        const element = getByClassName(document.body, MENU_TRIGGER_CLASSNAME);
        return { props, container, element };
    };

    commonTestsSuiteRTL(setupCommon, {
        baseClassName: MENU_TRIGGER_CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        forwardRef: 'element',
        applyTheme: {
            affects: [{ element: 'element' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});

// ── Type-level tests ──────────────────────────────────────────
describe('Type tests', () => {
    it('default trigger exposes Button props', () => {
        expectTypeOf<MenuButtonProps>().toHaveProperty('emphasis');
        expectTypeOf<MenuButtonProps>().toHaveProperty('size');
        expectTypeOf<MenuButtonProps>().toHaveProperty('isDisabled');
        expectTypeOf<MenuButtonProps>().toHaveProperty('leftIcon');
    });

    it('as={IconButton} exposes icon but label comes from MenuButton', () => {
        expectTypeOf<MenuButtonProps<typeof IconButton>>().toHaveProperty('icon');
        // label is MenuButton's own prop (from core UIProps), not IconButton's
        expectTypeOf<MenuButtonProps<typeof IconButton>>().toHaveProperty('label');
    });

    it('as={Chip} exposes isClickable and size', () => {
        expectTypeOf<MenuButtonProps<typeof Chip>>().toHaveProperty('isClickable');
        expectTypeOf<MenuButtonProps<typeof Chip>>().toHaveProperty('size');
    });

    it('as={Link} accepts href and rightIcon', () => {
        expectTypeOf<MenuButtonProps<typeof Link>>().toHaveProperty('href');
        expectTypeOf<MenuButtonProps<typeof Link>>().toHaveProperty('rightIcon');
    });

    it('strips GenericProps index signature', () => {
        type HasIndexSignature<T> = string extends keyof T ? true : false;
        expectTypeOf<HasIndexSignature<MenuButtonProps>>().toEqualTypeOf<false>();
        expectTypeOf<HasIndexSignature<MenuButtonProps<typeof IconButton>>>().toEqualTypeOf<false>();
        expectTypeOf<HasIndexSignature<MenuButtonProps<typeof Chip>>>().toEqualTypeOf<false>();
    });
});
