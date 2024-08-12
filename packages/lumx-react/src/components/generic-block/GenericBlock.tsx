import React, { Children, ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import { Comp, isComponentType } from '@lumx/react/utils/type';
import { getRootClassName } from '@lumx/core/js/utils/className';
import { partitionMulti } from '@lumx/core/js/utils/collection/partitionMulti';
import { Orientation, Size, FlexBox, FlexBoxProps } from '@lumx/react';
import { GenericBlockGapSize } from '@lumx/react/components/generic-block/constants';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

export interface GenericBlockProps extends FlexBoxProps {
    /**
     * Component to use as visual element.
     */
    figure?: ReactNode;
    /**
     * Actions to set after the main content.
     */
    actions?: ReactNode;
    /**
     * Main content to display or sections components
     * ({@see GenericBlock.Figure}, {@see GenericBlock.Content} & {@see GenericBlock.Actions})
     */
    children: ReactNode;
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
     * Gap space between sections.
     */
    gap?: GenericBlockGapSize;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'GenericBlock';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<GenericBlockProps> = {
    gap: Size.big,
    orientation: Orientation.horizontal,
};

type BaseGenericBlock = Comp<GenericBlockProps, HTMLDivElement>;

interface GenericBlockSectionProps extends FlexBoxProps {
    /**
     * Gap space between items.
     */
    gap?: GenericBlockGapSize;
}

interface GenericBlock extends BaseGenericBlock {
    /**
     * Use `GenericBlock.Figure` component as children of the `GenericBlock` component as an alternative way to inject
     * the "figure" section of the block (instead of using `figure` and `figureProps` props).
     */
    Figure: Comp<GenericBlockSectionProps>;
    /**
     * Use `GenericBlock.Content` component as children of the `GenericBlock` component as an alternative way to inject
     * the "content" section of the block (instead of using `content` and `contentProps` props).
     */
    Content: Comp<GenericBlockSectionProps>;
    /**
     * Use `GenericBlock.Actions` component as children of the `GenericBlock` component as an alternative way to inject
     * the "actions" section of the block (instead of using `actions` and `actionsProps` props).
     */
    Actions: Comp<GenericBlockSectionProps>;
}

const Figure = (() => {}) as unknown as Comp<FlexBoxProps>;
const isFigure = isComponentType(Figure);

const Content = (() => {}) as unknown as Comp<FlexBoxProps>;
const isContent = isComponentType(Content);

const Actions = (() => {}) as unknown as Comp<FlexBoxProps>;
const isActions = isComponentType(Actions);

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
const BaseGenericBlock: BaseGenericBlock = forwardRef((props, ref) => {
    const {
        className,
        figure,
        figureProps,
        children,
        actions,
        actionsProps,
        gap = DEFAULT_PROPS.gap,
        orientation = DEFAULT_PROPS.orientation,
        contentProps,
        ...forwardedProps
    } = props;

    const sections = React.useMemo(() => {
        // Split children by section type
        const [[figureChild], [contentChild], [actionsChild], ...otherChildren] = partitionMulti(
            Children.toArray(children),
            [isFigure, isContent, isActions],
        );
        return {
            figureChild,
            figureChildProps: (figureChild as ReactElement)?.props,
            contentChild,
            contentChildProps: (contentChild as ReactElement)?.props,
            actionsChild,
            actionsChildProps: (actionsChild as ReactElement)?.props,
            otherChildren: otherChildren.filter((child) => React.Children.count(child) > 0),
        };
    }, [children]);

    return (
        <FlexBox
            ref={ref}
            className={classNames(className, CLASSNAME)}
            gap={gap}
            orientation={orientation}
            {...forwardedProps}
        >
            {(figure || sections.figureChildProps?.children) && (
                <FlexBox
                    ref={(sections.figureChild as any)?.ref}
                    vAlign={forwardedProps.vAlign}
                    hAlign={forwardedProps.hAlign}
                    {...figureProps}
                    {...sections.figureChildProps}
                    className={classNames(
                        figureProps?.className,
                        sections.figureChildProps?.className,
                        `${CLASSNAME}__figure`,
                    )}
                >
                    {figure}
                    {sections.figureChildProps?.children}
                </FlexBox>
            )}

            {(sections.contentChildProps?.children || sections.otherChildren.length > 0) && (
                <FlexBox
                    ref={(sections.contentChild as any)?.ref}
                    orientation={Orientation.vertical}
                    fillSpace
                    vAlign={forwardedProps.vAlign}
                    hAlign={forwardedProps.hAlign}
                    {...contentProps}
                    {...sections.contentChildProps}
                    className={classNames(
                        contentProps?.className,
                        sections.contentChildProps?.className,
                        `${CLASSNAME}__content`,
                    )}
                >
                    {sections.contentChildProps?.children}
                    {sections.otherChildren}
                </FlexBox>
            )}

            {(actions || sections.actionsChildProps?.children) && (
                <FlexBox
                    ref={(sections.actionsChild as any)?.ref}
                    vAlign={forwardedProps.vAlign}
                    hAlign={forwardedProps.hAlign}
                    {...actionsProps}
                    {...sections.actionsChildProps}
                    className={classNames(
                        actionsProps?.className,
                        sections.actionsChildProps?.className,
                        `${CLASSNAME}__actions`,
                    )}
                >
                    {actions}
                    {sections.actionsChildProps?.children}
                </FlexBox>
            )}
        </FlexBox>
    );
});
BaseGenericBlock.displayName = COMPONENT_NAME;
BaseGenericBlock.className = CLASSNAME;
BaseGenericBlock.defaultProps = DEFAULT_PROPS;

export const GenericBlock: GenericBlock = Object.assign(BaseGenericBlock, { Figure, Content, Actions });
