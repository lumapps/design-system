import { HorizontalAlignment } from '../../constants';
import type { JSXElement, LumxClassName, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props of the component.
 */
export interface ChipGroupProps extends HasClassName {
    /**
     * Chip horizontal alignment.
     * @deprecated
     */
    align?: HorizontalAlignment;
    /** Children */
    children?: JSXElement;
    /** reference to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ChipGroup';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-chip-group';

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<ChipGroupProps> = {};

/**
 * ChipGroup component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const ChipGroup = (props: ChipGroupProps) => {
    const { children, className, ref, ...forwardedProps } = props;

    return (
        <div ref={ref} {...forwardedProps} className={classNames.join(className, CLASSNAME)}>
            {children}
        </div>
    );
};
