import { Card, FlexBox, Text } from '@lumx/react';

const ELEVATIONS = [1, 2, 3, 4, 5] as const;

export default () => (
    <FlexBox orientation="horizontal" gap="big" wrap>
        {ELEVATIONS.map((elevation) => (
            <Card key={elevation} elevation={elevation}>
                <Text as="span">Elevation {elevation}</Text>
            </Card>
        ))}
    </FlexBox>
);
