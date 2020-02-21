import { mdiFile } from '@lumx/icons';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { Fragment, ReactElement, ReactNode } from 'react';
import { AspectRatio, ColorPalette, ColorVariant, Size, Theme } from '..';
import { Icon } from '../icon/Icon';
import { Link } from '../link/Link';
import { List } from '../list/List';
import { ListDivider } from '../list/ListDivider';
import { ListItem } from '../list/ListItem';
import { Thumbnail, ThumbnailVariant } from '../thumbnail/Thumbnail';
import { IFile } from './types';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IFileAttachmentMultipleProps extends IGenericProps {
    /** Theme. */
    theme: Theme;
    /**
     * FileAttachmentMultiple content.
     */
    children?: ReactNode;
    /** Array of files you want to display. */
    files: IFile[];
}
type FileAttachmentMultipleProps = IFileAttachmentMultipleProps;

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}FileAttachmentMultiple`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<FileAttachmentMultipleProps> = {
    theme: Theme.light,
};

const makeOnFileClick = (url?: string) => () => window.open(url, '_blank');

const FileAttachmentMultiple: React.FC<FileAttachmentMultipleProps> = ({
    className,
    files,
    theme = DEFAULT_PROPS.theme,
    ...props
}) => {
    return (
        <List className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))} {...props}>
            {files.map(({ thumbnail, icon = { icon: mdiFile }, url }, index) => {
                return (
                    <Fragment key={url}>
                        <ListItem
                            className={`${CLASSNAME}__file`}
                            before={
                                thumbnail ? (
                                    <Thumbnail
                                        role="link"
                                        variant={ThumbnailVariant.rounded}
                                        onClick={makeOnFileClick(url)}
                                        tabIndex={0}
                                        {...thumbnail}
                                        size={Size.m}
                                        aspectRatio={AspectRatio.square}
                                    />
                                ) : (
                                    <Icon
                                        role="link"
                                        icon={mdiFile}
                                        color={theme === Theme.light ? ColorPalette.dark : ColorPalette.light}
                                        theme={theme}
                                        onClick={makeOnFileClick(url)}
                                        tabIndex={0}
                                        {...icon}
                                        className={classNames(`${CLASSNAME}__file-icon`, icon.className)}
                                        size={Size.m}
                                    />
                                )
                            }
                        >
                            <Link
                                className={`${CLASSNAME}__link`}
                                href={url}
                                target="_blank"
                                color={theme === Theme.light ? ColorPalette.blue : ColorPalette.light}
                                colorVariant={ColorVariant.N}
                            >
                                {url.substr(url.lastIndexOf('/') + 1)}
                            </Link>
                        </ListItem>
                        {index < files.length - 1 && <ListDivider className={`${CLASSNAME}__divider`} />}
                    </Fragment>
                );
            })}
        </List>
    );
};

FileAttachmentMultiple.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, FileAttachmentMultiple, FileAttachmentMultipleProps };
