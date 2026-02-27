import { classNames } from '@lumx/core/js/utils';
import { Button, FlexBox, Link, Text, Heading } from '@lumx/react';

/**
 * Action area card with overlay and outset focus ring.
 * Clicking the card area navigates to the link. The button remains independently clickable.
 */
export default () => (
    <FlexBox
        as="article"
        orientation="vertical"
        gap="regular"
        className={classNames.join(classNames.actionArea(), classNames.padding('regular'))}
    >
        <Heading as="h2">
            <Link
                className={classNames.actionArea.action({ 'has-overlay': true, 'focus-outset': true })}
                href="https://example.com"
            >
                Card title
            </Link>
        </Heading>
        <Text as="p">Hover to see the overlay. The button below is independently clickable.</Text>
        <Button size="s" emphasis="medium" onClick={() => alert('Secondary action clicked!')}>
            Secondary action
        </Button>
    </FlexBox>
);
