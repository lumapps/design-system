import { FlexBox, Orientation, Size, SkeletonCircle, SkeletonTypography, Typography } from '@lumx/react';

export const App = ({ theme }: any) => {
    return (
        <FlexBox orientation={Orientation.horizontal} style={{ width: 200 }}>
            <SkeletonCircle theme={theme} size={Size.m} className="lumx-spacing-margin-right-big" />

            <FlexBox fillSpace>
                <SkeletonTypography theme={theme} typography={Typography.body1} />
                <SkeletonTypography theme={theme} typography={Typography.caption} width="60%" />
            </FlexBox>
        </FlexBox>
    );
};
