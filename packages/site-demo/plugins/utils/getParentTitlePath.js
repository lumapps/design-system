const flow = require('lodash/fp/flow');
const split = require('lodash/fp/split');
const filter = require('lodash/fp/filter');
const map = require('lodash/fp/map');
const startCase = require('lodash/startCase');
const dropRight = require('lodash/fp/dropRight');

/** Transform a slug into an array of the parent folders with `startCase` applied to them. */
const getParentTitlePath = ({ slug }) =>
    flow(
        split('/'),
        filter(Boolean),
        dropRight(1),
        map(startCase),
    )(slug);

module.exports = getParentTitlePath;
