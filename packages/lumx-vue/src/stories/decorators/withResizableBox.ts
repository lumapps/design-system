import { withWrapper } from './withWrapper';

/** Storybook decorator wrapping story in a resizable box  */
export const withResizableBox = ({
    width = '150px',
    height = '50px',
    ...style
}: { width?: string; height?: string; [key: string]: any } = {}) => {
    return withWrapper({
        style: {
            display: 'flex',
            width,
            height,
            border: '1px solid red',
            resize: 'both',
            overflow: 'hidden',
            ...style,
        },
    });
};
