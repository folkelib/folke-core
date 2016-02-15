import * as ko from "knockout";
import * as Folke from "./folke";

class ConfirmPopup {
    title: string;
    message: string;

    constructor(private parameters: Folke.Parameters<boolean>) {
        this.title = parameters['title'] || 'Veuillez confirmer';
        this.message = parameters['message'];
    }

    confirm = () => {
        Folke.default.hidePopin();
        this.parameters.resolve(true);
    }

    cancel = () => {
        Folke.default.hidePopin();
    }
}

export function register() {
    ko.components.register('popin-close-button', {
        template: '<button type="button" data-bind="click: close" class="close"><span class="fa fa-close"></span></button>',
        viewModel: { instance: { close: function() { Folke.default.hidePopin(); } } }
    });

    ko.components.register('folke-view', {
        template: `<!-- ko with: popin -->
<div class="popin-background" data-bind="click: $parent.hidePopin"></div>
<div data-bind="component: { name: id, params:params }, css: id"></div>
<!-- /ko -->
<!-- ko foreach: pages -->
<div data-bind="component: { name: id, params: params }, css: id"></div>
<!-- /ko -->`,
        viewModel: { instance: Folke.default }
    });

    ko.components.register('popin-confirm', {
        template: `<section class="popin"><header><popin-close-button></popin-close-button><div data-bind="text: title"></div></header>
                    <section>
                    <div data-bind="text: message"></div>
                    <button data-bind="click: confirm">Confirmer</button>
                    <button data-bind="click: cancel">Annuler</button>
                    </section>`,
        viewModel: ConfirmPopup
    });
}