(function IIFE() {
    'use strict';

    /////////////////////////////

    LxEventSchedulerService.$inject = ['$document', 'LxUtilsService'];

    function LxEventSchedulerService($document, LxUtilsService) {
        var service = this;

        /////////////////////////////
        //                         //
        //    Private attributes   //
        //                         //
        /////////////////////////////

        /**
         * The handlers.
         *
         * @type {Object}
         */
        var _handlers = {};

        /**
         * The schedule.
         *
         * @type {Object}
         */
        var _schedule = {};

        /////////////////////////////
        //                         //
        //    Private functions    //
        //                         //
        /////////////////////////////

        /**
         * Handle en event.
         *
         * @param {Event} evt The event.
         */
        function _handle(evt) {
            var scheduler = _schedule[evt.type];

            if (angular.isDefined(scheduler)) {
                for (var i = 0, length = scheduler.length; i < length; i++) {
                    var handler = scheduler[i];

                    if (angular.isDefined(handler) && angular.isDefined(handler.callback) && angular.isFunction(handler.callback)) {
                        handler.callback(evt);

                        if (evt.isPropagationStopped()) {
                            break;
                        }
                    }
                }
            }
        }

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        /**
         * Register en event.
         *
         * @param {string}   eventName The event name.
         * @param {Function} callback  The event callback.
         */
        function register(eventName, callback) {
            var handler = {
                eventName: eventName,
                callback: callback
            };

            var id = LxUtilsService.generateUUID();
            _handlers[id] = handler;

            if (angular.isUndefined(_schedule[eventName])) {
                _schedule[eventName] = [];

                $document.on(eventName, _handle);
            }

            _schedule[eventName].unshift(_handlers[id]);

            return id;
        }

        /**
         * Unregister en event.
         *
         * @param {string} id The event id.
         */
        function unregister(id) {
            var found = false;
            var handler = _handlers[id];

            if (angular.isDefined(handler) && angular.isDefined(_schedule[handler.eventName])) {
                var index = _schedule[handler.eventName].indexOf(handler);

                if (angular.isDefined(index) && index > -1) {
                    _schedule[handler.eventName].splice(index, 1);

                    delete _handlers[id];
                    found = true;
                }

                if (_schedule[handler.eventName].length === 0) {
                    delete _schedule[handler.eventName];

                    $document.off(handler.eventName, _handle);
                }
            }

            return found;
        }

        /////////////////////////////

        service.register = register;
        service.unregister = unregister;
    }

    /////////////////////////////

    angular.module('lumx.utils.event-scheduler').service('LxEventSchedulerService', LxEventSchedulerService);
})();
