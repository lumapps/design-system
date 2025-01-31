import React from 'react';

import classNames from 'classnames';

import { mdiDragVertical } from '@lumx/icons';
import { ColorPalette, Icon, Size, Theme } from '@lumx/react';
import type { GenericProps, HasTheme, ComponentClassName } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/react/utils/className';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface DragHandleProps extends GenericProps, HasTheme {}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'DragHandle';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: ComponentClassName<typeof COMPONENT_NAME> = 'lumx-drag-handle';

/**
 * DragHandle component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const DragHandle = forwardRef<DragHandleProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme();
    const { className, theme = defaultTheme, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))}
        >
            <Icon
                icon={mdiDragVertical}
                color={theme === Theme.dark ? ColorPalette.light : ColorPalette.dark}
                size={Size.xs}
            />
        </div>
    );
});
DragHandle.displayName = COMPONENT_NAME;
DragHandle.className = CLASSNAME;
