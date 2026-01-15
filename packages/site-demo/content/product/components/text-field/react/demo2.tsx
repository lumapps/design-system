import { TextField, Theme } from '@lumx/react';
import noop from 'lodash/noop';

export default ({ theme }: { theme?: Theme }) => (
    <TextField label="Textfield label" isDisabled theme={theme} onChange={noop} value="" />
);
