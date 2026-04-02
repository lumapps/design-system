import { headingElementArgType } from '@lumx/core/stories/controls/element';
import { LANDSCAPE_IMAGES } from '@lumx/core/stories/controls/image';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { Size } from '../../constants';
import { DEFAULT_PROPS } from '.';

/**
 * Setup LinkPreview stories for a specific framework (React or Vue).
 */
export function setup({
    component: LinkPreview,
    decorators: { withNestedProps, withWrapper },
}: SetupStoriesOptions<{
    decorators: 'withNestedProps' | 'withWrapper';
}>) {
    const meta = {
        component: LinkPreview,
        decorators: [withNestedProps()],
        args: {
            ...DEFAULT_PROPS,
            title: '',
            description: '',
            link: 'https://example.com',
        },
        argTypes: {
            size: getSelectArgType([Size.regular, Size.big]),
            titleHeading: { if: { arg: 'title' }, ...headingElementArgType },
        },
    };

    /** Default link preview with only the required props (link) */
    const Default = {};

    /** Link preview with title and description */
    const TitleAndDescription = {
        args: {
            title: 'Link title',
            description: loremIpsum('short'),
        },
    };

    /** Link preview with title, description and thumbnail */
    const AllFields = {
        args: {
            ...TitleAndDescription.args,
            'thumbnailProps.image': LANDSCAPE_IMAGES.landscape1,
        },
    };

    /** Big link preview with title, description and thumbnail */
    const Big = {
        decorators: [withWrapper({ style: { width: '400px' } })],
        args: {
            ...AllFields.args,
            size: Size.big,
        },
    };

    return { meta, Default, TitleAndDescription, AllFields, Big };
}
