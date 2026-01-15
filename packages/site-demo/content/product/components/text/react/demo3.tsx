import { Text } from '@lumx/react';

export default () => (
    <>
        <div style={{ maxWidth: '180px', overflow: 'hidden' }}>
            <code>default</code>
            <Text as="p" typography="body2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>
        </div>
        <div style={{ maxWidth: '180px', overflow: 'hidden' }}>
            <code>no wrap</code>
            <Text as="p" typography="body2" noWrap>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>
        </div>
        <div style={{ maxWidth: '180px', overflow: 'hidden' }}>
            <code>truncate</code>
            <Text as="p" typography="body2" truncate>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>
        </div>
        <div style={{ maxWidth: '180px', overflow: 'hidden' }}>
            <code>truncate multiline</code>
            <Text as="p" typography="body2" truncate={{ lines: 2 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>
        </div>
    </>
);
