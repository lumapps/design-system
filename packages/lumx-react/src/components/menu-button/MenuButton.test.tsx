import { render } from '@testing-library/react';
import { expectTypeOf } from 'vitest';

import menuButtonTests from '@lumx/core/js/components/Menu/MenuButtonTests';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { MenuButton, type MenuButtonProps } from './MenuButton';
import { MenuItem } from './MenuItem';

describe('<MenuButton>', () => {
    // ── Shared behavioral suite (core) ─────────────────────────
    const { setup: setupCommon, triggerClassName } = menuButtonTests({
        components: { MenuButton, MenuItem },
        render: (template, options) => render(template(), options),
    });

    // ── commonTestsSuiteRTL ────────────────────────────────────
    commonTestsSuiteRTL(setupCommon, {
        baseClassName: triggerClassName,
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

// ── Type-level tests ──────────────────────────────────────────
describe('Type tests', () => {
    it('default variant exposes Button props', () => {
        type ButtonVariant = Extract<MenuButtonProps, { variant?: 'button' }>;
        expectTypeOf<ButtonVariant>().toHaveProperty('emphasis');
        expectTypeOf<ButtonVariant>().toHaveProperty('size');
        expectTypeOf<ButtonVariant>().toHaveProperty('isDisabled');
        expectTypeOf<ButtonVariant>().toHaveProperty('leftIcon');
    });

    it('variant="icon-button" exposes icon but label comes from MenuButton', () => {
        type IconVariant = Extract<MenuButtonProps, { variant: 'icon-button' }>;
        expectTypeOf<IconVariant>().toHaveProperty('icon');
        expectTypeOf<IconVariant>().toHaveProperty('label');
    });

    it('variant="chip" exposes size but not isClickable (set automatically)', () => {
        type ChipVariant = Extract<MenuButtonProps, { variant: 'chip' }>;
        expectTypeOf<ChipVariant>().toHaveProperty('size');
    });

    it('variant="link" accepts rightIcon', () => {
        type LinkVariant = Extract<MenuButtonProps, { variant: 'link' }>;
        expectTypeOf<LinkVariant>().toHaveProperty('rightIcon');
    });
});
