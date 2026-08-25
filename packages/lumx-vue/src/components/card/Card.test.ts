import { render, screen } from '@testing-library/vue';
import { expectTypeOf } from 'vitest';

import BaseCardTests from '@lumx/core/js/components/Card/Tests';
import { CLASSNAME, CardProps } from '@lumx/core/js/components/Card';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Card } from '.';
import type { CardProps as VueCardProps } from './Card';

describe('<Card />', () => {
    const renderCard = ({ children, ...props }: any, options?: SetupRenderOptions<CardProps>) =>
        render(Card, {
            ...options,
            props,
            slots: children ? { default: children } : undefined,
        });

    BaseCardTests({ render: renderCard, screen });

    const setupCard = (props: Partial<CardProps> = {}, options: SetupRenderOptions<CardProps> = {}) => {
        const result = renderCard(props, options);

        const card = result.container.querySelector(`.${CLASSNAME}`) as HTMLElement;

        return { card, props };
    };

    // Common tests suite.
    commonTestsSuiteVTL(setupCard, {
        baseClassName: CLASSNAME,
        forwardClassName: 'card',
        forwardAttributes: 'card',
    });
});

// ── Type-level tests ──────────────────────────────────────────
// Enforced by `vue-tsc` during `yarn type-check`; no runtime effect here, as the
// Vue vitest config has no `typecheck` block (so `expectTypeOf` is a runtime no-op).
describe('Type tests', () => {
    it('should expose anchor prop types with as="a"', () => {
        expectTypeOf<VueCardProps<'a'>['href']>().toEqualTypeOf<string | undefined>();
        expectTypeOf<VueCardProps<'a'>['target']>().toEqualTypeOf<string | undefined>();
    });

    it('should expose button prop types with as="button"', () => {
        expectTypeOf<VueCardProps<'button'>['type']>().toEqualTypeOf<'button' | 'submit' | 'reset' | undefined>();
    });

    it('should keep its own props on every branch', () => {
        expectTypeOf<VueCardProps<'a'>['elevation']>().toEqualTypeOf<VueCardProps['elevation']>();
    });
});
