import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { render, screen } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import userEvent from '@testing-library/user-event';
import { mdiPlus } from '@lumx/icons';
import { Uploader, UploaderProps } from './Uploader';

const CLASSNAME = Uploader.className as string;

type SetupProps = Partial<UploaderProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}) => {
    const props: any = { ...propsOverride };

    render(<Uploader {...props} />);
    const uploader = getByClassName(document.body, CLASSNAME);
    const label = queryByClassName(uploader, `${CLASSNAME}__label`);
    const icon = queryByClassName(uploader, `${CLASSNAME}__icon`);

    return { props, uploader, label, icon };
};

describe(`<${Uploader.displayName}>`, () => {
    describe('Props', () => {
        it('should render default', () => {
            const label = 'Label';
            const { uploader } = setup({ label });

            expect(uploader).toHaveClass(CLASSNAME);
            expect(uploader).toBe(screen.queryByRole('button', { name: label }));
            expect(uploader).toHaveClass('lumx-uploader--aspect-ratio-horizontal');
            expect(uploader).toHaveClass('lumx-uploader--size-xl');
            expect(uploader).toHaveClass('lumx-uploader--theme-light');
            expect(uploader).toHaveClass('lumx-uploader--variant-square');
        });

        it('should render icon', () => {
            const { icon } = setup({ icon: mdiPlus });
            expect(icon).toBeInTheDocument();
        });

        it('should render variant circle', () => {
            const { uploader } = setup({
                variant: 'circle',
                // Ratio should be ignored
                aspectRatio: 'vertical',
            });

            expect(uploader).toHaveClass(CLASSNAME);
            expect(uploader).toHaveClass('lumx-uploader--aspect-ratio-square');
            expect(uploader).toHaveClass('lumx-uploader--size-xl');
            expect(uploader).toHaveClass('lumx-uploader--theme-light');
            expect(uploader).toHaveClass('lumx-uploader--variant-circle');
        });

        it('should render variant rounded', () => {
            const { uploader } = setup({ variant: 'rounded' });

            expect(uploader).toHaveClass(CLASSNAME);
            expect(uploader).toHaveClass('lumx-uploader--aspect-ratio-horizontal');
            expect(uploader).toHaveClass('lumx-uploader--size-xl');
            expect(uploader).toHaveClass('lumx-uploader--theme-light');
            expect(uploader).toHaveClass('lumx-uploader--variant-rounded');
        });
    });

    describe('Events', () => {
        it('should trigger `onClick` when clicked', async () => {
            const onClick = jest.fn();
            const { uploader } = setup({ onClick });

            await userEvent.click(uploader);
            expect(onClick).toHaveBeenCalled();
        });

        it('should trigger `onClick` when pressing Enter or Escape', async () => {
            const onClick = jest.fn();
            const { uploader } = setup({ onClick });

            await userEvent.tab();
            expect(uploader).toHaveFocus();

            // Activate with Enter
            await userEvent.keyboard('[Enter]');
            expect(onClick).toHaveBeenCalled();

            onClick.mockClear();

            // Activate with Space
            await userEvent.keyboard('[Space]');
            expect(onClick).toHaveBeenCalled();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'uploader',
        forwardAttributes: 'uploader',
        forwardRef: 'uploader',
    });
});
