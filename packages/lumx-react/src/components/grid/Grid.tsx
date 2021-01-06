import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Alignment, Orientation, Size } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

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
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Grid';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

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
export const Grid: Comp<GridProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { children, className, gutter, hAlign, orientation, vAlign, wrap, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                `${CLASSNAME}-container`,
                { [`${CLASSNAME}--h-align-${hAlign}`]: hAlign },
                { [`${CLASSNAME}--v-align-${vAlign}`]: vAlign },
                handleBasicClasses({ prefix: CLASSNAME, orientation, wrap, gutter }),
            )}
        >
            {children}
        </div>
    );
});
Grid.displayName = COMPONENT_NAME;
Grid.className = CLASSNAME;
Grid.defaultProps = DEFAULT_PROPS;
