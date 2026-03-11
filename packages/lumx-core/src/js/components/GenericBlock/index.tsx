import type { CommonRef, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { Orientation, Size } from '../../constants';

import { GenericBlockGapSize } from './constants';
import { FlexBoxProps } from '../FlexBox';

export interface GenericBlockProps extends FlexBoxProps {
    /**
     * Component to use as visual element.
     */
    figure?: JSXElement;
    /**
     * Main content.
     */
    content?: JSXElement;
    /**
     * Actions to set after the main content.
     */
    actions?: JSXElement;
    /**
     * Orientation of the 3 sections
     */
    orientation?: FlexBoxProps['orientation'];
    /**
     * Horizontal alignment.
     */
    hAlign?: FlexBoxProps['hAlign'];
    /**
     * Vertical alignment.
     */
    vAlign?: FlexBoxProps['vAlign'];
    /**
     * The props to forward to the content.
     * By default, the content will have the same alignment as wrapper.
     */
    contentProps?: Omit<FlexBoxProps, 'children'>;
    /**
     * props to forward to the actions element.
     */
    actionsProps?: Omit<FlexBoxProps, 'children'>;
    /**
     * props to forward to the figure element.
     */
    figureProps?: Omit<FlexBoxProps, 'children'>;
    /**
     * FlexBox component
     */
    FlexBox: (props: FlexBoxProps) => any;
    /**
     * Gap space between sections.
     */
    gap?: GenericBlockGapSize;
    /**
     * reference to the root element
     */
    ref?: CommonRef;
}

export interface GenericBlockSectionProps extends FlexBoxProps {
    /**
     * Gap space between items.
     */
    gap?: GenericBlockGapSize;
}

export type GenericBlockPropsToOverride = 'FlexBox' | 'content';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'GenericBlock';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-generic-block';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<GenericBlockProps> = {
    gap: Size.big,
    orientation: Orientation.horizontal,
};

/**
 * The GenericBlock is a layout component made of 3 sections that can be
 * displayed either horizontally of vertically with the same gap between each section.
 *
 * The sections are:
 * - `Figure` => A visual element to display before the main content.
 * - `Content` => The main content displayed
 * - `Actions` => One or more actions to set after the element.
 *
 * @see https://www.figma.com/file/lzzrQmsfaXRaOyRfoEogPZ/DS%3A-playground?node-id=1%3A4076
 */
export const GenericBlock = (props: GenericBlockProps) => {
    const {
        className,
        figure,
        figureProps,
        children,
        actions,
        actionsProps,
        gap = DEFAULT_PROPS.gap,
        ref,
        content,
        orientation = DEFAULT_PROPS.orientation,
        contentProps,
        FlexBox,
        ...forwardedProps
    } = props;

    return (
        <FlexBox
            ref={ref}
            className={classNames.join(className, block())}
            gap={gap}
            orientation={orientation}
            {...forwardedProps}
        >
            {figure && (
                <FlexBox {...figureProps} className={classNames.join(figureProps?.className, element('figure'))}>
                    {figure}
                </FlexBox>
            )}

            {content && (
                <FlexBox
                    orientation={Orientation.vertical}
                    fillSpace
                    {...contentProps}
                    className={classNames.join(contentProps?.className, element('content'))}
                >
                    {content}
                </FlexBox>
            )}

            {actions && (
                <FlexBox {...actionsProps} className={classNames.join(actionsProps?.className, element('actions'))}>
                    {actions}
                </FlexBox>
            )}
        </FlexBox>
    );
};
