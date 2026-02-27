import { classNames } from '@lumx/core/js/utils';

export default () => (
    <div className={classNames.join(classNames.background('primary'), classNames.padding('huge'))}>
        <span className={classNames.font('light')}>The quick brown fox jumps over the lazy dog</span>
    </div>
);
