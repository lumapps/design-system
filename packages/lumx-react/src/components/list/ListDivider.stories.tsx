import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { List } from '@lumx/react';
import { ListDivider } from './ListDivider';

export default {
    title: 'LumX components/list/ListDivider',
    component: ListDivider,
    args: ListDivider.defaultProps,
    decorators: [withWrapper({}, List)],
};

export const Default = {};
