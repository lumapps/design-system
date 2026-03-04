import { classNames } from '@lumx/core/js/utils';
import { Divider, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <Divider theme={theme} className={classNames.margin('vertical', 'big')} />
);
