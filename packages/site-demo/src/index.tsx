import React from 'react';
import { render } from 'react-dom';
import { App } from './App';

import angular from 'angular';

import '@lumx/angularjs';

import { MODULE_NAME } from '@lumx/angularjs/constants/common_constants';

angular.module('design-system', [MODULE_NAME]);

/////////////////////////////

render(<App />, document.getElementById('root'));
