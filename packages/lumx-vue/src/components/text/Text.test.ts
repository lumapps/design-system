import { render, screen } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import { h } from 'vue';
import { mdiEarth } from '@lumx/icons';
import { Icon, JSXElement, Text } from '@lumx/vue';
import { queryAllByClassName } from '@lumx/core/testing/queries';
import BaseTextTests, { setup } from '@lumx/core/js/components/Text/Tests';
import { TextProps } from '@lumx/core/js/components/Text';

import { commonTestsSuiteVTL, SetupRenderOptions } from '../../testing/commonTestsSuiteVTL';
import { IconClassName } from '@lumx/core/js/components/Icon';

describe(`<Text>`, () => {
    const renderText = (
        props: TextProps & { children?: any; dangerouslySetInnerHTML?: any },
        options: SetupRenderOptions<TextProps> = {},
    ) => {
        return render(Text, {
            props,
            slots: {
                default: props.children,
            },
            ...options,
        });
    };

    BaseTextTests({ render: renderText, screen } as any);

    const setupText = (props: Partial<TextProps> = {}, options: SetupRenderOptions<TextProps> = {}) =>
        setup(props, { ...options, render: renderText, screen } as any);

    describe('Render', () => {
        it('should wrap icons with spaces', () => {
            const { element } = setupText({
                children: ['Some text', h(Icon, { icon: mdiEarth }), 'with icon'] as JSXElement,
            });
            const icons = queryAllByClassName(element, IconClassName as string);
            expect(icons).toHaveLength(1);

            // Icons are all wrapped with spaces
            for (const icon of icons) {
                expect((icon.previousSibling as any).textContent).toEqual(' ');
                expect((icon.nextSibling as any).textContent).toEqual(' ');
            }
        });
    });

    // Common tests suite.
    commonTestsSuiteVTL(setupText, {
        baseClassName: Text.className as string,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        forwardRef: 'element',
    });
});
