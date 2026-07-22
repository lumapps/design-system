import { computed, defineComponent, ref, watch } from 'vue';

import {
    TimePickerField as UI,
    type TimePickerFieldProps as UIProps,
    type TimePickerFieldWrapperProps,
    type TimePickerFieldOwnedSelectProps,
    DEFAULT_PROPS,
    COMPONENT_NAME,
} from '@lumx/core/js/components/TimePickerField';
import {
    buildTimeList,
    formatTime,
    getDateAtTime,
    isDateOnTime,
    parseTimeInput,
    snapTimeToBounds,
} from '@lumx/core/js/utils/time';
import { getCurrentLocale } from '@lumx/core/js/utils/locale/getCurrentLocale';

import { getName, keysOf, type ClassValue } from '../../utils/VueToJSX';
import { useClassName } from '../../composables/useClassName';
import { SelectTextField, SelectTextFieldOption } from '../select-text-field';

import type { SingleSelectTextFieldProps } from '../select-text-field/SelectTextField';

/**
 * Inherited SelectTextField props (less the parts owned by TimePickerField).
 */
type InheritedSelectTextFieldProps = Omit<SingleSelectTextFieldProps<any>, TimePickerFieldOwnedSelectProps | 'class'>;

/**
 * `TimePickerField` props.
 */
export interface TimePickerFieldProps extends InheritedSelectTextFieldProps, TimePickerFieldWrapperProps {
    /** CSS class. */
    class?: ClassValue;
}

/**
 * TimePickerField events schema.
 */
export const emitSchema = {
    /**
     * Selection change. Payload is the new `Date` whose date part is inherited
     * from the previous `value` (or today, if none) and whose time-of-day
     * matches the user selection. May be `undefined` when the field is cleared.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    change: (_newValue?: Date) => true,
};

/**
 * A select-style picker for choosing a time of day. Wraps `SelectTextField`
 * with a generated list of times built from `step`, `minTime`, and `maxTime`.
 *
 * Out-of-range options (strictly before `minTime` or after `maxTime`) remain
 * visible in the dropdown but are rendered as disabled.
 *
 * Free-form typed input (e.g. `"10:30 PM"`, `"14"`, `"930"`) is parsed on blur.
 */
const TimePickerField = defineComponent(
    (props: TimePickerFieldProps, { emit }) => {
        const className = useClassName(() => props.class);
        const locale = computed(() => props.locale ?? getCurrentLocale());
        const step = computed(() => props.step ?? DEFAULT_PROPS.step);
        const boundsMode = computed(() => props.boundsMode ?? DEFAULT_PROPS.boundsMode);

        // Build the option list — re-computed only when bounds/step/locale change.
        const timeList = computed(() =>
            buildTimeList({
                step: step.value,
                minTime: props.minTime,
                maxTime: props.maxTime,
                locale: locale.value,
            }),
        );

        // Track the user's last non-empty typed input.
        const committedSearch = ref<string>('');

        // Resolve the option that matches the current value (by time-of-day).
        const selectedOption = computed(() => {
            const { value } = props;
            if (!value) return undefined;
            return {
                hour: value.getHours(),
                minute: value.getMinutes(),
                name: formatTime(value, locale.value),
            };
        });

        // Clamp the current value to bounds whenever enforce mode is set and value/bounds change.
        watch(
            () => [boundsMode.value, props.value, props.minTime, props.maxTime],
            () => {
                if (boundsMode.value !== 'enforce' || !props.value) return;

                const timeOfDay = {
                    hour: props.value.getHours(),
                    minute: props.value.getMinutes(),
                };
                const clamped = snapTimeToBounds(timeOfDay, props.minTime, props.maxTime);

                if (clamped.hour !== props.value.getHours() || clamped.minute !== props.value.getMinutes()) {
                    emit('change', getDateAtTime(clamped, props.value));
                }
            },
            { immediate: true },
        );

        const handleChange: UIProps['handleChange'] = (next) => {
            const date = next ? getDateAtTime(next, props.value) : undefined;
            emit('change', date);
        };

        const handleSearch: UIProps['handleSearch'] = (typed) => {
            if (typed) committedSearch.value = typed;
        };

        const handleBlur: UIProps['handleBlur'] = () => {
            const typed = committedSearch.value;
            // Reset our local typed-value tracking; SelectTextField clears its own internal copy.
            committedSearch.value = '';
            if (!typed) return;
            const parsed = parseTimeInput(typed);
            if (!parsed) return;

            // Snap to bounds if needed, then dedup against the current value.
            const time = snapTimeToBounds(parsed, props.minTime, props.maxTime);
            if (props.value && isDateOnTime(props.value, time)) return;

            emit('change', getDateAtTime(time, props.value));
        };

        return () => {
            const searchInputValue = props.value ? formatTime(props.value, locale.value) : undefined;

            const {
                value: _value,
                locale: _locale,
                step: _step,
                minTime: _minTime,
                maxTime: _maxTime,
                translations,
                class: _class,
                getOptionProps,
                ...forwardedProps
            } = props;

            return UI(
                {
                    ...(forwardedProps as any),
                    value: selectedOption.value,
                    options: timeList.value,
                    translations,
                    className: className.value,
                    handleChange,
                    handleSearch,
                    handleBlur,
                    searchInputValue,
                    getOptionProps,
                },
                { SelectTextField, Option: SelectTextFieldOption },
            );
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<TimePickerFieldProps>()(
            'value',
            'locale',
            'step',
            'minTime',
            'maxTime',
            'boundsMode',
            'translations',
            'getOptionProps',
            'class',
            // Inherited SelectTextField props
            'label',
            'placeholder',
            'icon',
            'isDisabled',
            'aria-disabled',
            'isRequired',
            'hasError',
            'error',
            'helper',
            'id',
            'name',
            'isValid',
            'ariaLabel',
            'inputProps',
            'theme',
            'hasClearButton',
        ),
        emits: emitSchema,
    },
);

export default TimePickerField;
