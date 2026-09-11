import { vi } from 'vitest';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { Slideshow, SlideshowProps } from './Slideshow';
import { Slides } from './Slides';
import { SlideMode } from './constants';

vi.mock('@lumx/react/utils/browser/isScrollSnapSupported', () => ({
    isScrollSnapSupported: () => true,
}));

const CLASSNAME = Slides.className as string;

const setup = (propsOverride: Partial<SlideshowProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: SlideshowProps = {
        slideshowControlsProps: {
            nextButtonProps: { label: 'Next' },
            previousButtonProps: { label: 'Prev' },
        },
        children: [<div key="1">Slide 1</div>, <div key="2">Slide 2</div>],
        ...propsOverride,
    };
    render(<Slideshow {...props} />, { wrapper });
    const slideShow = queryByClassName(document.body, CLASSNAME);
    return { props, slideShow };
};

describe(`<${Slideshow.displayName}>`, () => {
    it('should render controls', () => {
        setup();
        expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Prev' })).toBeInTheDocument();
    });

    describe('slideMode', () => {
        it('should default to transform-translate mode', () => {
            const { slideShow } = setup();
            const wrapper = slideShow?.querySelector(`.${CLASSNAME}__wrapper`);
            expect(wrapper).toHaveStyle({ transform: 'translateX(-0%)' });
            expect(wrapper).not.toHaveClass(`${CLASSNAME}__wrapper--scroll-snap`);
            expect(wrapper).not.toHaveAttribute('tabIndex');
        });

        it('should apply scroll-snap mode with correct class and tabIndex', () => {
            const { slideShow } = setup({ slideMode: SlideMode.scrollSnap });
            const wrapper = slideShow?.querySelector(`.${CLASSNAME}__wrapper`);
            expect(wrapper).toHaveClass(`${CLASSNAME}__wrapper--scroll-snap`);
            expect(wrapper).toHaveAttribute('tabIndex', '0');
            expect(wrapper).not.toHaveStyle({ transform: 'translateX(-0%)' });
        });
    });

    describe('aria-roledescription', () => {
        it('should default to aria-roledescription="carousel" on the container and "slide" on each group', () => {
            const { slideShow } = setup();
            expect(slideShow).toHaveAttribute('aria-roledescription', 'carousel');
            const groups = screen.getAllByRole('tabpanel');
            groups.forEach((group) => expect(group).toHaveAttribute('aria-roledescription', 'slide'));
        });

        it('should override the container aria-roledescription when passed as a prop', () => {
            const { slideShow } = setup({ 'aria-roledescription': 'Carrousel' });
            expect(slideShow).toHaveAttribute('aria-roledescription', 'Carrousel');
        });

        it('should keep the default container aria-roledescription when explicitly passed undefined', () => {
            const { slideShow } = setup({ 'aria-roledescription': undefined });
            expect(slideShow).toHaveAttribute('aria-roledescription', 'carousel');
        });

        it('should override every slide group aria-roledescription via slideGroupRoleDescription', () => {
            setup({ slideGroupRoleDescription: 'Diapositive' });
            const groups = screen.getAllByRole('tabpanel');
            groups.forEach((group) => expect(group).toHaveAttribute('aria-roledescription', 'Diapositive'));
        });

        it('should keep the default slide aria-roledescription when slideGroupRoleDescription is not passed', () => {
            setup();
            const groups = screen.getAllByRole('tabpanel');
            groups.forEach((group) => expect(group).toHaveAttribute('aria-roledescription', 'slide'));
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'slideShow',
        forwardAttributes: 'slideShow',
        applyTheme: {
            affects: [{ element: 'slideShow' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
