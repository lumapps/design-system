import { MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function LxDepthService() {
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

angular.module(`${MODULE_NAME}.utils.depth`).service('LxDepthService', LxDepthService);

/////////////////////////////

export { LxDepthService };
