import { classNames } from '../../utils';
import type { LumxClassName, HasTheme, HasClassName, CommonRef } from '../../types';

export const COMPONENT_NAME = 'InputRequiredLegend';
export const InputRequiredLegendClassName: LumxClassName<typeof COMPONENT_NAME> = 'lumx-input-required-legend';

/**
 * Defines the props of the component.
 */
export interface InputRequiredLegendProps extends HasClassName, HasTheme {
    /**
     * Legend text explaining the required field marker (ex: "Indicates a required field").
     * The marker (`*`) is rendered by the component before this text.
     */
    label: string;
    /** ref to the root element `p` */
    ref?: CommonRef;
    /** id for the legend */
    id?: string;
}

const CLASSNAME = InputRequiredLegendClassName;
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<InputRequiredLegendProps> = {};

/**
 * InputRequiredLegend component.
 *
 * Explains the required field marker (`*`) displayed by `InputLabel` with `isRequired`.
 * Place it at the top of a form that contains required fields.
 */
export function InputRequiredLegend(props: InputRequiredLegendProps) {
    const { className, label, theme, ref, ...forwardedProps } = props;

    return (
        <p
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`theme-${theme}`]: Boolean(theme),
                }),
            )}
        >
            <span className={element('marker')}>*</span>
            {label}
        </p>
    );
}

InputRequiredLegend.displayName = COMPONENT_NAME;
InputRequiredLegend.className = CLASSNAME;
InputRequiredLegend.defaultProps = DEFAULT_PROPS;
