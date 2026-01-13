import { Alignment, Orientation, Size } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { useClassnames } from '@lumx/react/utils';
import type { LumxClassName } from '@lumx/core/js/types';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

type GridGutterSize = Extract<Size, 'regular' | 'big' | 'huge'>;

/**
 * Defines the props of the component.
 */
export interface GridProps extends GenericProps {
    /** Orientation. */
    orientation?: Orientation;
    /** Whether the children are wrapped or not. */
    wrap?: string;
    /** Vertical alignment. */
    vAlign?: Alignment;
    /** Horizontal alignment. */
    hAlign?: Alignment;
    /** Gutter size. */
    gutter?: GridGutterSize;
    /** Children */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Grid';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-grid';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<GridProps> = {
    orientation: Orientation.horizontal,
    wrap: 'nowrap',
};

/**
 * Grid component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Grid = forwardRef<GridProps, HTMLDivElement>((props, ref) => {
    const {
        children,
        className,
        gutter,
        hAlign,
        orientation = DEFAULT_PROPS.orientation,
        vAlign,
        wrap = DEFAULT_PROPS.wrap,
        ...forwardedProps
    } = props;

    const { block } = useClassnames(CLASSNAME);

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={block(
                {
                    [`orientation-${orientation}`]: Boolean(orientation),
                    [`wrap-${wrap}`]: Boolean(wrap),
                    [`gutter-${gutter}`]: Boolean(gutter),
                    [`h-align-${hAlign}`]: Boolean(hAlign),
                    [`v-align-${vAlign}`]: Boolean(vAlign),
                    container: true,
                },
                className,
            )}
        >
            {children}
        </div>
    );
});
Grid.displayName = COMPONENT_NAME;
Grid.className = CLASSNAME;
Grid.defaultProps = DEFAULT_PROPS;
