import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { headingElementArgType } from '@lumx/core/stories/controls/element';
import { loremIpsum } from '@lumx/react/stories/utils/lorem';
import { LANDSCAPE_IMAGES } from '@lumx/core/stories/controls/image';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';

import { Size } from '@lumx/core/js/constants';
import { LinkPreview, LinkPreviewProps } from './LinkPreview';

export default {
    title: 'LumX components/link-preview/Link preview',
    component: LinkPreview,
    decorators: [withNestedProps()],
    args: {
        ...LinkPreview.defaultProps,
        title: '',
        description: '',
        link: 'https://example.com',
    },
    argTypes: {
        size: getSelectArgType<LinkPreviewProps['size']>([Size.regular, Size.big]),
        titleHeading: { if: { arg: 'title' }, ...headingElementArgType },
    },
};

/**
 * Default link preview with only the required props (link)
 */
export const Default = {};

/**
 * Link preview with title and description
 */
export const TitleAndDescription = {
    args: {
        title: 'Link title',
        description: loremIpsum('short'),
    },
};

/**
 * Link preview with title, description and thumbnail
 */
export const AllFields = {
    args: {
        ...TitleAndDescription.args,
        'thumbnailProps.image': LANDSCAPE_IMAGES.landscape1,
    },
};

/**
 * Big link preview with title, description and thumbnail
 */
export const Big = {
    decorators: [withWrapper({ style: { width: '400px' } })],
    args: {
        ...AllFields.args,
        size: Size.big,
    },
};
