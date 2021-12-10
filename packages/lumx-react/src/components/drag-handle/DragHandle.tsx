import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { mdiDragVertical } from '@lumx/icons';
import { ColorPalette, Icon, Size, Theme } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface DragHandleProps extends GenericProps {
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'DragHandle';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * DragHandle component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const DragHandle: Comp<DragHandleProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { className, theme, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))}
        >
            <Icon icon={mdiDragVertical} color={theme === Theme.dark ? ColorPalette.light : undefined} size={Size.xs} />
        </div>
    );
});
DragHandle.displayName = COMPONENT_NAME;
DragHandle.className = CLASSNAME;
