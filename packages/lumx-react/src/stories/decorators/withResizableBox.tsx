import { withWrapper } from './withWrapper';

/** Storybook decorator wrapping story in a resizable box  */
export const withResizableBox = ({ width = 150, height = 50 } = {}) =>
    withWrapper({
        style: {
            display: 'flex',
            width,
            height,
            border: '1px solid red',
            resize: 'both',
            overflow: 'hidden',
        },
    });
