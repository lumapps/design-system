import '../style/lx-radio-button.scss';

(function IIFE() {
    'use strict';

    /////////////////////////////

    lxRadioButtonControler.$inject = ['$element', 'LxUtilsService'];

    function lxRadioButtonControler($element, LxUtilsService) {
        var lxRadioButton = this;

        /////////////////////////////
        //                         //
        //    Private attributes   //
        //                         //
        /////////////////////////////

        /**
         * The model controller.
         *
         * @type {Object}
         */
        var _modelController;

        /////////////////////////////
        //                         //
        //    Public attributes    //
        //                         //
        /////////////////////////////

        /**
         * The radio button id.
         *
         * @type {string}
         */
        lxRadioButton.radioButtonId = LxUtilsService.generateUUID();

        /**
         * Wether the directive has help slot filled or not.
         *
         * @type {boolean}
         */
        lxRadioButton.hasHelp = false;

        /**
         * Wether the directive has label slot filled or not.
         *
         * @type {boolean}
         */
        lxRadioButton.hasLabel = false;

        /**
         * Wether the directive has transcluded content if no transclude slot.
         *
         * @type {boolean}
         */
        lxRadioButton.hasTranscluded = false;

        /**
         * The radio button value.
         *
         * @type {string}
         */
        lxRadioButton.radioButtonValue = undefined;

        /**
         * The model view value.
         *
         * @type {string}
         */
        lxRadioButton.viewValue = undefined;

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        /**
         * Set the model controller.
         *
         * @param {Object} modelController The model controller.
         */
        function setModelController(modelController) {
            _modelController = modelController;

            _modelController.$render = function onModelRender() {
                lxRadioButton.viewValue = _modelController.$viewValue;
            };
        }

        /**
         * Update model controller view value on radio button click.
         */
        function updateViewValue() {
            if (angular.isUndefined(_modelController)) {
                return;
            }

            _modelController.$setViewValue(lxRadioButton.radioButtonValue);
            _modelController.$render();
        }

        /////////////////////////////

        lxRadioButton.setModelController = setModelController;
        lxRadioButton.updateViewValue = updateViewValue;
    }

    /////////////////////////////

    function lxRadioButtonDirective() {
        function link(scope, el, attrs, ctrls, transclude) {
            if (ctrls[1]) {
                ctrls[0].setModelController(ctrls[1]);
            }

            if (transclude.isSlotFilled('label')) {
                ctrls[0].hasLabel = true;
            }

            if (transclude.isSlotFilled('help')) {
                ctrls[0].hasHelp = true;
            }

            if (!ctrls[0].hasLabel && !ctrls[0].hasHelp) {
                transclude(function(clone) {
                    if (clone.length) {
                        ctrls[0].hasTranscluded = true;
                    }
                });
            }

            attrs.$observe('disabled', function(isDisabled) {
                el.find('input').attr('disabled', isDisabled);

                if (isDisabled) {
                    el.addClass('lx-radio-button--is-disabled');
                } else {
                    el.removeClass('lx-radio-button--is-disabled');
                }
            });

            attrs.$observe('name', function(newName) {
                el.find('input').attr('name', newName);
            });

            attrs.$observe('value', function(newValue) {
                el.find('input').attr('value', newValue);

                ctrls[0].radioButtonValue = newValue;
            });
        }

        return {
            bindToController: true,
            controller: lxRadioButtonControler,
            controllerAs: 'lxRadioButton',
            link: link,
            replace: true,
            require: ['lxRadioButton', '?ngModel'],
            restrict: 'E',
            scope: {
                theme: '@?lxTheme',
            },
            templateUrl: 'src/components/lx-radio-button/angular-js/lx-radio-button.html',
            transclude: {
                help: '?lxRadioButtonHelp',
                label: '?lxRadioButtonLabel',
            },
        };
    }

    /////////////////////////////

    angular.module('lumx.radio-button').directive('lxRadioButton', lxRadioButtonDirective);
})();
