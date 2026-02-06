import { render, screen } from '@testing-library/vue';

import { commonTestsSuiteVTL } from '@lumx/vue/testing';
import { getByClassName } from '@lumx/core/testing/queries';
import { CLASSNAME, HeadingProps } from '@lumx/core/js/components/Heading';
import { Heading, HeadingLevelProvider } from '.';

const setup = (props: Partial<HeadingProps> = {}) => {
    const { container } = render(Heading, { props });
    return { props, container, element: getByClassName(container as HTMLElement, CLASSNAME) };
};

describe('<Heading>', () => {
    describe('Common Render', () => {
        it('should render a Text component with h1 by default', () => {
            render(Heading, { slots: { default: 'Some text' } });
            const heading = screen.getByRole('heading', { level: 1, name: 'Some text' });
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveClass(CLASSNAME);
            expect(heading).toHaveClass('lumx-typography-display1');
        });

        it('should render with as with the correct default typography', () => {
            render(Heading, {
                props: { as: 'h2' },
                slots: { default: 'Some text' },
            });
            const heading = screen.getByRole('heading', { level: 2, name: 'Some text' });
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveClass(CLASSNAME);
            expect(heading).toHaveClass('lumx-typography-headline');
        });
    });

    describe('Render', () => {
        it('should correctly render levels nested in HeadingLevel', () => {
            render({
                components: { Heading, HeadingLevelProvider },
                template: `
                    <div>
                        <Heading>Level 1</Heading>
                        <HeadingLevelProvider>
                            <Heading>Level 2</Heading>
                            <HeadingLevelProvider>
                                <Heading>Level 3</Heading>
                                <HeadingLevelProvider>
                                    <Heading>Level 4</Heading>
                                    <HeadingLevelProvider>
                                        <Heading>Level 5 - 1</Heading>
                                        <Heading>Level 5 - 2</Heading>
                                        <HeadingLevelProvider>
                                            <Heading>Level 6</Heading>
                                            <HeadingLevelProvider>
                                                <Heading>Level 7</Heading>
                                            </HeadingLevelProvider>
                                        </HeadingLevelProvider>
                                    </HeadingLevelProvider>
                                </HeadingLevelProvider>
                            </HeadingLevelProvider>
                        </HeadingLevelProvider>
                    </div>
                `,
            });

            expect(screen.getByRole('heading', { level: 1, name: 'Level 1' })).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 2, name: 'Level 2' })).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 3, name: 'Level 3' })).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 4, name: 'Level 4' })).toBeInTheDocument();

            const h5 = screen.getAllByRole('heading', { level: 5 });
            expect(h5).toHaveLength(2);
            expect(h5[0]).toHaveTextContent('Level 5 - 1');
            expect(h5[1]).toHaveTextContent('Level 5 - 2');
            // There should be 2 h6 because it is the maximum value;
            const h6 = screen.getAllByRole('heading', { level: 6 });
            expect(h6).toHaveLength(2);
            expect(h6[0]).toHaveTextContent('Level 6');
            expect(h6[1]).toHaveTextContent('Level 7');
        });

        it('should override typography', () => {
            render(Heading, {
                props: { typography: 'body1' } as HeadingProps,
                slots: { default: 'Custom Typo' },
            });

            const heading = screen.getByRole('heading', { name: 'Custom Typo' });
            expect(heading).toHaveClass('lumx-typography-body1');
        });
    });

    // Common tests suite.
    commonTestsSuiteVTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
    });
});
