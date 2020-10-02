import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { mdiDragVertical } from '@lumx/icons';
import { ColorPalette, Icon, Size, Theme } from '@lumx/react';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface DragHandleProps extends GenericProps {
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}DragHandle`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

const DragHandle: React.FC<DragHandleProps> = ({ className, theme, ...forwardedProps }) => (
    <div {...forwardedProps} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))}>
        <Icon icon={mdiDragVertical} color={theme === Theme.dark ? ColorPalette.light : undefined} size={Size.xs} />
    </div>
);
DragHandle.displayName = COMPONENT_NAME;

export { CLASSNAME, DragHandle, DragHandleProps };
