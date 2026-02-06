import type { LumxClassName, HasClassName, JSXElement, CommonRef } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props of the component
 */
export interface ButtonGroupProps extends HasClassName {
    /**
     * Children
     */
    children?: JSXElement;
    /** reference to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ButtonGroup';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-button-group';

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<ButtonGroupProps> = {};

/**
 * ButtonGroup component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const ButtonGroup = (props: ButtonGroupProps) => {
    const { children, className, ...forwardedProps } = props;

    return (
        <div {...forwardedProps} className={classNames.join(className, CLASSNAME)}>
            {children}
        </div>
    );
};

ButtonGroup.displayName = COMPONENT_NAME;
ButtonGroup.className = CLASSNAME;
ButtonGroup.defaultProps = DEFAULT_PROPS;
