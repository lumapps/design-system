import { render } from '@testing-library/vue';
import BaseSkeletonRectangleTests from '@lumx/core/js/components/Skeleton/SkeletonRectangleTests';
import SkeletonRectangle from './SkeletonRectangle';
import type { SkeletonRectangleProps } from '@lumx/core/js/components/Skeleton';

describe('<SkeletonRectangle>', () => {
    // Run core tests
    BaseSkeletonRectangleTests({
        render: (props: SkeletonRectangleProps) => render(SkeletonRectangle, { props }),
    });
});
