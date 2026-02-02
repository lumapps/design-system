import { render, screen } from '@testing-library/vue';

import BaseHeadingTests from '@lumx/core/js/components/Heading/Tests';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';
import { getByClassName } from '@lumx/core/testing/queries';
import { Heading, HeadingLevelProvider, HeadingProps } from '.';

const CLASSNAME = Heading.className as string;

const setup = (props: Partial<HeadingProps> = {}) => {
    const { container } = render(Heading, { props });
    return { props, container, element: getByClassName(container as HTMLElement, CLASSNAME) };
};

describe('<Heading>', () => {
    const renderHeading = (props: HeadingProps, options: SetupRenderOptions<HeadingProps> = {}) => {
        const { children, ...restProps } = props;
        return render(Heading, {
            props: restProps,
            slots: children ? { default: children } : undefined,
            ...options,
        });
    };

    BaseHeadingTests({ render: renderHeading, screen });

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
