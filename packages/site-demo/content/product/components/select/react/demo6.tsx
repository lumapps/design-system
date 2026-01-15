import { Select, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <Select isValid value="" label="Select label" placeholder="Select a value" theme={theme} />
);
