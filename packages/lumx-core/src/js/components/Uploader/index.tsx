import { AspectRatio, Size } from '../../constants';
import type {
    HasClassName,
    HasDisabled,
    LumxClassName,
    HasTheme,
    ValueOf,
    HasAriaDisabled,
    CommonRef,
} from '../../types';
import { classNames } from '../../utils';
import { Icon } from '../Icon';

/**
 * Uploader variants.
 */
export const UploaderVariant = {
    square: 'square',
    rounded: 'rounded',
    circle: 'circle',
} as const;
export type UploaderVariant = ValueOf<typeof UploaderVariant>;

/**
 * Uploader sizes.
 */
export type UploaderSize = Extract<Size, 'xl' | 'xxl'>;

/**
 * Extend native HTML input props with specialized `onChange` providing the a `File` array.
 */
interface FileInputProps extends Omit<React.ComponentProps<'input'>, 'onChange'> {
    onChange(files: File[], evt: React.ChangeEvent<HTMLInputElement>): void;
}

/**
 * Defines the props of the component.
 */
export interface UploaderProps extends HasClassName, HasDisabled, HasTheme, HasAriaDisabled {
    /** Image aspect ratio. */
    aspectRatio?: AspectRatio;
    /** Icon (SVG path). */
    icon?: string;
    /** Label text. */
    label?: string;
    /** Size variant. */
    size?: UploaderSize;
    /** Variant. */
    variant?: UploaderVariant;
    /** On click callback. */
    handleClick?: (event: any) => void;
    /** Handle file selection with a native input file. */
    fileInputProps?: FileInputProps;
    /** Forwarded ref to the root element. */
    ref?: CommonRef;
    /** Whether the component is disabled (computed from `isDisabled` and `aria-disabled`). */
    isAnyDisabled?: boolean;
    /** Id of the hidden file input (used to link the label `for` attribute). */
    inputId: string;
    /** Whether a file is currently being dragged over the input. */
    isDragHovering?: boolean;
    /** Callback fired when a dragged file leaves the drop zone. */
    handleDragLeave: () => void;
    /** Callback fired when a file is dragged over the drop zone. */
    handleDragEnter: () => void;
    /** Callback fired when the file input value changes. */
    handleChange?: (event: any) => void;
    /** Root element tag or component (e.g. `'button'` or `'label'`). */
    Component: 'button' | 'label';
}

export type UploaderPropsToOverride =
    | 'isAnyDisabled'
    | 'inputId'
    | 'isDragHovering'
    | 'handleDragLeave'
    | 'handleDragEnter'
    | 'Component';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Uploader';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-uploader';
export const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<UploaderProps> = {
    aspectRatio: AspectRatio.horizontal,
    size: Size.xl,
    variant: UploaderVariant.square,
};

/**
 * Uploader component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Uploader = (props: UploaderProps) => {
    const {
        aspectRatio = DEFAULT_PROPS.aspectRatio,
        className,
        label,
        icon,
        size = DEFAULT_PROPS.size,
        theme,
        variant = DEFAULT_PROPS.variant,
        isAnyDisabled,
        fileInputProps,
        inputId,
        isDragHovering,
        handleDragLeave,
        handleDragEnter,
        handleClick,
        handleChange,
        Component = 'label',
        ref,
        ...forwardedProps
    } = props;
    // Adjust to square aspect ratio when using circle variants.
    const adjustedAspectRatio = variant === UploaderVariant.circle ? AspectRatio.square : aspectRatio;

    return (
        <Component
            ref={ref as any}
            {...forwardedProps}
            onClick={handleClick}
            className={classNames.join(
                className,
                block({
                    [`aspect-ratio-${adjustedAspectRatio}`]: Boolean(adjustedAspectRatio),
                    [`size-${size}`]: Boolean(size),
                    [`theme-${theme}`]: Boolean(theme),
                    [`variant-${variant}`]: Boolean(variant),
                    'is-drag-hovering': isDragHovering,
                    'is-disabled': isAnyDisabled,
                }),
            )}
        >
            <span className={element('background')} />

            <span className={element('wrapper')}>
                {icon && Icon({ className: element('icon'), icon, size: Size.s })}

                {label && <span className={element('label')}>{label}</span>}
            </span>

            {fileInputProps && (
                <input
                    type="file"
                    id={inputId}
                    className={classNames.join(element('input'), classNames.visuallyHidden())}
                    {...fileInputProps}
                    readOnly={isAnyDisabled}
                    onChange={handleChange}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDragLeave}
                />
            )}
        </Component>
    );
};
