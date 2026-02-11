import { render, screen } from '@testing-library/vue';
import BaseSkeletonCircleTests from '@lumx/core/js/components/Skeleton/SkeletonCircleTests';
import SkeletonCircle from './SkeletonCircle';
import type { SkeletonCircleProps } from '@lumx/core/js/components/Skeleton';

describe('<SkeletonCircle>', () => {
    // Run core tests
    BaseSkeletonCircleTests({
        render: (props: SkeletonCircleProps) => render(SkeletonCircle, { props }),
        screen,
    });
});
