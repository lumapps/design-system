import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import BaseCardTests, { setup } from '@lumx/core/js/components/Card/Tests';
import { CardProps } from '@lumx/core/js/components/Card';

import { render, screen } from '@testing-library/react';
import { expectTypeOf } from 'vitest';
import { Card, CardProps as ReactCardProps } from './Card';

const CLASSNAME = Card.className as string;

describe(`<${Card.displayName}>`, () => {
    // Adapter for core tests
    const renderCard = (props: CardProps, options?: SetupRenderOptions) => {
        return render(<Card {...props} />, options);
    };

    // Run core tests
    BaseCardTests({ render: renderCard, screen });

    const setupCard = (props: Partial<CardProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderCard, screen });

    describe('React', () => {
        it('should render empty children', () => {
            const { card } = setupCard({ children: null });
            expect(card).toBeInTheDocument();
            expect(card).toBeEmptyDOMElement();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setupCard, {
        baseClassName: CLASSNAME,
        forwardClassName: 'card',
        forwardAttributes: 'card',
        forwardRef: 'card',
    });
});

// ── Type-level tests ──────────────────────────────────────────
describe('Type tests', () => {
    /**
     * Note: `CardProps` extends `GenericProps`, whose `[propName: string]: any` index signature makes
     * *every* key present on the type. So `toHaveProperty` would pass vacuously — these assertions
     * check the resolved property **type** instead, which the index signature does not widen.
     */
    it('should expose anchor prop types with as="a"', () => {
        expectTypeOf<ReactCardProps<'a'>['href']>().toEqualTypeOf<string | undefined>();
        expectTypeOf<ReactCardProps<'a'>['target']>().toEqualTypeOf<React.HTMLAttributeAnchorTarget | undefined>();
    });

    it('should expose button prop types with as="button"', () => {
        expectTypeOf<ReactCardProps<'button'>['type']>().toEqualTypeOf<'button' | 'submit' | 'reset' | undefined>();
    });

    it('should not type anchor props on the default element', () => {
        // `any` (from the GenericProps index signature), not `string` — anchor typing is not applied here
        expectTypeOf<ReactCardProps<'div'>['href']>().toEqualTypeOf<any>();
    });
});
