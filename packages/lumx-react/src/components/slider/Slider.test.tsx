import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen, fireEvent } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { vi } from 'vitest';
import { Slider, SliderProps } from './Slider';

const CLASSNAME = Slider.className as string;

vi.mock('@lumx/react/hooks/useId', () => ({ useId: () => ':r1:' }));

const setup = (props: Partial<SliderProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const propsOverride: SliderProps = {
        max: 100,
        min: 0,
        value: 50,
        onChange: vi.fn(),
        ...props,
    };
    render(<Slider {...propsOverride} />, { wrapper });
    const slider = queryByClassName(document.body, CLASSNAME);
    return { props: propsOverride, slider };
};

describe(`<${Slider.displayName}>`, () => {
    describe('Props', () => {
        it('should render label and helper', () => {
            setup({ label: 'Label', helper: 'Helper' });
            expect(screen.getByText('Label')).toBeInTheDocument();
            expect(screen.getByText('Helper')).toBeInTheDocument();
        });

        it('should hide min/max labels', () => {
            const { slider } = setup({ hideMinMaxLabel: true });
            expect(slider?.querySelector(`.${CLASSNAME}__value-label`)).not.toBeInTheDocument();
        });

        it('should show min/max labels by default', () => {
            const { slider } = setup();
            expect(slider?.querySelector(`.${CLASSNAME}__value-label--min`)).toHaveTextContent('0');
            expect(slider?.querySelector(`.${CLASSNAME}__value-label--max`)).toHaveTextContent('100');
        });
    });

    describe('Interactions', () => {
        beforeAll(() => {
            // Mock getBoundingClientRect
            vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
                width: 100,
                left: 0,
                top: 0,
                height: 10,
                bottom: 10,
                right: 100,
                x: 0,
                y: 0,
                toJSON: () => {},
            });
        });

        afterAll(() => {
            vi.restoreAllMocks();
        });

        it('should call onChange when clicking on track', () => {
            const onChange = vi.fn();
            const { slider } = setup({ onChange, min: 0, max: 100 });
            // Simulate click at 50%
            fireEvent.mouseDown(slider!, { clientX: 50, pageX: 50 });
            expect(onChange).toHaveBeenCalledWith(50, undefined, expect.anything());
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'slider',
        forwardAttributes: 'slider',
        applyTheme: {
            affects: [{ element: 'slider' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
