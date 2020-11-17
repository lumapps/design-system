import { addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { withAngularJs } from 'storybook-addon-angularjs';

import app from './init-angular';

addDecorator(withA11y);
addDecorator(withKnobs());
addDecorator(withAngularJs(app.name));
