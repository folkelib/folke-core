define(["require", "exports", "knockout", "./folke"], function (require, exports, ko, folke_1) {
    function register() {
        ko.components.register('popin-close-button', {
            template: '<button type="button" data-bind="click: close" class="close"><span class="fa fa-close"></span></button>',
            viewModel: { instance: { close: function () { folke_1["default"].hidePopin(); } } }
        });
        ko.components.register('folke-view', {
            template: "<!-- ko with: popin -->\n<div class=\"popin-background\" data-bind=\"click: $parent.hidePopin\"></div>\n<div data-bind=\"component: { name: id, params:params }, css: id\"></div>\n<!-- /ko -->\n<!-- ko foreach: pages -->\n<div data-bind=\"component: { name: id, params: params }, css: id\"></div>\n<!-- /ko -->",
            viewModel: { instance: folke_1["default"] }
        });
    }
    exports.register = register;
});
