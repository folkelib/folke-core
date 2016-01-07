import * as ko from "knockout";
import Folke from "./folke";

export function register() {
    ko.components.register('popin-close-button', {
        template: '<button type="button" data-bind="click: close" class="close"><span class="fa fa-close"></span></button>',
        viewModel: { instance: { close: function() { Folke.hidePopin(); } } }
    });

    ko.components.register('folke-view', {
        template: `<!-- ko with: popin -->
<div class="popin-background" data-bind="click: $parent.hidePopin"></div>
<div data-bind="component: { name: id, params:params }, css: id"></div>
<!-- /ko -->
<!-- ko foreach: pages -->
<div data-bind="component: { name: id, params: params }, css: id"></div>
<!-- /ko -->`,
        viewModel: { instance: Folke }
    });
}