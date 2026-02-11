import { render } from '@testing-library/vue';
import BaseSkeletonTypographyTests from '@lumx/core/js/components/Skeleton/SkeletonTypographyTests';
import SkeletonTypography from './SkeletonTypography';
import type { SkeletonTypographyProps } from '@lumx/core/js/components/Skeleton';

describe('<SkeletonTypography>', () => {
    // Run core tests
    BaseSkeletonTypographyTests({
        render: (props: SkeletonTypographyProps) => render(SkeletonTypography, { props }),
    });
});
