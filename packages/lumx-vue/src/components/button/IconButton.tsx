import { computed, defineComponent, ref, toRaw, useAttrs } from 'vue';

import {
    IconButton as IconButtonUI,
    type IconButtonProps as UIProps,
} from '@lumx/core/js/components/Button/IconButton';

import { Tooltip, type TooltipProps } from '../tooltip/Tooltip';
import { useTheme } from '../../composables/useTheme';
import { useClassName } from '../../composables/useClassName';
import { useAttrFallback } from '../../composables/useAttrFallback';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { type HyphenatedAriaProps, keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type IconButtonProps = Omit<VueToJSXProps<UIProps>, HyphenatedAriaProps> & {
    /**
     * Props to pass to the tooltip.
     * If undefined or if tooltipProps.label is undefined, the label prop will be used as tooltip label.
     */
    tooltipProps?: Partial<TooltipProps>;
    /** Whether the tooltip should be hidden or not. */
    hideTooltip?: boolean;
};

export const emitSchema = {
    click: (event: MouseEvent) => event instanceof MouseEvent,
};

/**
 * IconButton component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const IconButton = defineComponent(
    (props: IconButtonProps, { emit, expose }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const className = useClassName(() => props.class);
        // Core JSX passes `tabIndex` (React casing); Vue/HTML uses lowercase `tabindex`.
        // useAttrFallback falls back to attrs.tabIndex when tabindex is absent.
        const tabIndex = useAttrFallback(() => attrs.tabindex as number | undefined, 'tabIndex');

        const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(
            computed(() => ({ ...props, ...attrs })),
        );

        const handleClick = (event: MouseEvent) => {
            if (isAnyDisabled.value) {
                return;
            }

            emit('click', event);
        };

        // Ref to the underlying button DOM element, exposed so template refs resolve to the button.
        const buttonRef = ref<HTMLElement>();
        expose({ $el: buttonRef });

        return () => {
            const { linkAs, tooltipProps, hideTooltip, ...rest } = otherProps.value;
            return (
                <Tooltip label={hideTooltip ? '' : props.label} {...tooltipProps}>
                    <IconButtonUI
                        {...rest}
                        ref={buttonRef}
                        linkAs={toRaw(linkAs)}
                        {...disabledStateProps.value}
                        className={className.value}
                        {...({ tabindex: tabIndex.value } as any)}
                        theme={props.theme || defaultTheme.value}
                        label={props.label}
                        handleClick={handleClick as any}
                    />
                </Tooltip>
            );
        };
    },
    {
        name: 'IconButton',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<IconButtonProps>()(
            'icon',
            'image',
            'color',
            'label',
            'emphasis',
            'hasBackground',
            'href',
            'isDisabled',
            'isSelected',
            'name',
            'size',
            'theme',
            'class',
            'aria-disabled',
            'disabled',
            'fullWidth',
            'isActive',
            'isFocused',
            'isHovered',
            'isDisabled',
            'linkAs',
            'target',
            'type',
            'title',
            'tooltipProps',
            'hideTooltip',
        ),
        emits: emitSchema,
    },
);

export default IconButton;
