import { SetupOptions } from '../../../testing';
import { getByClassName } from '../../../testing/queries';
import { CardProps, CLASSNAME } from '.';

type SetupProps = Partial<CardProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<CardProps>) => {
    const props: CardProps = {
        ...propsOverride,
    };

    render(props, options);

    const card = getByClassName(document.body, CLASSNAME);

    return { card, props };
};

export default (renderOptions: SetupOptions<CardProps>) => {
    describe('Props', () => {
        it('should render correctly', () => {
            const { card } = setup({}, renderOptions);
            expect(card).toBeInTheDocument();
            expect(card).toHaveClass(CLASSNAME);
        });

        it('should render children', () => {
            setup({ children: 'Card content' }, renderOptions);
            expect(renderOptions.screen.getByText('Card content')).toBeInTheDocument();
        });

        it('should render with custom className', () => {
            const { card } = setup({ className: 'custom-class' }, renderOptions);
            expect(card).toHaveClass(CLASSNAME);
            expect(card).toHaveClass('custom-class');
        });

        it('should not apply an elevation modifier by default', () => {
            const { card } = setup({}, renderOptions);
            expect(card.className).not.toMatch(`${CLASSNAME}--elevation-`);
        });

        it('should render as a div by default', () => {
            const { card } = setup({}, renderOptions);
            expect(card.tagName).toBe('DIV');
        });

        it('should render as the given element', () => {
            const { card } = setup({ as: 'article' }, renderOptions);
            expect(card.tagName).toBe('ARTICLE');
            expect(card).toHaveClass(CLASSNAME);
        });

        ([1, 2, 3, 4, 5] as const).forEach((elevation) => {
            it(`should apply elevation ${elevation} modifier`, () => {
                const { card } = setup({ elevation }, renderOptions);
                expect(card).toHaveClass(`${CLASSNAME}--elevation-${elevation}`);
            });
        });
    });
};
