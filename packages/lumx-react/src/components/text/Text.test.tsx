import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { mdiEarth } from '@lumx/icons';
import { Icon } from '@lumx/react';
import { render, screen } from '@testing-library/react';
import { queryAllByClassName } from '@lumx/react/testing/utils/queries';
import BaseTextTests, { setup } from '@lumx/core/js/components/Text/Tests';
import { Text, TextProps } from '.';

describe(`<${Text.displayName}>`, () => {
    const renderText = (props: TextProps, options?: SetupRenderOptions) => render(<Text {...props} />, options);

    BaseTextTests({ render: renderText, screen });

    const setupText = (props: Partial<TextProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderText, screen });

    describe('Render', () => {
        it('should wrap icons with spaces', () => {
            const { element } = setupText({
                children: ['Some text', <Icon key="icon" icon={mdiEarth} />, 'with icon'],
            });
            const icons = queryAllByClassName(element, Icon.className as string);
            expect(icons).toHaveLength(1);

            // Icons are all wrapped with spaces
            for (const icon of icons) {
                expect((icon.previousSibling as any).textContent).toEqual(' ');
                expect((icon.nextSibling as any).textContent).toEqual(' ');
            }
        });

        it('should render dangerouslySetInnerHTML', () => {
            const { element } = setupText({ dangerouslySetInnerHTML: { __html: '<strong>HTML text</strong>' } });
            expect(element).toHaveTextContent('HTML text');
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setupText, {
        baseClassName: Text.className as string,
        forwardClassName: 'element',
        forwardAttributes: 'element',
    });
});
