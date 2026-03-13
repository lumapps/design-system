import { type CSSProperties, defineComponent, useAttrs } from 'vue';

import {
    GenericBlock as GenericBlockUI,
    type GenericBlockProps as UIProps,
    GenericBlockPropsToOverride,
} from '@lumx/core/js/components/GenericBlock';
import type { JSXElement } from '@lumx/core/js/types';

import { FlexBox as FlexBoxVue, FlexBoxProps } from '../flex-box';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

/** FlexBox section props extended with standard HTML style. */
type SectionProps = FlexBoxProps & { style?: CSSProperties };

// Follow Vue FlexBox convention: expose verticalAlign/horizontalAlign instead of vAlign/hAlign.
// figure, actions and content are handled via named slots only (not as VNode props).
export type GenericBlockProps = VueToJSXProps<
    UIProps,
    | GenericBlockPropsToOverride
    | 'figure'
    | 'actions'
    | 'vAlign'
    | 'hAlign'
    | 'actionsProps'
    | 'contentProps'
    | 'figureProps'
> & {
    /** Customize the root element tag. */
    as?: string;
    /** Vertical alignment (maps to core's vAlign). */
    verticalAlign?: UIProps['vAlign'];
    /** Horizontal alignment (maps to core's hAlign). */
    horizontalAlign?: UIProps['hAlign'];
    /**
     * The props to forward to the content.
     * By default, the content will have the same alignment as wrapper.
     */
    contentProps?: SectionProps;
    /**
     * props to forward to the actions element.
     */
    actionsProps?: SectionProps;
    /**
     * props to forward to the figure element.
     */
    figureProps?: SectionProps;
};

/**
 * The GenericBlock is a layout component made of 3 sections that can be
 * displayed either horizontally or vertically with the same gap between each section.
 *
 * The sections are provided via named slots:
 * - `figure` slot => A visual element to display before the main content.
 * - default slot => The main content displayed.
 * - `actions` slot => One or more actions to set after the element.
 */
const GenericBlock = defineComponent(
    (props: GenericBlockProps, { slots }) => {
        const attrs = useAttrs();

        return () => {
            const figure = slots.figure?.() as JSXElement;
            const content = slots.default?.() as JSXElement;
            const actions = slots.actions?.() as JSXElement;

            // Forward alignment to sub-sections (like the React wrapper does with alignProps).
            // verticalAlign/horizontalAlign are in {…props} spread, and FlexBoxVue declares them,
            // so they propagate correctly through forwardedProps → injected FlexBoxVue.
            const alignProps = {
                verticalAlign: props.verticalAlign,
                horizontalAlign: props.horizontalAlign,
            };

            // Destructure `class` out of props so it isn't forwarded as-is to GenericBlockUI
            // (which would reach FlexBoxVue as both `class` and `className`, causing FlexBoxVue
            // to prefer `class` over the merged `className` that includes the BEM block class).
            const { class: _, ...restProps } = props;

            return (
                <GenericBlockUI
                    {...restProps}
                    {...attrs}
                    className={props.class as string}
                    FlexBox={FlexBoxVue as any}
                    figure={figure}
                    content={content}
                    actions={actions}
                    figureProps={{ ...alignProps, ...(props.figureProps as any) }}
                    contentProps={{ ...alignProps, ...(props.contentProps as any) }}
                    actionsProps={{ ...alignProps, ...(props.actionsProps as any) }}
                />
            );
        };
    },
    {
        name: 'LumxGenericBlock',
        inheritAttrs: false,
        props: keysOf<GenericBlockProps>()(
            'as',
            'orientation',
            'verticalAlign',
            'horizontalAlign',
            'gap',
            'fillSpace',
            'wrap',
            'marginAuto',
            'noShrink',
            'figureProps',
            'contentProps',
            'actionsProps',
            'class',
        ),
    },
);

export default GenericBlock;
