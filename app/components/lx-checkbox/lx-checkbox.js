(function IIFE() {
    'use strict';

    /////////////////////////////

    lxCheckboxControler.$inject = ['$element', 'LxRipple', 'LxUtils'];

    function lxCheckboxControler($element, LxRipple, LxUtils) {
        var lxCheckbox = this;

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
         * The checkbox id.
         *
         * @type {string}
         */
        lxCheckbox.checkboxId = LxUtils.generateUUID();

        /**
         * Wether the directive has children directive or not.
         *
         * @type {boolean}
         */
        lxCheckbox.hasChildren = false;

        /**
         * The model view value.
         *
         * @type {string}
         */
        lxCheckbox.viewValue = undefined;

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
                lxCheckbox.viewValue = _modelController.$viewValue;
            }
        }

        /**
         * Update model controller view value on checkbox click.
         */
        function updateViewValue() {
            _modelController.$setViewValue(!_modelController.$viewValue);
            _modelController.$render();

            LxRipple.launch($element.find('.lx-checkbox__background'), 'center');
        }

        /////////////////////////////

        lxCheckbox.setModelController = setModelController;
        lxCheckbox.updateViewValue = updateViewValue;
    }

    /////////////////////////////

    function lxCheckboxDirective() {
        function link(scope, el, attrs, ctrls, transclude) {
            ctrls[0].setModelController(ctrls[1]);

            if (transclude.isSlotFilled('label') && transclude.isSlotFilled('help')) {
                 ctrls[0].hasChildren = true;
            }

            attrs.$observe('disabled', function(isDisabled) {
                el.find('input').attr('disabled', isDisabled);

                if (isDisabled) {
                    el.addClass('lx-checkbox--is-disabled');
                } else {
                    el.removeClass('lx-checkbox--is-disabled');
                }
            });
        }

        return {
            bindToController: true,
            controller: lxCheckboxControler,
            controllerAs: 'lxCheckbox',
            link: link,
            replace: true,
            require: ['lxCheckbox','ngModel'],
            restrict: 'E',
            scope: {},
            templateUrl: 'components/lx-checkbox/checkbox.html',
            transclude: {
                help: '?lxCheckboxHelp',
                label: '?lxCheckboxLabel',
            },
        };
    }

    /////////////////////////////

    angular.module('lumx.checkbox').directive('lxCheckbox', lxCheckboxDirective);
})();
