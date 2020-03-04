import React from 'react';
import { render } from 'react-dom';
import { App } from './App';

import 'intersection-observer';

import { reactAngularModule } from 'react-angular';

import '@lumx/angularjs';

// @ts-ignore
angular.module('design-system', ['lumx', reactAngularModule(false).name]);

render(<App />, document.getElementById('root'));
