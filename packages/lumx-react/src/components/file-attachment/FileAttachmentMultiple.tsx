import { mdiFile } from '@lumx/icons';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactElement, ReactNode } from 'react';
import { AspectRatio, Size } from '..';
import { Icon } from '../icon/Icon';
import { List } from '../list/List';
import { ListDivider } from '../list/ListDivider';
import { ListItem } from '../list/ListItem';
import { Thumbnail, ThumbnailVariant } from '../thumbnail/Thumbnail';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IBaseFileAttachmentMultipleProps extends IGenericProps {
    /**
     * FileAttachmentMultiple content.
     */
    children?: ReactNode;
    files: Array<{
        fileUrl?: string;

        fileTitle?: string;

        fileImage?: string;

        fileIcon?: ReactElement;

        fileDescription?: string;
    }>;
}

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
const DEFAULT_PROPS: IBaseFileAttachmentMultipleProps = {
    files: [],
};

const FileAttachmentMultiple: React.FC<IBaseFileAttachmentMultipleProps> = ({
    className,
    files,
}: IBaseFileAttachmentMultipleProps): ReactElement => {
    return (
        <List isClickable className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}>
            {files.map(({ fileImage, fileIcon = <Icon icon={mdiFile} size={Size.m} />, fileUrl }, index) => {
                return (
                    <>
                        <ListItem
                            before={
                                fileImage ? (
                                    <Thumbnail
                                        size={Size.m}
                                        variant={ThumbnailVariant.rounded}
                                        aspectRatio={AspectRatio.square}
                                        image={fileImage}
                                    />
                                ) : (
                                    fileIcon
                                )
                            }
                        >
                            <p className={`${CLASSNAME}__link`}>{fileUrl?.substr(fileUrl.lastIndexOf('/') + 1)}</p>
                        </ListItem>
                        {index < files.length - 1 && (
                            <ListDivider
                                style={{
                                    margin: '0px 16px',
                                    marginLeft: '68px',
                                }}
                            />
                        )}
                    </>
                );
            })}
        </List>
    );
};

FileAttachmentMultiple.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, FileAttachmentMultiple, IBaseFileAttachmentMultipleProps };
