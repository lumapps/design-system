import { classNames } from '../../utils';
import type { GenericProps, HasClassName, HasTheme, LumxClassName } from '../../types';
import type { TimeOfDay } from '../../utils/time';
import type { SelectTextFieldTranslations } from '../../utils/select/types';
import type { ComboboxOptionProps } from '../Combobox/ComboboxOption';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'TimePickerField';

/**
 * Component default class name (BEM root).
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-time-picker-field';
const { block } = classNames.bem(CLASSNAME);

/**
 * Default values for `TimePickerFieldWrapperProps`.
 */
export const DEFAULT_PROPS: Partial<TimePickerFieldWrapperProps> = {
    step: 30,
    boundsMode: 'on-blur',
};

/**
 * Translations consumed by `TimePickerField` (forwarded as-is to the underlying
 * `SelectTextField`).
 */
export type TimePickerFieldTranslations = Pick<SelectTextFieldTranslations, 'clearLabel' | 'showSuggestionsLabel'>;

/**
 * Wrapper-level props shared by React and Vue `TimePickerField`.
 *
 * These represent the public API that framework wrappers expose to consumers
 * (as opposed to the core template props which use pre-computed `TimeOfDay` values).
 */
export interface TimePickerFieldWrapperProps {
    /**
     * Currently selected time. Only the time-of-day component is consumed; the
     * date part is preserved when emitting change.
     */
    value?: Date;

    /**
     * BCP-47 locale string (e.g. `'en-US'`, `'fr-FR'`).
     */
    locale?: string;

    /**
     * Minute interval between option entries.
     */
    step?: number;

    /**
     * Lower bound. Options strictly before this time remain **visible** in the
     * dropdown but are rendered as disabled (cannot be picked). Typed input
     * below this bound is snapped up to it on blur.
     */
    minTime?: Date;

    /**
     * Upper bound. Options strictly after this time remain **visible** in the
     * dropdown but are rendered as disabled (cannot be picked). Typed input
     * above this bound is snapped down to it on blur.
     */
    maxTime?: Date;

    /**
     * Controls how the time value interacts with `[minTime, maxTime]` bounds.
     * Typed input is always snapped to bounds on blur.
     * - `'enforce'`: additionally, the controlled `value` prop is proactively
     *   clamped to bounds on mount and whenever bounds change, calling
     *   `onChange` when adjusted.
     * - `'on-blur'` (default): only blur snapping applies.
     */
    boundsMode?: 'on-blur' | 'enforce';

    /**
     * Translation labels for clear and show suggestions buttons.
     */
    translations: TimePickerFieldTranslations;

    /**
     * Callback to customize individual option props.
     * Called for each time option with the hour and minute.
     * Return partial `ComboboxOptionProps` to override default option rendering
     * (e.g. `before`, `after`, `children`, `tooltipProps`, `actionProps`).
     * `isDisabled` is merged with the out-of-range state using `||`.
     */
    getOptionProps?: ({ hour, minute }: { hour: number; minute: number }) => Partial<ComboboxOptionProps>;
}

/**
 * `SelectTextField` props managed internally by the `TimePickerField` wrappers
 * (omitted from the inherited `SelectTextField` props in both React and Vue).
 */
export type TimePickerFieldOwnedSelectProps =
    | 'value'
    | 'listStatus'
    | 'translations'
    | 'options'
    | 'getOptionId'
    | 'getOptionName'
    | 'getOptionDescription'
    | 'getSectionId'
    | 'renderOption'
    | 'filter'
    | 'onBlur'
    | 'onSearch'
    | 'selectionType'
    | 'maxLength'
    | 'searchInputValue'
    | 'openOnFocus'
    | 'beforeOptions'
    | 'popoverProps';

/**
 * Core props for the `TimePickerField` template.
 */
export interface TimePickerFieldProps extends HasTheme, HasClassName, GenericProps {
    /**
     * Currently selected option. Resolve from the consumer's `Date` value via
     * `value && timeList.find((e) => e.hour === value.getHours() && e.minute === value.getMinutes())`.
     */
    value?: TimeOfDay;

    /** Time options (one entry per `step`-minute slot). */
    options: TimeOfDay[];

    /** Translation labels (clear button, show-suggestions toggle). */
    translations: TimePickerFieldTranslations;

    /** Called when the user picks (or clears) an option. */
    handleChange(next: TimeOfDay | undefined): void;

    /** Called as the user types — wrappers track this to resolve on blur. */
    handleSearch(typed: string): void;

    /** Called when the input loses focus — wrappers commit the typed value. */
    handleBlur(): void;

    /**
     * Callback to customize individual option props.
     * See `TimePickerFieldWrapperProps.getOptionProps`.
     */
    getOptionProps?: ({ hour, minute }: { hour: number; minute: number }) => Partial<ComboboxOptionProps>;
}

/**
 * Injected framework-specific components for TimePickerField rendering.
 */
export interface TimePickerFieldComponents {
    /** Framework-specific `SelectTextField` wrapper. */
    SelectTextField: any;
    /** Framework-specific `SelectTextField.Option` sub-component (used to render disabled out-of-range entries). */
    Option: any;
}

/**
 * `TimePickerField` core template.
 *
 * Renders a `SelectTextField<TimeOfDay>` with an option list built from
 * `buildTimeList`. Out-of-range options (strictly before `minTime` / after
 * `maxTime`) remain visible in the dropdown but are rendered as disabled.
 *
 * Framework-specific components are passed as a second argument by the
 * React/Vue wrappers.
 *
 * @param props      Component props.
 * @param components Injected framework-specific components.
 * @return JSX element.
 */
export const TimePickerField = (
    props: TimePickerFieldProps,
    { SelectTextField, Option }: TimePickerFieldComponents,
) => {
    const {
        options,
        translations,
        className,
        handleChange,
        handleSearch,
        handleBlur,
        getOptionProps,
        ...fowardedProps
    } = props;

    return (
        <SelectTextField
            {...fowardedProps}
            className={block([className])}
            selectionType="single"
            options={options}
            getOptionId="name"
            renderOption={({ hour, minute, outOfRange }: TimeOfDay) => {
                const { isDisabled, ...extraProps } = getOptionProps?.({ hour, minute }) || {};
                return <Option isDisabled={outOfRange || isDisabled} {...extraProps} />;
            }}
            onChange={handleChange}
            onSearch={handleSearch}
            onBlur={handleBlur}
            filter="auto"
            translations={translations}
        />
    );
};

TimePickerField.displayName = COMPONENT_NAME;
TimePickerField.className = CLASSNAME;
