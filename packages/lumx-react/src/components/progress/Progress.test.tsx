import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { Progress, ProgressProps, ProgressVariant } from './Progress';
import { ProgressCircular } from './ProgressCircular';
import { ProgressLinear } from './ProgressLinear';

const CLASSNAME = Progress.className as string;

const setup = (props: Partial<ProgressProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const { container } = render(<Progress {...(props as any)} />, { wrapper });
    const progress = getByClassName(container, CLASSNAME);
    return { container, progress, props };
};

describe(`<${Progress.displayName}>`, () => {
    it('should render circular variant by default', () => {
        const { progress } = setup();
        expect(progress).toContainElement(progress.querySelector(`.${ProgressCircular.className}`));
    });

    it('should render linear variant', () => {
        const { progress } = setup({ variant: ProgressVariant.linear });
        expect(progress).toContainElement(progress.querySelector(`.${ProgressLinear.className}`));
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'progress',
        forwardAttributes: 'progress',
        forwardRef: 'progress',
    });
});
