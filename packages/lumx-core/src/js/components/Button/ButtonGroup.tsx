import { classNames } from '../../utils';
import type { LumxClassName, GenericProps, JSXElement } from '../../types';

/**
 * Defines the props of the component
 */
export interface ButtonGroupProps extends GenericProps {
    /**
     * Children
     */
    children?: JSXElement;
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
 * @param  ref   Component ref.
 * @return React element.
 */
export const ButtonGroup = (props: ButtonGroupProps) => {
    const { children, className, ref, ...forwardedProps } = props;

    return (
        <div ref={ref} {...forwardedProps} className={classNames.join(className, CLASSNAME)}>
            {children}
        </div>
    );
};

ButtonGroup.displayName = COMPONENT_NAME;
ButtonGroup.className = CLASSNAME;
ButtonGroup.defaultProps = DEFAULT_PROPS;
