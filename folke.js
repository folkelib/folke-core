define(["require", "exports", "knockout", "crossroads", "hasher"], function (require, exports, ko, Crossroads, Hasher) {
    "use strict";
    var Page = (function () {
        function Page() {
        }
        return Page;
    }());
    exports.Page = Page;
    var Application = (function () {
        function Application() {
            var _this = this;
            // TODO see if it useful to have an array instead one only page
            this.pages = ko.observableArray();
            this.popin = ko.observable(null);
            this.defaultRoute = null;
            this.defaultRoutePriority = 0;
            /**
             * Hides the pop-in
             */
            this.hidePopin = function () {
                _this.popin(null);
            };
        }
        /**
         * Adds a route handler
         * @param route The route. May contain {example} for mandatory parameters, :example: for optional parameters.
         *              * is a wildcard to for "everything until the end".
         * @param onRoute A function that will be called when the route is called. May also be a component id, in which
         *                case this.goToView will be called for this component.
         * @param priority The priority, used to create a default route (higher number is more priority).
         */
        Application.prototype.addRoute = function (route, onRoute, priority) {
            var _this = this;
            if (priority === void 0) { priority = 0; }
            if (typeof onRoute === "string") {
                Crossroads.addRoute(route, function (params) {
                    _this.goToView(onRoute, params);
                });
                if (priority > this.defaultRoutePriority || this.defaultRoutePriority === 0) {
                    this.defaultRoute = function (params) { return _this.goToView(onRoute, params); };
                    this.defaultRoutePriority = priority || 0;
                }
            }
            else {
                Crossroads.addRoute(route, function (params) {
                    onRoute(params);
                });
                if (priority > this.defaultRoutePriority || this.defaultRoutePriority === 0) {
                    this.defaultRoute = onRoute;
                    this.defaultRoutePriority = priority || 0;
                }
            }
        };
        /**
         * Shows a component and hides all the components that are already displayed (including popins).
         * @param viewId The component to show
         * @param params The parameters for the component
         */
        Application.prototype.goToView = function (viewId, params) {
            var views = this.pages();
            for (var _i = 0, views_1 = views; _i < views_1.length; _i++) {
                var view = views_1[_i];
                view.closing = true;
            }
            this.popin(null);
            var ret = this.showPage(viewId, params, true, true);
            for (var i = 0; i < views.length; i++) {
                var view = views[i];
                if (view.closing) {
                    this.pages.splice(i, 1);
                    i--;
                }
            }
            return ret;
        };
        /**
         * Registers a component with knockout that have a code and a template of the same name and in the same directory
         * @param path The directory in which the component is
         * @param id The id of the component. Must be the same as the names of the script and the HTML template files (minus the extension)
         */
        Application.prototype.registerComponent = function (path, id) {
            ko.components.register(id, { viewModel: { require: path + "/" + id }, template: { require: 'text!' + path + "/" + id + '.html' } });
        };
        /**
         * Shows a pop-in
         * @param viewId The view id (must have been registered with registerComponent)
         * @param params The params for the popin
         * @returns A promise with the choice of the user
         */
        Application.prototype.showPopin = function (viewId, params) {
            var _this = this;
            if (params === void 0) { params = {}; }
            if (params && params.resolve) {
                // If this is called from a popin that replaces another popin: keep the promise
                this.popin({ id: viewId, params: params });
            }
            else {
                return new Promise(function (resolve, reject) {
                    params.reject = reject;
                    params.resolve = resolve;
                    _this.popin({ id: viewId, params: params });
                });
            }
        };
        /**
         * Shows a confirm pop-in (with the 'popin-confirm' name)
         * @param title The title
         * @param message The message
         */
        Application.prototype.confirm = function (title, message) {
            return this.showPopin('popin-confirm', { title: title, message: message });
        };
        /**
         * Shows a component without hidding already displayed components
         * @param viewId The view id (see registerComponent)
         * @param params The parameters for the page
         * @param before If the page must be shown above the current pages
         * @param main Not used (TODO ?)
         */
        Application.prototype.showPage = function (viewId, params, before, main) {
            var _this = this;
            if (params === void 0) { params = {}; }
            if (before === void 0) { before = false; }
            if (main === void 0) { main = false; }
            return new Promise(function (resolve, reject) {
                var serializedParams = JSON.stringify(params);
                params.reject = reject;
                params.resolve = resolve;
                var views = _this.pages();
                for (var _i = 0, views_2 = views; _i < views_2.length; _i++) {
                    var view_1 = views_2[_i];
                    if (view_1.id == viewId && view_1.serializedParams == serializedParams) {
                        view_1.closing = false;
                        return;
                    }
                }
                var view = { id: viewId, closing: false, serializedParams: serializedParams, params: params };
                if (before)
                    _this.pages.unshift(view);
                else
                    _this.pages.push(view);
            });
        };
        /**
         * The entry point. Should be called when everything is ready.
         */
        Application.prototype.start = function () {
            var _this = this;
            ko.applyBindings(this);
            if (this.defaultRoute) {
                Crossroads.addRoute('', function (params) { return _this.defaultRoute(params); });
            }
            Crossroads.normalizeFn = Crossroads.NORM_AS_OBJECT;
            function parseHash(newHash) {
                Crossroads.parse(newHash);
            }
            Hasher.initialized.add(parseHash);
            Hasher.changed.add(parseHash);
            Hasher.init();
        };
        return Application;
    }());
    exports.Application = Application;
    exports.__esModule = true;
    exports["default"] = new Application();
});
