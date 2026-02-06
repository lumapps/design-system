import { ColorPalette, ColorVariant, GridColumn, Icon, IconProps, Text } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/Icon/Stories';

const { meta, SizeAndShape, AllColors, InsideText } = setup({
    component: Icon,
    decorators: { withWrapper, withCombinations },
    overrides: {
        AllColors: {
            decorators: [
                withCombinations({
                    combinations: {
                        rows: { key: 'color', options: withUndefined(ColorPalette) },
                        cols: { key: 'colorVariant', options: withUndefined(ColorVariant) },
                        sections: {
                            Default: {},
                            'Has shape': { hasShape: true },
                        },
                    },
                }),
                withWrapper({ maxColumns: 2, itemMinWidth: 500 }, GridColumn),
            ],
        },
        InsideText: {
            render: (args: IconProps) => (
                <Text as="p">
                    Lorem ipsum <Icon {...args} /> dolor sit amet.
                </Text>
            ),
        },
    },
});

export default {
    title: 'LumX components/icon/Icon',
    ...meta,
};

export { SizeAndShape, AllColors, InsideText };
