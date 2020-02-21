import { mdiFile } from '@lumx/icons';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { AspectRatio, ColorPalette, ColorVariant, Size, Theme } from '..';
import { Icon } from '../icon/Icon';
import { Link } from '../link/Link';
import { Thumbnail, ThumbnailVariant } from '../thumbnail/Thumbnail';
import { IFile } from './types';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IFileAttachmentProps extends IGenericProps, IFile {
    /** The theme. */
    theme?: Theme;
}
type FileAttachmentProps = IFileAttachmentProps;

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}FileAttachment`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<FileAttachmentProps> = {
    theme: Theme.light,
};

const FileAttachment: React.FC<FileAttachmentProps> = ({
    className,
    icon = DEFAULT_PROPS.icon,
    thumbnail,
    title,
    url = '',
    description,
    theme = DEFAULT_PROPS.theme,
    ...props
}) => {
    const fileName = useMemo(() => url.substr(url.lastIndexOf('/') + 1) || '', [url]);
    const onFileClick = useCallback(() => window.open(url, '_blank'), [url]);
    return (
        <div className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))} {...props}>
            {thumbnail ? (
                <Thumbnail
                    role="link"
                    variant={ThumbnailVariant.rounded}
                    onClick={onFileClick}
                    tabIndex={0}
                    {...thumbnail}
                    size={Size.l}
                    aspectRatio={AspectRatio.square}
                />
            ) : (
                <Icon
                    role="link"
                    tabIndex={0}
                    onClick={onFileClick}
                    icon={mdiFile}
                    theme={theme}
                    color={theme === Theme.light ? ColorPalette.dark : ColorPalette.light}
                    {...icon}
                    className={classNames(`${CLASSNAME}__icon`, icon?.className)}
                    size={Size.l}
                />
            )}
            <div className={`${CLASSNAME}__infos`}>
                <Link
                    className={`${CLASSNAME}__title`}
                    color={theme === Theme.light ? ColorPalette.dark : ColorPalette.light}
                    colorVariant={ColorVariant.N}
                    href={url}
                >
                    {title}
                </Link>
                <p className={`${CLASSNAME}__description`}>{description}</p>
                <Link
                    className={`${CLASSNAME}__link`}
                    color={theme === Theme.light ? ColorPalette.blue : ColorPalette.light}
                    colorVariant={ColorVariant.N}
                    href={url}
                >
                    {fileName}
                </Link>
            </div>
        </div>
    );
};

FileAttachment.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, FileAttachment, FileAttachmentProps };
