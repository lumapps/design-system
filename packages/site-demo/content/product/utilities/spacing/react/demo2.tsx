import { classNames } from '@lumx/core/js/utils';

export default () => (
    <div className={classNames.join('lumx-color-background-primary-N', classNames.padding('huge'))}>
        <span className="lumx-color-font-light-N">The quick brown fox jumps over the lazy dog</span>
    </div>
);
