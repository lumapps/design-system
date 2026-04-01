import { computed, defineComponent, toRaw, useAttrs, type VNode } from 'vue';

import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

import {
    UserBlock as UserBlockUI,
    type UserBlockProps as UIProps,
    UserBlockPropsToOverride,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    element,
    isUserBlockClickeable,
    type UserBlockSize,
} from '@lumx/core/js/components/UserBlock';
import { ColorPalette } from '@lumx/core/js/constants';
import type { JSXElement } from '@lumx/core/js/types';

import { useTheme } from '../../composables/useTheme';
import { useClassName } from '../../composables/useClassName';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { classNames } from '@lumx/core/js/utils';

import { Avatar, type AvatarProps } from '../avatar';
import { Link } from '../link';
import Text from '../text/Text';
import { useHasEventListener } from '@lumx/vue/composables/useHasEventListener';

export type { UserBlockSize };

export type UserBlockProps = VueToJSXProps<
    UIProps,
    | UserBlockPropsToOverride
    | 'handleClick'
    | 'handleMouseEnter'
    | 'handleMouseLeave'
    | 'simpleAction'
    | 'multipleActions'
    | 'additionalFields'
    | 'after'
> & {
    /** Props to pass to the avatar. */
    avatarProps?: Omit<AvatarProps, 'alt'>;
    /** Props to pass to the link wrapping the avatar thumbnail. */
    linkProps?: Record<string, any>;
};

export const emitSchema = {
    click: () => true,
    mouseenter: () => true,
    mouseleave: () => true,
};

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * UserBlock component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const UserBlock = defineComponent(
    (props: UserBlockProps, { emit, slots }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const className = useClassName(() => props.class);

        const handleClick = () => {
            emit('click');
        };

        const handleMouseEnter = () => {
            emit('mouseenter');
        };

        const handleMouseLeave = () => {
            emit('mouseleave');
        };

        const hasOnClick = useHasEventListener('onClick');
        const hasOnMouseEnter = useHasEventListener('onMouseenter');
        const hasOnMouseLeave = useHasEventListener('onMouseleave');

        /**
         * This logic needs to occur on the wrapper level, since core templates cannot manage
         * the render of dynamically determined components. So `NameComponent`, if moved to core,
         * it will return an `undefined`
         */
        const nameBlock = computed((): VNode | null => {
            const name = props.name || slots.name?.();
            if (isEmpty(name)) {
                return null;
            }

            const isClickable = isUserBlockClickeable({
                linkAs: props.linkAs,
                linkProps: props.linkProps,
                handleClick: hasOnClick ? handleClick : undefined,
            });

            let NameComponent: any = 'span';
            const nProps: any = {
                ...props.nameProps,
                class: classNames.join(element('name'), props.linkProps?.class, props.nameProps?.class),
            };

            if (isClickable) {
                NameComponent = Link;
                Object.assign(nProps, {
                    ...props.linkProps,
                    color: ColorPalette.dark,
                });
            }

            return (
                <NameComponent {...nProps} onClick={handleClick}>
                    <Text as="span">{name}</Text>
                </NameComponent>
            ) as VNode;
        });

        // Create modified avatarProps with tabIndex if clickable
        const computedAvatarProps = computed(() => {
            if (!props.avatarProps) return undefined;

            const isClickable = isUserBlockClickeable({
                linkAs: props.linkAs,
                linkProps: props.linkProps,
                handleClick,
            });

            if (isClickable) {
                // Disable avatar focus since the name block is the same link / same button.
                const modifiedProps = { ...props.avatarProps };
                set(modifiedProps, ['thumbnailProps', 'tabIndex'], -1);
                return modifiedProps;
            }

            return props.avatarProps;
        });

        return () => {
            const { linkAs, fields, ...restProps } = props;
            const childrenContent = slots.default?.() || nameBlock.value;

            return (
                <UserBlockUI
                    {...restProps}
                    {...attrs}
                    linkAs={toRaw(linkAs)}
                    className={className.value}
                    theme={props.theme || defaultTheme.value}
                    handleClick={hasOnClick ? handleClick : undefined}
                    handleMouseEnter={hasOnMouseEnter ? handleMouseEnter : undefined}
                    handleMouseLeave={hasOnMouseLeave ? handleMouseLeave : undefined}
                    avatarProps={computedAvatarProps.value}
                    fields={(fields || slots.fields?.()) as any}
                    simpleAction={(slots['simple-action']?.() || slots.simpleAction?.()) as JSXElement}
                    multipleActions={(slots['multiple-actions']?.() || slots.multipleActions?.()) as JSXElement}
                    additionalFields={(slots['additional-fields']?.() || slots.additionalFields?.()) as JSXElement}
                    after={slots.after?.() as JSXElement}
                    Avatar={(avProps) => {
                        const { badge, ...restAvatarProps } = avProps;
                        return (
                            <Avatar {...restAvatarProps}>
                                {{
                                    badge: badge ? () => badge : undefined,
                                }}
                            </Avatar>
                        );
                    }}
                    Text={Text as unknown as UIProps['Text']}
                    children={childrenContent as JSXElement}
                    mouseEnterProp="onMouseenter"
                    mouseLeaveProp="onMouseleave"
                />
            );
        };
    },
    {
        name: 'LumxUserBlock',
        inheritAttrs: false,
        props: keysOf<UserBlockProps>()(
            'avatarProps',
            'class',
            'fields',
            'linkAs',
            'linkProps',
            'name',
            'nameProps',
            'orientation',
            'size',
            'theme',
        ),
        emits: emitSchema,
    },
);

export default UserBlock;
