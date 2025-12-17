import { render, screen } from '@testing-library/react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { Heading, HeadingProps } from './Heading';
import { HeadingLevelProvider } from './HeadingLevelProvider';

const CLASSNAME = Heading.className as string;

const setup = (props: Partial<HeadingProps> = {}) => {
    const { container } = render(<Heading {...props} />);
    return { props, container, element: getByClassName(container, CLASSNAME) };
};

describe(`<${Heading.displayName}>`, () => {
    describe('Render', () => {
        it('should render a Text component with h1 by default', () => {
            setup({ children: 'Some text' });
            const heading = screen.getByRole('heading', { level: 1, name: 'Some text' });
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveClass(CLASSNAME);
            expect(heading).toHaveClass('lumx-typography-display1');
        });

        it('should render with as with the correct default typography', () => {
            setup({ children: 'Some text', as: 'h2' });
            const heading = screen.getByRole('heading', { level: 2, name: 'Some text' });
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveClass(CLASSNAME);
            expect(heading).toHaveClass('lumx-typography-headline');
        });

        it('should correctly render levels nested in HeadingLevel', () => {
            render(
                <>
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
                </>,
            );

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
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
    });
});
