import React, { Children, ReactElement, ReactNode } from 'react';

import isEmpty from 'lodash/isEmpty';
import noop from 'lodash/noop';

import { Comp, GenericProps, isComponentType } from '@lumx/react/utils/type';
import { classNames } from '@lumx/core/js/utils';
import { partitionMulti } from '@lumx/react/utils/partitionMulti';
import { FlexBox, FlexBoxProps } from '@lumx/react';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import {
    GenericBlock as UI,
    GenericBlockProps as UIProps,
    GenericBlockPropsToOverride,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    GenericBlockSectionProps as UISectionProps,
} from '@lumx/core/js/components/GenericBlock';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

export interface GenericBlockProps extends GenericProps, ReactToJSX<UIProps, GenericBlockPropsToOverride> {
    /**
     * Main content to display or sections components
     * ({@see GenericBlock.Figure}, {@see GenericBlock.Content} & {@see GenericBlock.Actions})
     */
    children: ReactNode;
}

export interface GenericBlockSectionProps extends GenericProps, ReactToJSX<UISectionProps> {
    /** Customize the root element. */
    as?: React.ElementType;
}

type BaseGenericBlock = Comp<GenericBlockProps, HTMLDivElement>;

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

const Figure = noop.bind({}) as Comp<FlexBoxProps>;
const isFigure = isComponentType(Figure);

const Content = noop.bind({}) as Comp<FlexBoxProps>;
const isContent = isComponentType(Content);

const Actions = noop.bind({}) as Comp<FlexBoxProps>;
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
    const { figure, figureProps, children, actions, actionsProps, contentProps, ...forwardedProps } = props;

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
            otherChildren: otherChildren.filter((child) => !isEmpty(child)),
        };
    }, [children]);

    const alignProps = {
        vAlign: forwardedProps.vAlign,
        hAlign: forwardedProps.hAlign,
    };

    return UI({
        ...forwardedProps,
        ref,
        FlexBox,
        actionsProps: {
            ref: (sections.actionsChild as any)?.ref,
            ...alignProps,
            ...actionsProps,
            ...sections.actionsChildProps,
            className: classNames.join(actionsProps?.className, sections.actionsChildProps?.className),
        },
        actions:
            actions || sections.actionsChildProps?.children ? (
                <>
                    {actions}
                    {sections.actionsChildProps?.children}
                </>
            ) : undefined,
        contentProps: {
            ref: (sections.contentChild as any)?.ref,
            ...alignProps,
            ...contentProps,
            ...sections.contentChildProps,
            className: classNames.join(contentProps?.className, sections.contentChildProps?.className),
        },
        content:
            sections.contentChildProps?.children || sections.otherChildren.length > 0 ? (
                <>
                    {sections.contentChildProps?.children}
                    {sections.otherChildren}
                </>
            ) : undefined,
        figureProps: {
            ref: (sections.figureChild as any)?.ref,
            ...alignProps,
            ...figureProps,
            ...sections.figureChildProps,
            className: classNames.join(figureProps?.className, sections.figureChildProps?.className),
        },
        figure:
            figure || sections.figureChildProps?.children ? (
                <>
                    {figure}
                    {sections.figureChildProps?.children}
                </>
            ) : undefined,
    });
});

BaseGenericBlock.displayName = COMPONENT_NAME;
BaseGenericBlock.className = CLASSNAME;
BaseGenericBlock.defaultProps = DEFAULT_PROPS;

export const GenericBlock: GenericBlock = Object.assign(BaseGenericBlock, { Figure, Content, Actions });
