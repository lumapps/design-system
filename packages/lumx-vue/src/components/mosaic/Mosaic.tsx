import { defineComponent, useAttrs } from 'vue';

import {
    Mosaic as MosaicUI,
    type MosaicProps as UIProps,
    MosaicPropsToOverride,
} from '@lumx/core/js/components/Mosaic';

import { useTheme } from '../../composables/useTheme';
import { useClassName } from '../../composables/useClassName';
import { useHasEventListener } from '../../composables/useHasEventListener';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import Thumbnail, { type ThumbnailProps } from '../thumbnail/Thumbnail';

export type MosaicThumbnailItem = Omit<ThumbnailProps, 'class'> & { onClick?: (event: Event) => void };

export type MosaicProps = VueToJSXProps<UIProps, MosaicPropsToOverride> & {
    /** Thumbnails. */
    thumbnails: MosaicThumbnailItem[];
};

export const emitSchema = {
    handleClick: (index: number) => typeof index === 'number',
};

/**
 * Mosaic component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Mosaic = defineComponent(
    (props: MosaicProps, { emit }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const className = useClassName(() => props.class);
        const hasHandleClickListener = useHasEventListener('onHandleClick');

        const handleClick = (index: number) => {
            emit('handleClick', index);
        };

        return () => (
            <MosaicUI
                {...attrs}
                className={className.value}
                theme={props.theme || defaultTheme.value}
                thumbnails={props.thumbnails}
                Thumbnail={Thumbnail}
                handleClick={hasHandleClickListener ? handleClick : undefined}
            />
        );
    },
    {
        name: 'LumxMosaic',
        inheritAttrs: false,
        props: keysOf<MosaicProps>()('thumbnails', 'theme', 'class'),
        emits: emitSchema,
    },
);

export default Mosaic;
