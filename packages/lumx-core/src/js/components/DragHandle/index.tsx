import { mdiDragVertical } from '@lumx/icons';
import type { LumxClassName, HasTheme, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';
import { ColorPalette, Size, Theme } from '../../constants';
import { Icon } from '../Icon';

/**
 * Defines the props of the component.
 */
export interface DragHandleProps extends HasTheme, HasClassName {
    /** Reference to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'DragHandle';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-drag-handle';
const { block } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<DragHandleProps> = {};

/**
 * DragHandle component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const DragHandle = (props: DragHandleProps) => {
    const { className, theme, ref, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames.join(className, block({ [`theme-${theme}`]: Boolean(theme) }))}
        >
            {Icon({
                icon: mdiDragVertical,
                color: theme === Theme.dark ? ColorPalette.light : ColorPalette.dark,
                size: Size.xs,
            })}
        </div>
    );
};
