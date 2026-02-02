import { HeadingElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { TextProps } from '../Text';
import { DEFAULT_TYPOGRAPHY_BY_LEVEL } from './constants';

/**
 * Defines the props of the component.
 */
export interface HeadingProps extends Partial<TextProps> {
    /**
     * Display a specific heading level instead of the one provided by parent context provider.
     */
    as?: HeadingElement;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Heading';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-heading';

/**
 * Component default props.
 */
export const DEFAULT_PROPS = {} as const;

/**
 * Get Heading component common props
 *
 * @param props                 Component props.
 * @param contextHeadingElement Heading element from context.
 * @return Common Props
 */
export const getHeadingProps = (props: HeadingProps, contextHeadingElement?: HeadingElement) => {
    const { as, className, typography, ...otherProps } = props;
    const computedHeadingElement = as || contextHeadingElement || 'h1';

    return {
        ...otherProps,
        as: computedHeadingElement,
        className: classNames.join(className, CLASSNAME),
        typography: typography || DEFAULT_TYPOGRAPHY_BY_LEVEL[computedHeadingElement],
    };
};
