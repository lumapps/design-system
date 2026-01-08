import { GenericProps } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useClassnames } from '@lumx/react/utils';

/**
 * Defines the props of the component
 */
export interface ButtonGroupProps extends GenericProps {
    /**
     * Children
     */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ButtonGroup';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-button-group';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ButtonGroupProps> = {};

/**
 * ButtonGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ButtonGroup = forwardRef<ButtonGroupProps, HTMLDivElement>((props, ref) => {
    const { children, className, ...forwardedProps } = props;
    const { block } = useClassnames(CLASSNAME);

    return (
        <div ref={ref} {...forwardedProps} className={block([className])}>
            {children}
        </div>
    );
});
ButtonGroup.displayName = COMPONENT_NAME;
ButtonGroup.className = CLASSNAME;
ButtonGroup.defaultProps = DEFAULT_PROPS;
