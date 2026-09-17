import { InputRequiredLegend, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <InputRequiredLegend label="Indicates a required field" theme={theme} />
);
