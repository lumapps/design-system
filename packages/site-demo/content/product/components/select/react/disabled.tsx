import { Select, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <Select isDisabled value="" label="Select label" placeholder="Select a value" theme={theme} />
);
