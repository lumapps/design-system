import { mdiDragVertical } from '@lumx/icons';
import { ColorPalette, Icon, Size, Theme } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';
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
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-drag-handle';
const { block } = classNames.bem(CLASSNAME);

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
            className={classNames.join(className, block({ [`theme-${theme}`]: Boolean(theme) }))}
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
