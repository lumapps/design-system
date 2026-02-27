import { classNames } from '@lumx/core/js/utils';

export default () => (
    <div style={{ border: '1px dashed rgba(40, 51, 109, 0.2)', minWidth: 300 }}>
        <div
            className={classNames.join(
                classNames.background('primary'),
                classNames.margin('vertical', 'big'),
                classNames.margin('left', 'huge'),
            )}
            style={{ height: 100 }}
        />
    </div>
);
