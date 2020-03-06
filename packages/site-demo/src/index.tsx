import React from 'react';
import { render } from 'react-dom';
import { reactAngularModule } from 'react-angular';
import '@lumx/angularjs';
import 'intersection-observer';

import { App } from './App';

angular.module('design-system', ['lumx', reactAngularModule(false).name]);

render(<App />, document.getElementById('root'));
