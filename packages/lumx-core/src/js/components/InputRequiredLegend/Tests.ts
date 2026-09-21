import { Theme } from '../../constants';
import { SetupOptions } from '../../../testing';
import { getByClassName } from '../../../testing/queries';
import { InputRequiredLegend, InputRequiredLegendProps } from '.';

const CLASSNAME = InputRequiredLegend.className as string;

type SetupProps = Partial<InputRequiredLegendProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (
    propsOverride: SetupProps = {},
    { render, ...options }: SetupOptions<InputRequiredLegendProps>,
) => {
    const props: InputRequiredLegendProps = {
        label: 'Indicates a required field',
        ...propsOverride,
    };

    render(props, options);

    const legend = getByClassName(document.body, CLASSNAME);
    const marker = getByClassName(legend, `${CLASSNAME}__marker`);

    return { legend, marker, props };
};

export default (renderOptions: SetupOptions<InputRequiredLegendProps>) => {
    describe('Props', () => {
        it('should render label with a readable marker', () => {
            const { props, legend, marker } = setup({ label: 'Marks required fields' }, renderOptions);

            expect(legend.tagName.toLowerCase()).toBe('p');
            expect(legend).toHaveClass(CLASSNAME);
            expect(legend).toHaveClass(`${CLASSNAME}--theme-light`);
            expect(legend).toHaveTextContent(`*${props.label}`);
            // The marker must stay readable by assistive technologies (it is what the legend explains)
            expect(marker).toHaveTextContent('*');
            expect(marker).not.toHaveAttribute('aria-hidden');
        });

        it('should render dark theme', () => {
            const { legend } = setup({ theme: Theme.dark }, renderOptions);
            expect(legend).toHaveClass(`${CLASSNAME}--theme-dark`);
        });
    });
};
