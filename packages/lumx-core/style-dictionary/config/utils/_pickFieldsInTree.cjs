const _ = require('lodash');
const fp = require('lodash/fp');

module.exports = function pickFieldsInTree(object, fields) {
    if (!_.isPlainObject(object)) return null;

    const values = fields.map((field) => _.get(object, field));
    if (values.filter(Boolean).length > 0) {
        return values.reduce((acc, value, index) => {
            if (value) return _.set(acc, fields[index], value);
            return acc;
        }, {});
    }

    return fp.flow(
        Object.entries,
        fp.filter(([, value]) => _.isPlainObject(value)),
        fp.map(([key, value]) => [key, pickFieldsInTree(value, fields)]),
        fp.filter(([, value]) => !_.isEmpty(value)),
        Object.fromEntries,
    )(object);
};
