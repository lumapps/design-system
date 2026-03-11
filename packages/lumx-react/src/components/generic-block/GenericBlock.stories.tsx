import { Button, GenericBlock, Icon, Thumbnail } from '@lumx/react';

import { setup } from '@lumx/core/js/components/GenericBlock/Stories';

const { meta, ...stories } = setup({
    component: GenericBlock,
    components: { Icon, Button, Thumbnail },
});

export default { title: 'LumX components/generic-block/GenericBlock', ...meta };

export const SectionsInProps = { ...stories.SectionsInProps };
export const SectionsInChildren = { ...stories.SectionsInChildren };
export const Vertical = { ...stories.Vertical };
export const VerticalAlignCenter = { ...stories.VerticalAlignCenter };
export const VerticalOverflow = { ...stories.VerticalOverflow };
export const Horizontal = { ...stories.Horizontal };
export const HorizontalAlignRightBottom = { ...stories.HorizontalAlignRightBottom };
export const HorizontalOverflow = { ...stories.HorizontalOverflow };
export const GapSizes = { ...stories.GapSizes };
export const AsAFigure = { ...stories.AsAFigure };
export const AsAnArticle = { ...stories.AsAnArticle };
