import { defineComponent } from 'vue';
import { render } from '@testing-library/vue';
import { expectTypeOf } from 'vitest';

import type { HasRequiredLinkHref } from '@lumx/core/js/types';
import type { ListboxOptionActionProps } from '../components/listbox/ListboxOptionAction';

import { ClassValue, keysOf, VueToJSXProps } from './VueToJSX';

interface ProbeProps {
    label?: string;
    isOpen?: boolean;
    'aria-disabled'?: boolean | 'true' | 'false';
}

const props = keysOf<ProbeProps>()('label', ['isOpen', Boolean], ['aria-disabled', Boolean, String]);

const resolveProps = (template: string) => {
    let resolved: Record<string, unknown> = {};
    const Probe = defineComponent({
        props,
        setup(probeProps) {
            resolved = probeProps;
            return () => null;
        },
    });
    render({ template, components: { Probe } });
    return resolved;
};

describe(keysOf, () => {
    it('should build the Vue props options', () => {
        expect(props).toEqual({
            label: { required: false },
            isOpen: { type: Boolean, default: undefined },
            'aria-disabled': { type: [Boolean, String], default: undefined },
        });
    });

    it('should cast a bare template attribute to `true`', () => {
        const resolved = resolveProps('<Probe is-open aria-disabled />');
        expect(resolved.isOpen).toBe(true);
        // Vue camelizes the declared `aria-disabled` key.
        expect(resolved.ariaDisabled).toBe(true);
    });

    it('should keep an absent boolean prop `undefined`', () => {
        const resolved = resolveProps('<Probe />');
        expect(resolved.isOpen).toBeUndefined();
        expect(resolved.ariaDisabled).toBeUndefined();
    });
});

// Enforced by `vue-tsc` during `yarn type-check` (`expectTypeOf` is a runtime no-op here).
describe('VueToJSXProps', () => {
    interface CoreProps {
        label?: string;
        isDisabled?: boolean;
        children?: unknown;
        className?: string;
        ref?: unknown;
        handleClick?: () => void;
    }

    it('should drop the JSX props and add `class`', () => {
        type Props = VueToJSXProps<CoreProps>;
        expectTypeOf<Props>().not.toHaveProperty('children');
        expectTypeOf<Props>().not.toHaveProperty('className');
        expectTypeOf<Props>().not.toHaveProperty('ref');
        expectTypeOf<Props>().not.toHaveProperty('handleClick');
        expectTypeOf<Props['label']>().toEqualTypeOf<string | undefined>();
        expectTypeOf<Props['class']>().toEqualTypeOf<ClassValue | undefined>();
    });

    it('should drop the extra omitted props', () => {
        expectTypeOf<VueToJSXProps<CoreProps, 'label'>>().not.toHaveProperty('label');
    });

    it('should keep the known keys of a type with an index signature', () => {
        type Props = VueToJSXProps<CoreProps & HasRequiredLinkHref<'button'>>;
        expectTypeOf<Props['isDisabled']>().toEqualTypeOf<boolean | undefined>();
        expectTypeOf<Pick<Props, 'isDisabled'>>().toEqualTypeOf<{ isDisabled?: boolean }>();
        expectTypeOf<ListboxOptionActionProps['isDisabled']>().toEqualTypeOf<boolean | undefined>();
    });

    it('should keep the props of each member of a union', () => {
        type Props = VueToJSXProps<{ as: 'a'; href: string } | { as: 'button'; type?: 'submit' }>;
        expectTypeOf<Extract<Props, { as: 'a' }>['href']>().toEqualTypeOf<string>();
        expectTypeOf<Extract<Props, { as: 'button' }>['type']>().toEqualTypeOf<'submit' | undefined>();
    });
});
