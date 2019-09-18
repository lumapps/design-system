import { MODULE_NAME, SERVICE_PREFIX } from '../constants/common_constants';

/////////////////////////////

function DepthService() {
    'ngInject';

    const service = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The initial depth.
     *
     * @type {number}
     */
    // eslint-disable-next-line no-magic-numbers
    let _depth = 1000;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Get the highest depth.
     *
     * @return {number} The highest depth.
     */
    function get() {
        return _depth;
    }

    /**
     * Increase depth.
     */
    function increase() {
        _depth++;
    }

    /////////////////////////////

    service.get = get;
    service.increase = increase;
}

/////////////////////////////

angular.module(`${MODULE_NAME}.utils.depth`).service(`${SERVICE_PREFIX}DepthService`, DepthService);

/////////////////////////////

export { DepthService };
