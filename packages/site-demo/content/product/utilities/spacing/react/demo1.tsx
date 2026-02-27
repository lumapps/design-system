import { classNames } from '@lumx/core/js/utils';

export default () => (
    <div style={{ border: '1px dashed rgba(40, 51, 109, 0.2)' }}>
        <div
            className={classNames.join(
                'lumx-color-background-primary-N',
                classNames.margin('vertical', 'big'),
                classNames.margin('left', 'huge'),
            )}
            style={{ height: 100 }}
        />
    </div>
);
