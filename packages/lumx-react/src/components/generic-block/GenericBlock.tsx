import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import { Comp, getRootClassName } from '@lumx/react/utils';
import { Orientation, Size, FlexBox, FlexBoxProps, Alignment, HorizontalAlignment } from '@lumx/react';

export interface GenericBlockProps extends FlexBoxProps {
    /** Component to use as visual element. */
    figure?: ReactNode;
    /** Actions to set after the main content. */
    actions?: ReactNode;
    /** Main content to display */
    children: ReactNode;
    /** Orientation of the 3 sections */
    orientation?: FlexBoxProps['orientation'];
    /** Horizontal alignment. */
    hAlign?: FlexBoxProps['hAlign'];
    /** Vertical alignment. */
    vAlign?: FlexBoxProps['vAlign'];
    /**
     * The props to forward to the content.
     * By default, the content will have the same alignment as wrapper.
     */
    contentProps?: Omit<FlexBoxProps, 'children'>;
    /** props to forward to the actions element. */
    actionsProps?: Omit<FlexBoxProps, 'children'>;
    /** props to forward to the figure element. */
    figureProps?: Omit<FlexBoxProps, 'children'>;
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
    gap: Size.regular,
    orientation: Orientation.vertical,
    hAlign: Alignment.center,
    vAlign: Alignment.center,
};

/**
 * The GenericBlock is a layout component made of 3 sections that can be
 * displayed either horizontally of vertically with the same gap between each section.
 *
 * The sections are:
 * * (Optional) `Figure` => A visual element to display before the main content.
 * * (Required) `Content` => The main content displayed
 * * (Optional) `Actions` => One or more actions to set after the element.
 *
 * @see https://www.figma.com/file/lzzrQmsfaXRaOyRfoEogPZ/DS%3A-playground?node-id=1%3A4076
 */
export const GenericBlock: Comp<GenericBlockProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        className,
        figure,
        figureProps,
        children,
        actions,
        actionsProps,
        gap,
        orientation,
        contentProps,
        ...forwardedProps
    } = props;

    let actionsVAlign: HorizontalAlignment = Alignment.center;
    if (orientation === Orientation.horizontal) {
        actionsVAlign = Alignment.right;
    }
    let contentVAlign: HorizontalAlignment = Alignment.center;
    if (orientation === Orientation.horizontal) {
        contentVAlign = Alignment.left;
    }

    return (
        <FlexBox
            ref={ref}
            className={classNames(className, CLASSNAME)}
            gap={gap}
            orientation={orientation}
            {...forwardedProps}
        >
            <FlexBox {...figureProps} className={classNames(figureProps?.className, `${CLASSNAME}__figure`)}>
                {figure}
            </FlexBox>

            {children && (
                <FlexBox
                    orientation={Orientation.vertical}
                    fillSpace
                    vAlign={contentVAlign}
                    {...contentProps}
                    className={classNames(contentProps?.className, `${CLASSNAME}__content`)}
                >
                    {children}
                </FlexBox>
            )}

            <FlexBox
                vAlign={actionsVAlign}
                {...actionsProps}
                className={classNames(actionsProps?.className, `${CLASSNAME}__actions`)}
            >
                {actions}
            </FlexBox>
        </FlexBox>
    );
});
GenericBlock.displayName = COMPONENT_NAME;
GenericBlock.className = CLASSNAME;
GenericBlock.defaultProps = DEFAULT_PROPS;
